###

     0000000  0000000   000   000  000   000  00000000  0000000 000000000  0000000   00000000
    000      000   000  0000  000  0000  000  000      000         000    000   000  000   000
    000      000   000  000 0 000  000 0 000  000000   000         000    000   000  0000000
    000      000   000  000  0000  000  0000  000      000         000    000   000  000   000
     0000000  0000000   000   000  000   000  00000000  0000000    000     0000000   000   000

###

class Connector extends Widget

    constructor: (config) ->

        config.class = 'slot'   if config.slot?
        config.class = 'signal' if config.signal?

        super config,
            type: 'connector'
            onOver: @onOver
            onOut:  @onOut

        Drag.create
            target: @elem
            minPos: pos(undefined,0)
            cursor: 'grab'
            doMove: false
            onStart: @dragStart
            onMove:  @dragMove
            onStop:  @dragStop

        @connections = new Set()

    close: =>
        @connections.clear()
        @connections = null
        super()

    isSignal: => @elem.hasClassName('signal')
    isSlot:   => @elem.hasClassName('slot')
    isIn:     => @isSlot() or @config.in
    isOut:    => @isSignal() or @config.out

    addConnection: (c) =>
        @connections.add c
        @elem.addClassName 'connected'

    delConnection: (c) =>
        @connections.delete c
        @elem.removeClassName('connected') if @connections.size == 0

    canConnectTo: (other) =>
        return true if @isSignal() and other.isSlot() or @isSlot() and other.isSignal()
        return @config.in? and @config.in == other.config.out or @config.out? and @config.out == other.config.in

    connectorAtPos: (p) =>
        @handle.elem.style.pointerEvents = 'none'
        elem = document.elementFromPoint p.x, p.y
        @handle.elem.style.pointerEvents = 'auto'
        if elem?.widget?
            if elem.widget.constructor == Connector and @canConnectTo(elem.widget)
                return elem.widget
        undefined

    onOver: (event) =>
        p = Stage.absPos(event)
        if @elem == document.elementFromPoint(p.x, p.y)
            @elem.addClassName 'highlight'

    onOut: =>
        @elem.removeClassName 'highlight'

    dragStart: (drag,event) =>

        p = drag.absPos(event)

        @handle = knix.get
            type:  'handle'
            style:
                cursor: 'grabbing'

        @handle.setPos p
        @elem.addClassName 'connected'

        @path = knix.get
            type:  'path'
            class: 'connector'
            start:  @absCenter()
            end:    p
            startDir: if @isOut() then pos(200,0) else pos(-200,0)

        @elem.style.cursor = 'grabbing'

    dragMove: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            @path.path.addClass 'connectable'
            @path.setStartDir if @isOut() then pos(100,0) else pos(-100,0)
            @path.setEndDir if conn.isOut() then pos(100,0) else pos(-100,0)
            @conn = conn
            @conn.elem.addClassName 'highlight'
            @handle.elem.addClassName 'highlight'
        else
            @path.path.removeClass 'connectable'
            @path.setStartDir if @isOut() then pos(200,0) else pos(-200,0)
            @path.setEndDir pos(0,0)
            if @conn then @conn.elem.removeClassName 'highlight'; @conn = null
            @handle.elem.removeClassName 'highlight'

        @handle.setPos p
        @path.setEnd p

    dragStop: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            log 'new connection'
            new Connection
                source: @
                target: conn
            conn.elem.removeClassName 'highlight'
        else if @connections.size == 0
            @elem.removeClassName 'connected'

        if 1
            @handle.close()
            @path.path.remove()
