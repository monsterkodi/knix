
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
                cursor: 'grabbing'

        log "Connector::onStart", drag.absPos(event)
        @handle.setPos drag.absPos(event)

    dragMove: (drag,event) ->

        # log "Connector::onMove", drag.absPos(event)

        @handle.setPos drag.absPos(event)

    dragStop: (drag,event) ->

        log "Connector::onStop", drag.absPos(event)
        @handle.close()
