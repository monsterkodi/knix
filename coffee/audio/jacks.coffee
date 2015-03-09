###

      000   0000000    0000000  000   000   0000000
      000  000   000  000       000  000   000     
      000  000000000  000       0000000    0000000 
000   000  000   000  000       000  000        000
 0000000   000   000   0000000  000   000  0000000 

###

class Jacks extends Hbox

    init: (cfg, defs) =>
    
        cfg = _.def cfg, defs
                
        cfg = _.def cfg,
            type: 'jacks'

        children = []

        if not (cfg.hasInput == false)
            children.push
                type : 'connector'
                in   : 'audio'

        children.push
            type       : 'jack_content'
            style      :
                width  : '100%'
                height : '20px'
            children   : cfg.content if _.isArray cfg.content
            child      : cfg.content if _.isObject cfg.content

        if not (cfg.hasOutput == false)
            children.push
                type : 'connector'
                out  : 'audio'

        super cfg, children:children

        @connect 'out:onConnect',    @onConnect
        @connect 'out:onDisconnect', @onDisconnect
        @
        
    onConnect: (event) =>
        event.detail.source.getWindow().audio.connect event.detail.target.getWindow().audio
        
    onDisconnect: (event) =>
        log 'onDisconnect', event.detail
        event.detail.source.getWindow().audio?.disconnect event.detail.target.getWindow().audio
        
