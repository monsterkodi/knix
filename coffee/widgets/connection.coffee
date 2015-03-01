###

 0000000   0000000   000   000  000   000  00000000   0000000  000000000  000   0000000   000   000
000       000   000  0000  000  0000  000  000       000          000     000  000   000  0000  000
000       000   000  000 0 000  000 0 000  0000000   000          000     000  000   000  000 0 000
000       000   000  000  0000  000  0000  000       000          000     000  000   000  000  0000
 0000000   0000000   000   000  000   000  00000000   0000000     000     000   0000000   000   000

###

class Connection

    constructor: (cfg, defs) ->
    
        if _.isArray cfg
            cfg =
                source: $(cfg[0]).widget
                target: $(cfg[1]).widget

        @config = _.def cfg, defs
        
        for c in [@config.source, @config.target]
            c.addConnection @
            e = c.elem
            w = c.getWindow().elem
            w.addEventListener 'size',  @update
            w.addEventListener 'move',  @update
            w.addEventListener 'shade', @shaded
            w.addEventListener 'close', @close

        @path = new Path
            class:    'connection'
            parent:   'stage_content'
            startDir: if @config.source.isOut() then pos(100,1) else pos(-100,-1)
            endDir:   if @config.target.isOut() then pos(100,1) else pos(-100,-1)
            onOver:   @onOver
            onOut:    @onOut
            onMove:   @onMove
            
        @path.connection = @

        @drag = Drag.create
            target:  @path.path.node
            cursor:  'grab'
            doMove:  false
            onStart: @dragStart
            onMove:  @dragMove
            onStop:  @dragStop

        @path.setStart @config.source.absCenter()
        @path.setEnd   @config.target.absCenter()

        @connection = @connect()
        
    toJSON: () => 
        if @config.source? and @config.target?
            [ @config.source.elem.id, @config.target.elem.id ]
        else
            []

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

    onOver: (event) =>
        [closer, farther] = @closestConnectors Stage.absPos(event)
        closer.elem.addClassName 'highlight'
        farther.elem.removeClassName 'highlight'
        @path.path.addClass 'highlight'

    onMove: (event) =>
        [closer, farther] = @closestConnectors Stage.absPos(event)
        closer.elem.addClassName 'highlight'
        farther.elem.removeClassName 'highlight'

    onOut: (event)  =>
        [closer, farther] = @closestConnectors Stage.absPos(event)
        closer.elem.removeClassName 'highlight'
        farther.elem.removeClassName 'highlight'
        @path.path.removeClass 'highlight'

    connect: =>
        [outConnector, inConnector] = @outInConnector()
        # log 'connect',
        #     outConnector.config.signal or outConnector.config.out,
        #     inConnector.config.slot or inConnector.config.in
        log 'connect', outConnector.config, inConnector.config
        # if outConnector.config.onConnect?
        #     log 'onConnect out'
        #     outConnector.config.onConnect outConnector, inConnector
        # if inConnector.config.onConnect?
        #     log 'onConnect in'
        #     inConnector.config.onConnect inConnector, outConnector
            
        outConnector.emit 'onConnect', {source:outConnector, target:inConnector}
        # inConnector.emit  'onConnect', {source:inConnector, target:outConnector}

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
            log signal, slot
        connection

    disconnect: =>
        if @connection
            log "disconnect", @connection.out.elem.id, @connection.in.elem.id #@path.path.id()

            # if @connection.out.config.onDisconnect?
            #     @connection.out.config.onDisconnect @connection.out, @connection.in
            # if @connection.in.config.onDisconnect?
            #     @connection.in.config.onDisconnect @connection.in, @connection.out

            @connection.out.emit 'onDisconnect', {source:@connection.out, target:@connection.in}
            # @connection.in.emit  'onDisconnect', {source:@connection.in, target:@connection.out}

            if @connection?.handler?
                @connection.handler.stop()

            @connection = null

    outInConnector: =>
        [
            (@config.source if @config.source.isOut()?) or @config.target,
            (@config.source if @config.source.isIn()?)  or @config.target
        ]

    update: =>
        if @path?
            @path.setStart @config.source.absCenter()
            @path.setEnd   @config.target.absCenter()

    close: =>
        @disconnect()
        if @config?
            @config.source.delConnection @
            @config.target.delConnection @
            @config = null
        if @path?
            @path.close()
            @path = null

    shaded: (event) =>
        visible = not event.detail.shaded and
            @config.source.elem.visible() and
            @config.target.elem.visible() and
            @config.source.getWindow().config.isShaded == false and
            @config.target.getWindow().config.isShaded == false
        if visible
            @path.setStart @config.source.absCenter()
            @path.setEnd   @config.target.absCenter()
        @path.setVisible visible
