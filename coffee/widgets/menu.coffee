###

00     00  00000000  000   000  000   000
000   000  000       0000  000  000   000
000000000  0000000   000 0 000  000   000
000 0 000  000       000  0000  000   000
000   000  00000000  000   000   0000000 

###

class Menu extends Widget

    init: (cfg, defs) =>
    
        cfg = _.def cfg, defs
        
        super cfg,
            type: 'menu'
            
        @
