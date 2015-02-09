
class Connection

    constructor: (config) ->

        # log 'Connection', config.source.elem.id, config.target.elem.id

        src = config.source.elem
        src.addClassName 'connected'
        src.getWindow().elem.on 'size',  @update
        src.getWindow().elem.on 'move',  @update
        src.getWindow().elem.on 'shade', @shaded
        tgt = config.target.elem
        tgt.addClassName 'connected'
        tgt.getWindow().elem.on 'size',  @update
        tgt.getWindow().elem.on 'move',  @update
        tgt.getWindow().elem.on 'shade', @shaded

        @path = knix.get
            type:  'path'
            class: 'connection'
            startDir: if src.hasClassName('signal') then pos(100,0) else pos(-100,0)
            endDir:   if tgt.hasClassName('signal') then pos(100,0) else pos(-100,0)

        @path.setStart config.source.absCenter()
        @path.setEnd   config.target.absCenter()
        @config = config

    update: (event,e) =>
        @path.setStart @config.source.absCenter()
        @path.setEnd   @config.target.absCenter()

    shaded: (event,e) =>
        log not event.detail.shaded,
            @config.source.elem.visible(),
            @config.target.elem.visible(),
            @config.source.getWindow().config.isShaded == false,
            @config.target.getWindow().config.isShaded == false
        visible = not event.detail.shaded and
            @config.source.elem.visible() and
            @config.target.elem.visible() and
            @config.source.getWindow().config.isShaded == false and
            @config.target.getWindow().config.isShaded == false
        if visible
            @path.setStart @config.source.absCenter()
            @path.setEnd   @config.target.absCenter()
        @path.setVisible visible
