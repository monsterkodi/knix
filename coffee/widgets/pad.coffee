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
        cfg = _.def cfg,
            minWidth:   '100px'
            minHeight:  '100px'
            numHandles:  2
            hasPaths:    true
        
        super cfg,
            type:   'pad'
            noMove: true
            style:
                minWidth:  cfg.minWidth
                minHeight: cfg.minHeight
            child:
                type: 'svg'
                noMove: true
        
        @svg = @getChild 'svg'
        
        @handles = []
        for i in [0...cfg.numHandles]
            @handles.push new Handle
                    svg:   @svg.svg
                    class: 'pad_handle'
            
        if @config.hasPaths
            for i in [1...cfg.numHandles]
                p = new Path
                    svg:         @svg.svg
                    class:       'pad_path'
                    startHandle: @handles[i-1]
                    endHandle:   @handles[i]
                p.elem.back()    
                    
        for i in [0...cfg.numHandles]
            @handles[i].setPos { x: i*150; y: i*150}
                
    setSize: (width, height) =>
        @svg.setWidth width
        @svg.setHeight height
        @svg.elem.width = width
        @svg.elem.height = height
