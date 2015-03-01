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
        
        @o = 8 # offset from border
        
        super cfg,
            type:   'pad'
            noMove: true
            minWidth:  cfg.minWidth
            minHeight: cfg.minHeight
            child:
                type: 'svg'
                noMove: true
        
        @svg = @getChild 'svg'
        
        if @config.vals?
            @config.numHandles = @config.vals.length
        
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
                    class:       'pad-path'
                    startHandle: @handles[i-1]
                    endHandle:   @handles[i]
                p.path.back()    
            
        if not @config.vals?
            @config.vals = []
            for i in [0...@config.numHandles]
                hp = pos i.toFixed(3)/(@config.numHandles-1), i.toFixed(3)/(@config.numHandles-1)
                @config.vals.push hp
                            
        @setSVGSize cfg.minWidth, cfg.minHeight                    
        @updateHandles()
        @
    
    valAtRel: (rel) =>
        if @config.numHandles < 2 then return @config.vals[0].y
        si = 0
        ei = 1
        for i in [0...@config.numHandles]
            if @config.vals[i].x <= rel
                si = i
            else
                ei = i
                break
        
        [sp,ep] = [@config.vals[si],@config.vals[ei]]
        log si, ei, sp, ep
        dp = sp.to ep
        dl = dp.length()
        if dl == 0 or dp.x == 0
            log 'null', rel, si, ei, dl, dp.x
            sp.y
        else
            p = sp.add dp.times (rel - @config.vals[si].x) / dp.x
            p.y
    
    showRuler: (x, y) =>
        [w,h] = [@getWidth()-2*@o, @getHeight()-2*@o]
        if x?
            if not @rulerx?
                @rulerx = new Path
                    svg:    @svg.svg
                    class:  'pad-ruler'
                @rulerx.path.back()
            @rulerx.setStart pos x*w+@o, 0
            @rulerx.setEnd   pos x*w+@o, h+2*@o
        if y?
            if not @rulery?
                @rulery = new Path
                    svg:    @svg.svg
                    class:  'pad-ruler'
                @rulery.path.back()
            @rulery.setStart pos      0, h-y*h+@o
            @rulery.setEnd   pos w+2*@o, h-y*h+@o
        
    hideRuler: =>
        if @rulerx
            @rulerx.close()
            @rulerx = null
        if @rulery
            @rulery.close()
            @rulery = null
                                        
    getWidth:  => @svg.elem.width    
    getHeight: => @svg.elem.height
    
    onHandlePos: (event) =>
        if not @config.vals? then return
        [w,h] = [@getWidth()-2*@o, @getHeight()-2*@o]
        if not w? or not h? then return
        p = _.arg()
        i = @handles.indexOf event.target.getWidget()
        x =       (p.x - @o) / w
        y = 1.0 - (p.y - @o) / h
        @config.vals[i].x = x
        @config.vals[i].y = y
    
    onHandleUp: => @constrainHandles()

    constrainHandles: =>
        [w,h] = [@getWidth()-2*@o, @getHeight()-2*@o]

        for i in [0...@config.vals.length]
            if i == 0
                [minX, maxX] = [@o, @o]
            else if i == @config.vals.length-1
                [minX, maxX] = [@o+w, @o+w]
            else
                minX = @handles[i-1].relPos().x
                maxX = @handles[i+1].relPos().x
                
            @handles[i].constrain minX, @o, maxX, @o+h
                
    setSVGSize: (width, height) =>
        @svg.setWidth width
        @svg.setHeight height
        @svg.elem.width = width
        @svg.elem.height = height  
        
    updateHandles: =>
        [w,h] = [@getWidth()-2*@o, @getHeight()-2*@o]
        for i in [0...@config.vals.length]
            hp = pos @o + @config.vals[i].x * w, h - @config.vals[i].y * h + @o
            @handles[i].setPos hp
                
    setSize: (width, height) =>
        @setSVGSize width, height
        @updateHandles()
        @constrainHandles()
