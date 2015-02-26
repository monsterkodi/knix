###

00000000    0000000   0000000  
000   000  000   000  000   000
00000000   000000000  000   000
000        000   000  000   000
000        000   000  0000000  

###

class Pad extends Widget
        
    init: (cfg, defs) =>
    
        cfg = _.def cfg, defs
        cfg = _.def cfg,
            minWidth:    100
            minHeight:   100
            numHandles:  1
            hasPaths:    true
        
        super cfg,
            type:   'pad'
            noMove: true
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
                onUp:  @onHandleUp
            
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
                
        @setSVGSize cfg.minWidth, cfg.minHeight                    
        @updateHandles()
                                        
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
        @config.handles[i].x = x
        @config.handles[i].y = y
    
    onHandleUp: =>
        log 'up'
        @constrainHandles()

    constrainHandles: =>
        o = 8
        width  = @getWidth()-2*o
        height = @getHeight()-2*o

        for i in [0...@config.handles.length]
            if i == 0
                [minX, maxX] = [o, o]
            else if i == @config.handles.length-1
                [minX, maxX] = [o+width, o+width]
            else
                minX = @handles[i-1].relPos().x
                maxX = @handles[i+1].relPos().x
                
            @handles[i].constrain minX, o, maxX, o+height
                
    setSVGSize: (width, height) =>
        @svg.setWidth width
        @svg.setHeight height
        @svg.elem.width = width
        @svg.elem.height = height  
        
    updateHandles: =>
        for i in [0...@config.handles.length]
            hp = pos @config.handles[i].x * @getWidth(), @getHeight() - @config.handles[i].y * @getHeight()
            @handles[i].setPos hp
                
    setSize: (width, height) =>
        @setSVGSize width, height
        @updateHandles()
        @constrainHandles()
