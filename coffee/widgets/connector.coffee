
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

    dragStart: (drag,event) ->

        @handle = knix.get
            type:  'handle'
            style:
                pointerEvents: 'none'
                cursor: 'grabbing'

        @path = knix.get
            type:  'path'

        @elem.style.cursor = 'grabbing'
        @path.setStart drag.absPos(event)
        @path.setEnd drag.absPos(event)

        log "Connector::onStart", drag.absPos(event)
        @handle.setPos drag.absPos(event)

    dragMove: (drag,event) ->

        # log "Connector::onMove", drag.absPos(event)
        p = drag.absPos(event)
        elem = document.elementFromPoint p.x, p.y
        log elem.id if elem?
        @handle.setPos p
        @path.setEnd p

    dragStop: (drag,event) ->

        log "Connector::onStop", drag.absPos(event)
        # @handle.close()
        # @path.path.remove()
