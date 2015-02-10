
class Connection

    constructor: (config) ->

        # log 'Connection', config.source.elem.id, config.target.elem.id

        @config = config

        for c in [@config.source, @config.target]
            c.addConnection @
            e = c.elem
            c.getWindow().elem.on 'size',  @update
            c.getWindow().elem.on 'move',  @update
            c.getWindow().elem.on 'shade', @shaded
            c.getWindow().elem.on 'close', @close

        @path = knix.get
            type:     'path'
            class:    'connection'
            startDir: if @config.source.isSignal() then pos(100,0) else pos(-100,0)
            endDir:   if @config.target.isSignal() then pos(100,0) else pos(-100,0)
            onOver:   @onOver
            onOut:    @onOut
            onMove:   @onMove

        @drag = Drag.create
            target:  @path.path
            cursor:  'grab'
            doMove:  false
            onStart: @dragStart
            onMove:  @dragMove
            onStop:  @dragStop

        @path.setStart @config.source.absCenter()
        @path.setEnd   @config.target.absCenter()

        @connection = @connect()

    closestConnectors: (p) =>
        ds = p.distSquare(@config.source.absPos())
        dt = p.distSquare(@config.target.absPos())
        if ds < dt then [@config.source, @config.target] else [@config.target, @config.source]

    dragStart: (drag,event) =>
        [target, drag.connector] = @closestConnectors drag.absPos(event)
        drag.connector.dragStart drag, event
        target.delConnection @
        @path.path.hide()

    dragMove: (drag,event) =>
        drag.connector.dragMove drag, event

    dragStop: (drag,event) =>
        drag.connector.dragStop drag, event
        @close()

    onOver: (event,e) =>
        [closer, farther] = @closestConnectors Stage.absPos(event)
        closer.elem.addClassName 'highlight'
        farther.elem.removeClassName 'highlight'
        @path.path.addClass 'highlight'

    onMove: (event,e) =>
        [closer, farther] = @closestConnectors Stage.absPos(event)
        closer.elem.addClassName 'highlight'
        farther.elem.removeClassName 'highlight'

    onOut: (event,e)  =>
        [closer, farther] = @closestConnectors Stage.absPos(event)
        closer.elem.removeClassName 'highlight'
        farther.elem.removeClassName 'highlight'
        @path.path.removeClass 'highlight'

    connect: =>
        [signalConnector, slotConnector] = @signalSlotConnector()
        signal = signalConnector.config.signal
        slot   = slotConnector.config.slot
        log @path.path.id(), "connect", signal, slot
        [signalSender, signalEvent] = signalConnector.resolveSignal(signal)
        slotFunction = slotConnector.resolveSlot(slot)
        handler:  signalSender.elem.on signalEvent, slotFunction
        sender:   signalSender
        event:    signalEvent
        signal:   signal
        slot:     slot
        receiver: slotFunction

    disconnect: =>
        log @path.path.id(), "disconnect", @connection.signal, @connection.slot
        @connection.handler.stop()
        @conncetion = null

    signalSlotConnector: =>
        [
            (@config.source if @config.source.config.signal?) or @config.target,
            (@config.source if @config.source.config.slot?)   or @config.target
        ]

    update: (event,e) =>
        @path.setStart @config.source.absCenter()
        @path.setEnd   @config.target.absCenter()

    close: =>
        @disconnect()
        @config.source.delConnection @
        @config.target.delConnection @
        @path.close()
        @path = null
        @config = null

    shaded: (event,e) =>
        visible = not event.detail.shaded and
            @config.source.elem.visible() and
            @config.target.elem.visible() and
            @config.source.getWindow().config.isShaded == false and
            @config.target.getWindow().config.isShaded == false
        if visible
            @path.setStart @config.source.absCenter()
            @path.setEnd   @config.target.absCenter()
        @path.setVisible visible
