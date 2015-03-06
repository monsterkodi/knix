###

000   0000000   0000000   000   000
000  000       000   000  0000  000
000  000       000   000  000 0 000
000  000       000   000  000  0000
000   0000000   0000000   000   000

###

class Icon extends Widget

    init: (cfg, defs) =>
    
        cfg = _.def cfg, defs
        
        cfg = _.def cfg, 
            type  : 'icon'
            elem  : 'span'
                
        if cfg.icon.startsWith 'fa'
            super cfg,
                class : 'octicon'
                child :
                    elem  : 'i'
                    class : 'fa ' + cfg.icon
        else
            super cfg,
                class : 'octicon ' + cfg.icon
    
    setIcon: (icon) =>
        if icon.startsWith 'fa'
            e = @getChild('fa').elem
        else
            e = @elem
        e.removeClassName @config.icon
        @config.icon = icon
        e.addClassName @config.icon
