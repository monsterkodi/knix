
class Connection

    constructor: (config) ->

        log 'Connection', config.source.elem.id, config.target.elem.id

        src = config.source.elem
        src.addClassName 'connected'
        src.getWindow().elem.on 'size',  @update.bind(@)
        src.getWindow().elem.on 'move',  @update.bind(@)
        src.getWindow().elem.on 'shade', @update.bind(@)
        tgt = config.target.elem
        tgt.addClassName 'connected'
        tgt.getWindow().elem.on 'size',  @update.bind(@)
        tgt.getWindow().elem.on 'move',  @update.bind(@)
        tgt.getWindow().elem.on 'shade', @update.bind(@)

        @path = knix.get
            type:  'path'
            class: 'connection'
            startDir: if src.hasClassName('signal') then pos(100,0) else pos(-100,0)
            endDir:   if tgt.hasClassName('signal') then pos(100,0) else pos(-100,0)

        @path.setStart config.source.absCenter()
        @path.setEnd   config.target.absCenter()
        @config = config

    update: (event,e) ->
        log 'update'
        @path.setStart @config.source.absCenter()
        @path.setEnd   @config.target.absCenter()
