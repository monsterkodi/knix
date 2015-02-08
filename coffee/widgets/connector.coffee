
class Connector extends Widget

    constructor: (config) ->

        super config,
            type: 'connector'

        Drag.create
            target: @elem
            minPos: pos(undefined,0)
            cursor: 'grab'
            onStart: @dragStart.bind(@)
            onMove:  @dragMove.bind(@)
            onStop:  @dragStop.bind(@)

    connectorAtPos: (p) ->
        elem = document.elementFromPoint p.x, p.y
        if elem?.widget?
            if elem.widget.constructor == Connector and elem.widget != @
                return elem.widget
        undefined

    dragMove: (drag,event) ->

        p = drag.absPos(event)
        # log "Connector::onMove", p

        if conn = @connectorAtPos p
            @path.path.stroke color: "rgba(0,100,255,1)"
        else
            @path.path.stroke color: "rgba(255,100,0,1)"

        @handle.setPos p
        @path.setEnd p

    dragStart: (drag,event) ->

        p = drag.absPos(event)
        # log "Connector::onStart", p

        @handle = knix.get
            type:  'handle'
            style:
                pointerEvents: 'none'
                cursor: 'grabbing'

        @path = knix.get
            type:  'path'

        @elem.style.cursor = 'grabbing'
        @path.setStart p
        @path.setEnd p

        @handle.setPos p

    dragStop: (drag,event) ->

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
