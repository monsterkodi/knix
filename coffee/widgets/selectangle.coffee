###

 0000000  00000000  000      00000000   0000000  000000000   0000000   000   000   0000000   000      00000000
000       000       000      000       000          000     000   000  0000  000  000        000      000     
0000000   0000000   000      0000000   000          000     000000000  000 0 000  000  0000  000      0000000 
     000  000       000      000       000          000     000   000  000  0000  000   000  000      000     
0000000   00000000  0000000  00000000   0000000     000     000   000  000   000   0000000   0000000  00000000

###

class Selectangle extends Widget

    @start  : (wid) => @selectangle = new Selectangle; @selectangle.wid = wid
    @stop   : => @selectangle?.close()
    @toggle : => if @selectangle? then @stop() else @start()

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        window.document.documentElement.style.cursor = 'crosshair'
                                
        super cfg,
            type   : 'selectangle'
            parent : 'stage_content'
            pos    : Stage.mousePos  
            width  : 0
            height : 0
            
        stage = $('stage_content')
        stage.addEventListener 'mousemove', @onMove
        stage.addEventListener 'mouseup',   @close
        stage.addEventListener 'mousedown', @close
        @
    
    close: (event) =>
        delete Selectangle.selectangle
        if @sizePos().square() == 0 and not event.shiftKey
            for wid in @wid? and @wid.allChildren() or knix.allWindows()
                wid.elem.removeClassName 'selected'
        stage = $('stage_content')
        stage.removeEventListener 'mousemove', @onMove
        stage.removeEventListener 'mouseup',   @done
        stage.removeEventListener 'mousedown', @done     
        window.document.documentElement.style.cursor = 'auto'   
        super

    onMove: (event) =>
        ep  = Stage.absPos event
        tl  = ep.min @config.pos
        br  = ep.max @config.pos
        @setPos tl
        @resize br.x - tl.x, br.y - tl.y
        
        widgets = @wid? and @wid.allChildren() or knix.allWindows()
                    
        window.document.documentElement.style.cursor = 'crosshair'        
        
        rect = @absRect()
        for wid in widgets
            if rect.contains wid.absCenter()
                if not wid.config.noSelect
                    wid.elem.addClassName 'selected'
            else if not event.shiftKey
                wid.elem.removeClassName 'selected'
            
