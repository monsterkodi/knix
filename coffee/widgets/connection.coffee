
class Connection

    constructor: (config) ->

        # log 'Connection', config.source.elem.id, config.target.elem.id

        for c in [config.source, config.target]
            c.addConnection @
            e = c.elem
            c.getWindow().elem.on 'size',  @update
            c.getWindow().elem.on 'move',  @update
            c.getWindow().elem.on 'shade', @shaded
            c.getWindow().elem.on 'close', @closed

        @path = knix.get
            type:  'path'
            class: 'connection'
            startDir: if config.source.isSignal() then pos(100,0) else pos(-100,0)
            endDir:   if config.target.isSignal() then pos(100,0) else pos(-100,0)

        @path.setStart config.source.absCenter()
        @path.setEnd   config.target.absCenter()
        @config = config

        @connect()

    connect: =>
        [signalConnector, slotConnector] = @signalSlotConnector()
        signal = signalConnector.config.signal
        slot   = slotConnector.config.slot
        [signalSender, signalEvent] = signalConnector.resolveSignal(signal)
        slotFunction = slotConnector.resolveSlot(slot)
        handler:  signalSender.elem.on signalEvent, slotFunction
        sender:   signalSender
        event:    signalEvent
        receiver: slotFunction

    signalSlotConnector: =>
        [
            (@config.source if @config.source.config.signal?) or @config.target,
            (@config.source if @config.source.config.slot?)   or @config.target
        ]

    update: (event,e) =>
        @path.setStart @config.source.absCenter()
        @path.setEnd   @config.target.absCenter()

    closed: (event,e) =>
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
