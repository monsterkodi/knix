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
            type:         'jacks'

        # cfg.children = undefined
        children = []

        if not (cfg.hasInput == false)
            children.push
                type:   'connector'
                in:     'audio'

        children.push
            type:         'jack_content'
            style:
                width:    '100%'
                height:   '20px'
            children:     cfg.children

        if not (cfg.hasOutput == false)
            children.push
                type:         'connector'
                out:          'audio'
                # onConnect:    (source, target) -> source.getWindow().audio.connect target.getWindow().audio
                # onDisconnect: (source, target) -> source.getWindow().audio.disconnect target.getWindow().audio

        super cfg, children:children

        @connect 'out:onConnect',    @onConnect
        @connect 'out:onDisconnect', @onDisconnect
        @
        
    onConnect: (event) =>
        # log 'onConnect', event.detail
        # log 'onConnect', event.detail.source.getWindow().audio
        # log 'onConnect', event.detail.target.getWindow().audio
        event.detail.source.getWindow().audio.connect event.detail.target.getWindow().audio
        
    onDisconnect: (event) =>
        # log 'onDisconnect', event.detail
        event.detail.source.getWindow().audio.disconnect event.detail.target.getWindow().audio
        
