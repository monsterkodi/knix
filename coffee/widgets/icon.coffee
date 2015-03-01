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
    
        if cfg.icon.startsWith 'fa'
            cfg.icon += ' fa'
            elem = 'i'
        else
            elem = 'span'

        super cfg,
            child:
                elem:   elem
                type:   'octicon'
                class:   cfg.icon
