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
            numHandles:  1
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
        
        if @config.handles?
            @config.numHandles = @config.handles.length
        
        @handles = []
        for i in [0...@config.numHandles]
            @handles.push new Handle
                    svg:   @svg.svg
                    class: 'pad_handle'
                    onPos: @onHandlePos
            
        if @config.hasPaths
            for i in [1...@config.numHandles]
                p = new Path
                    svg:         @svg.svg
                    class:       'pad_path'
                    startHandle: @handles[i-1]
                    endHandle:   @handles[i]
                p.path.back()    
            
        if not @config.handles?      
            @config.handles = []
            for i in [0...@config.numHandles]
                hp = pos i.toFixed(3)/(@config.numHandles-1), i.toFixed(3)/(@config.numHandles-1)
                @config.handles.push hp
            
        @setSize 100, 100
        
    onHandlePos: => 
        p = _.arg()
        log p
                
    setSize: (width, height) =>
        @svg.setWidth width
        @svg.setHeight height
        @svg.elem.width = width
        @svg.elem.height = height
        
        for i in [0...@config.handles.length]
            hp = pos @config.handles[i].x * width, height - @config.handles[i].y * height
            @handles[i].setPos hp
