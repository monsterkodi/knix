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
            # if cfg.text?
            #     cfg.child =
            #         elem  : 'span'
            #         # type  : 'octicon'
            #         # class : cfg.icon
            # else
            children.push
                type : 'icon'
                icon : cfg.icon
            # delete cfg.icon
                
        # if cfg.text? and cfg.menu != 'menu'
        #     log 'button text', cfg.text
        #     children.push
        #         text : cfg.text

        super cfg,
            onClick  : cfg.action
            keys     : []
            type     : 'button'
            noMove   : true
            children : children

    insertText: =>
        if @config.menu != 'menu'
            log 'button text', @config.text
            super
