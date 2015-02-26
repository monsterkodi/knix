###

      000   0000000    0000000  000   000   0000000
      000  000   000  000       000  000   000     
      000  000000000  000       0000000    0000000 
000   000  000   000  000       000  000        000
 0000000   000   000   0000000  000   000  0000000 

###

class Jacks extends Hbox

    init: (cfg, defs) =>        
    
        _.def cfg, defs

        cfg = _.def cfg,
            onConnect:    (source, target) -> source.config.audio.connect    target.config.audio
            onDisconnect: (source, target) -> source.config.audio.disconnect target.config.audio

        children = []

        if not (cfg.hasInput == false)
            children.push
                type:        'connector'
                in:             'audio'
                audio:        cfg.audio

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
                audio:        cfg.audio
                onConnect:    cfg.onConnect
                onDisconnect: cfg.onDisconnect

        super cfg, children:children
