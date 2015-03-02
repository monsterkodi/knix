###

0000000    000   000  000000000  000000000   0000000   000   000
000   000  000   000     000        000     000   000  0000  000
0000000    000   000     000        000     000   000  000 0 000
000   000  000   000     000        000     000   000  000  0000
0000000     0000000      000        000      0000000   000   000

###

class Button extends Widget
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            keys: []

        if cfg.icon?
            if cfg.text?
                cfg.child =
                    elem  : 'span'
                    type  : 'octicon'
                    class : cfg.icon
            else
                cfg.child =
                    type : 'icon'
                    icon : cfg.icon

        super cfg,
            type   : 'button'
            noMove : true
