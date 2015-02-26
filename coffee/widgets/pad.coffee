###

00000000    0000000   0000000  
000   000  000   000  000   000
00000000   000000000  000   000
000        000   000  000   000
000        000   000  0000000  

###

class Pad extends Widget
    
    constructor: (cfg, defs) -> super cfg, defs
    
    init: (cfg, defs) =>
    
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
        
    getWidth:  => @svg.elem.width    
    getHeight: => @svg.elem.height    
    
    onHandlePos: (event) =>
        w = @getWidth()
        h = @getHeight()
        if not w? or not h? then return
        p = _.arg()
        i = @handles.indexOf event.target.getWidget()
        x =       p.x / w
        y = 1.0 - p.y / h
        
        if x != @config.handles[i].x
            @config.handles[i].x = x
        if y != @config.handles[i].y
            @config.handles[i].y = y
            
        @handleConstraints()

    handleConstraints: =>
        width = @getWidth()
        height = @getHeight()

        for i in [0...@config.handles.length]
            if i == 0
                [minX, maxX] = [0, 0]
            else if i == @config.handles.length-1
                [minX, maxX] = [width, width]
            else
                minX = @handles[i-1].relPos().x
                maxX = @handles[i+1].relPos().x
            @handles[i].drag.minPos = pos minX, 0
            @handles[i].drag.maxPos = pos maxX, height
                
    setSize: (width, height) =>
        @svg.setWidth width
        @svg.setHeight height
        @svg.elem.width = width
        @svg.elem.height = height
        
        for i in [0...@config.handles.length]
            hp = pos @config.handles[i].x * width, height - @config.handles[i].y * height
            @handles[i].setPos hp
            @handleConstraints()
