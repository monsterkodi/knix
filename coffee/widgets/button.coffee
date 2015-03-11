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
                
        if cfg.icon?
            children.push
                type : 'icon'
                icon : cfg.icon
                
        super cfg,
            keys     : []
            type     : 'button'
            noMove   : true
            children : children
            
        @connect 'mousedown', @trigger
        @connect 'mouseup',   @release

    insertText: =>
        if @config.menu != 'menu'
            super

    trigger: (event) =>
        @config.action? event
        @emit 'trigger', event
        event?.stop()
        @
        
    release: (event) =>
        @emit 'release', event
        @