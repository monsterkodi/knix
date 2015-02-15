###

     0000000   0000000   000   000  000   000  00000000  0000000 000000000  000   0000000   000   000
    000       000   000  0000  000  0000  000  000      000         000     000  000   000  0000  000
    000       000   000  000 0 000  000 0 000  000000   000         000     000  000   000  000 0 000
    000       000   000  000  0000  000  0000  000      000         000     000  000   000  000  0000
     0000000   0000000   000   000  000   000  00000000  0000000    000     000   0000000   000   000

###

class Connection

    constructor: (config) ->

        log config.source.elem.id, config.target.elem.id

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
            startDir: if @config.source.isOut() then pos(100,1) else pos(-100,-1)
            endDir:   if @config.target.isOut() then pos(100,1) else pos(-100,-1)
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
        @disconnect()
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
        [outConnector, inConnector] = @outInConnector()
        # log 'connect',
        #     outConnector.config.signal or outConnector.config.out,
        #     inConnector.config.slot or inConnector.config.in
        if outConnector.config.onConnect?
            outConnector.config.onConnect outConnector, inConnector
        if inConnector.config.onConnect?
            inConnector.config.onConnect inConnector, outConnector

        connection =
            out: outConnector
            in:  inConnector

        signal = outConnector.config.signal
        slot   = inConnector.config.slot

        if signal? and slot?
            [signalSender, signalEvent] = outConnector.resolveSignal(signal)
            slotFunction = inConnector.resolveSlot(slot)
            connection.handler  = signalSender.elem.on signalEvent, slotFunction
            connection.sender   = signalSender
            connection.event    = signalEvent
            connection.signal   = signal
            connection.slot     = slot
            connection.receiver = slotFunction

        connection

    disconnect: =>
        if @connection
            log "disconnect", @connection.out.elem.id, @connection.in.elem.id #@path.path.id()

            if @connection.out.config.onDisconnect?
                @connection.out.config.onDisconnect @connection.out, @connection.in
            if @connection.in.config.onDisconnect?
                @connection.in.config.onDisconnect @connection.in, @connection.out

            if @connection?.handler?
                @connection.handler.stop()

            @connection = null

    outInConnector: =>
        [
            (@config.source if @config.source.isOut()?) or @config.target,
            (@config.source if @config.source.isIn()?)  or @config.target
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
