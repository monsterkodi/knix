
class Connector extends Widget

    constructor: (config) ->

        super config,
            type: 'connector'

        Drag.create
            target: @elem
            minPos: pos(undefined,0)
            cursor: 'grab'
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

    addConnection: (c) =>
        @connections.add c
        @elem.addClassName 'connected'

    delConnection: (c) =>
        @connections.delete c
        @elem.removeClassName('connected') if @connections.size == 0

    connectorAtPos: (p) =>
        elem = document.elementFromPoint p.x, p.y
        if elem?.widget?
            if elem.widget.constructor == Connector and elem.widget.isSignal() != @isSignal()
                return elem.widget
        undefined

    dragMove: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            @path.path.addClass('connectable')
            @path.setStartDir if @elem.hasClassName('signal') then pos(100,0) else pos(-100,0)
            @path.setEndDir if conn.elem.hasClassName('signal') then pos(100,0) else pos(-100,0)
        else
            @path.path.removeClass('connectable')
            @path.setStartDir if @elem.hasClassName('signal') then pos(200,0) else pos(-200,0)
            @path.setEndDir pos(0,0)

        @handle.setPos p
        @path.setEnd p

    dragStart: (drag,event) =>

        p = drag.absPos(event)
        # log "Connector::onStart", p

        @handle = knix.get
            type:  'handle'
            style:
                pointerEvents: 'none'
                cursor: 'grabbing'

        @path = knix.get
            type:  'path'
            class: 'connector'
            startDir: if @elem.hasClassName('signal') then pos(200,0) else pos(-200,0)

        @elem.style.cursor = 'grabbing'
        @path.setStart p
        @path.setEnd p

        @handle.setPos p

    dragStop: (drag,event) =>

        p = drag.absPos(event)
        # log "Connector::onStop", p

        if conn = @connectorAtPos p
            @path.path.stroke color: "rgba(0,100,255,1)"
            new Connection
                source: @
                target: conn

        if 1
            @handle.close()
            @path.path.remove()
