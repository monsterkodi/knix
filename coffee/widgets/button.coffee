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
        
        children = []
        
        log 'init', cfg
        
        if cfg.icon?
            children.push
                type : 'icon'
                icon : cfg.icon
                
        super cfg,
            onClick  : cfg.action
            keys     : []
            type     : 'button'
            noMove   : true
            children : children

    insertText: =>
        if @config.menu != 'menu'
            super
