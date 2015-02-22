###

 0000000   0000000   000   000  000   000  00000000   0000000  000000000   0000000   00000000 
000       000   000  0000  000  0000  000  000       000          000     000   000  000   000
000       000   000  000 0 000  000 0 000  0000000   000          000     000   000  0000000  
000       000   000  000  0000  000  0000  000       000          000     000   000  000   000
 0000000   0000000   000   000  000   000  00000000   0000000     000      0000000   000   000

###

class Connector extends Widget

    constructor: (config) ->

        config.class = 'slot'   if config.slot?
        config.class = 'signal' if config.signal?
        config.class = 'in'     if config.in?
        config.class = 'out'    if config.out?

        super config,
            type: 'connector'
            onOver: @onOver
            onOut:  @onOut
            noMove: true

        Drag.create
            target: @elem
            minPos: pos(undefined,0)
            cursor: 'grab'
            doMove: false
            onStart: @dragStart
            onMove:  @dragMove
            onStop:  @dragStop

        @connections = []

    close: =>
        @connections = []
        super()

    isSignal: => @config.signal?
    isSlot:   => @config.slot?
    isIn:     => @isSlot() or @config.in
    isOut:    => @isSignal() or @config.out

    addConnection: (c) =>
        @connections.push c if c not in @connections
        @elem.addClassName 'connected'

    delConnection: (c) =>
        _.remove @connections, (n) -> n == c
        @elem.removeClassName('connected') if @connections.length == 0

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
            startDir: if @isOut() then pos(100,-10) else pos(-100,-10)

        @elem.style.cursor = 'grabbing'

    dragMove: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            @path.path.addClass 'connectable'
            @path.setStartDir if @isOut() then pos(100,1) else pos(-100,-1)
            @path.setEndDir if conn.isOut() then pos(100,1) else pos(-100,-1)
            @conn = conn
            @conn.elem.addClassName 'highlight'
            @handle.elem.addClassName 'highlight'
        else
            @path.path.removeClass 'connectable'
            @path.setStartDir if @isOut() then pos(100,-10) else pos(-100,-10)
            @path.setEndDir pos(0,0)
            if @conn then @conn.elem.removeClassName 'highlight'; @conn = null
            @handle.elem.removeClassName 'highlight'

        @handle.setPos p
        @path.setEnd p

    dragStop: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            new Connection
                source: @
                target: conn
            conn.elem.removeClassName 'highlight'
        else if @connections.length == 0
            @elem.removeClassName 'connected'

        if 1
            @handle.close()
            @path.path.remove()
