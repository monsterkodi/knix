###

 0000000  00000000  000      00000000   0000000  000000000   0000000   000   000   0000000   000      00000000
000       000       000      000       000          000     000   000  0000  000  000        000      000     
0000000   0000000   000      0000000   000          000     000000000  000 0 000  000  0000  000      0000000 
     000  000       000      000       000          000     000   000  000  0000  000   000  000      000     
0000000   00000000  0000000  00000000   0000000     000     000   000  000   000   0000000   0000000  00000000

###

class Selectangle extends Widget

    @toggle : => if @selectangle? then @stop() else @start()
    @start  : (wid) => @selectangle = new Selectangle; @selectangle.wid = wid
    @stop   : =>
        @selectangle?.close()
        delete selectangle

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
                                
        super cfg,
            type   : 'selectangle'
            parent : 'stage_content'
            pos    : Stage.mousePos  
            width  : 0
            height : 0
            
        # log 'config', @config
        stage = $('stage_content')
        stage.addEventListener 'mousemove', @onMove
        stage.addEventListener 'mouseup',   @done
        stage.addEventListener 'mousedown', @done
        @

    done: (event) =>
        log 'done'
        @close()
    
    close: =>
        stage = $('stage_content')
        stage.removeEventListener 'mousemove', @onMove
        stage.removeEventListener 'mouseup',   @done
        stage.removeEventListener 'mousedown', @done        
        super

    onMove: (event) =>
        ep  = Stage.absPos event
        tl  = ep.min @config.pos
        br  = ep.max @config.pos
        @setPos tl
        @resize br.x - tl.x, br.y - tl.y
        
        if @wid?
            widgets = @wid.allChildren()
        else
            widgets = knix.allWindows()
                        
        log widgets.length, event.shiftKey
        rect = @absRect()
        for wid in widgets
            # log wid.elem.id, wid.absRect()
            if rect.contains wid.absCenter()
                # log '+', wid.elem.id
                wid.elem.addClassName 'selected'
            else if not event.shiftKey
                wid.elem.removeClassName 'selected'
            
