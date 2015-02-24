###

 0000000  000   000   0000000 
000       000   000  000      
0000000    000 000   000  0000
     000     000     000   000
0000000       0       0000000 

###

class Svg extends Widget

    constructor: (cfg, defs) ->
    
        cfg = _.def cfg, defs
        super cfg,
            type: 'svg'
            # elem: 'svg'
            
        @svg = SVG @elem
