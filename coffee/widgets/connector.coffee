
class Connector extends Widget

    constructor: (config) ->

        config.class = 'slot'   if config.slot?
        config.class = 'signal' if config.signal?

        super config,
            type: 'connector'

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

    dragStart: (drag,event) =>

        p = drag.absPos(event)

        @handle = knix.get
            type:  'handle'
            style:
                pointerEvents: 'none'
                cursor: 'grabbing'

        @handle.setPos p

        @path = knix.get
            type:  'path'
            class: 'connector'
            start:  @absPos()
            end:    p
            startDir: if @isSignal() then pos(200,0) else pos(-200,0)

        @elem.style.cursor = 'grabbing'

    dragMove: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            @path.path.addClass('connectable')
            @path.setStartDir if @isSignal() then pos(100,0) else pos(-100,0)
            @path.setEndDir if conn.isSignal() then pos(100,0) else pos(-100,0)
        else
            @path.path.removeClass('connectable')
            @path.setStartDir if @isSignal() then pos(200,0) else pos(-200,0)
            @path.setEndDir pos(0,0)

        @handle.setPos p
        @path.setEnd p

    dragStop: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            new Connection
                source: @
                target: conn

        if 1
            @handle.close()
            @path.path.remove()
