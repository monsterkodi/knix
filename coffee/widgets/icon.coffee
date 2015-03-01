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
    
        super cfg,
            child:
                elem:   'span'
                type:   'octicon'
                class:   cfg.icon
