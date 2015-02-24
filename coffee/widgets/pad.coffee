###

00000000    0000000   0000000  
000   000  000   000  000   000
00000000   000000000  000   000
000        000   000  000   000
000        000   000  0000000  

###

class Pad extends Widget
    
    constructor: (cfg, defs) ->
    
        cfg = _.def cfg, defs
        
        super cfg,
        
            type:   'pad'
            noMove: true
            style:
                minWidth:  '100px'
                minHeight: '100px'
                backgroundColor: 'yellow'
                
            child:
                type: 'svg'
        
        @svg = @getChild 'svg'
        
    setSize: (width, height) =>
        @svg.setWidth width
        @svg.setHeight height
        @svg.elem.width = width
        @svg.elem.height = height
