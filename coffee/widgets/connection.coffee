
class Connection

    constructor: (config) ->

        log "Connection", config.source.elem.id, config.target.elem.id

        @path = knix.get
            type:  'path'
            class: 'connection'

        @path.setStart config.source.absCenter()
        @path.setEnd   config.target.absCenter()

        log config.source.absCenter(), config.target.absCenter()
        log @path.path
