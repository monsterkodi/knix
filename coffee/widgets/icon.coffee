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
                
        super cfg,
            child : 
                elem  : 'i'
                class : (cfg.icon.startsWith('fa') and 'fa ' or 'octicon ') + cfg.icon
        
    setIcon: (icon) =>
        e = @elem.firstChild
        e.removeClassName @config.icon
        @config.icon = icon
        e.addClassName @config.icon
