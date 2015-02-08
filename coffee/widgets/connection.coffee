
class Connection

    constructor: (config) ->

        log "Connection", config.source.elem.id, config.target.elem.id

        src = config.source.elem
        src.addClassName 'connected'
        tgt = config.target.elem
        tgt.addClassName 'connected'

        @path = knix.get
            type:  'path'
            class: 'connection'
            startDir: if src.hasClassName('signal') then pos(100,0) else pos(-100,0)
            endDir:   if tgt.hasClassName('signal') then pos(100,0) else pos(-100,0)

        @path.setStart config.source.absCenter()
        @path.setEnd   config.target.absCenter()

        log config.source.absCenter(), config.target.absCenter()
        log @path.path
