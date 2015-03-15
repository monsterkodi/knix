###

0000000    00000000    0000000    0000000    0000000  000  0000000  00000000
000   000  000   000  000   000  000        000       000     000   000     
000   000  0000000    000000000  000  0000  0000000   000    000    0000000 
000   000  000   000  000   000  000   000       000  000   000     000     
0000000    000   000  000   000   0000000   0000000   000  0000000  00000000

###

class DragSize

    constructor: (cfg) ->

        @config = _.def cfg,
            elem  : null
        
        @config.elem.on 'mousemove', @onHover
        @config.elem.on 'mouseleave', @onLeave
            
    onHover: (event, e) =>

        if @sizeMoveDrag?
            if @sizeMoveDrag.dragging then return
            @sizeMoveDrag.deactivate() 
            delete @sizeMoveDrag
        
        w = e?.getWidget?()
        
        if not w?
            warn 'no widget?'
            return    
                    
        eventPos = Stage.absPos event
        d1 = eventPos.minus w.absPos()
        d2 = w.absPos().plus(w.sizePos()).minus eventPos

        md = 10
        action = 'move'
        border = ''
        if not w.config.resize? or not (w.config.resize == false)
            if not (w.config.resize == 'horizontal')
                if d2.y < md
                    action = 'size' 
                    border = 'bottom'
                else if d1.y < md
                    action = 'size' 
                    border = 'top'
            if not (w.config.resize == 'vertical')
                if d2.x < md
                        action = 'size' 
                        border+= 'right'
                else if d1.x < md
                        action = 'size' 
                        border+= 'left'

        if action == 'size' and not w.config.isShaded

            if border == 'left' or border == 'right'
                cursor = 'ew-resize'
            else if border == 'top' or border == 'bottom'
                cursor = 'ns-resize'
            else if border == 'topleft' or border == 'bottomright'
                cursor = 'nwse-resize'
            else
                cursor = 'nesw-resize'

            @sizeMoveDrag = new Drag
                target  : @config.elem
                onStart : @sizeStart
                onMove  : @sizeMove
                doMove  : false
                cursor  : cursor

            @sizeMoveDrag.border = border
        else
            @sizeMoveDrag = new Drag
                target  : @config.elem
                minPos  : pos undefined, 0
                onMove  : @dragMove
                onStart : @moveStart
                onStop  : @moveStop
                doMove  : @config.doMove
                cursor  : 'grab'
        return

    moveStart: (drag, event) =>
        @config.moveStart(drag, event) if @config.moveStart?
        if drag.target.widget.isWindow()
            StyleSwitch.togglePathFilter()
        event.stop()

    dragMove: (drag, event) =>
        @config.onMove(drag, event) if @config.onMove?
        event.stop()

    onLeave: (event) =>
        if @sizeMoveDrag? and not @sizeMoveDrag.dragging
            @sizeMoveDrag.deactivate() if @sizeMoveDrag
            delete @sizeMoveDrag
        
    moveStop: (drag, event) =>
        @config.moveStop(drag, event) if @config.moveStop?
        if drag.target.widget.isWindow()
            StyleSwitch.togglePathFilter()
        event.stop()

    sizeStart: (drag, event) =>
        @config.sizeStart(drag, event) if @config.sizeStart?
        event.stop()

    sizeMove: (drag, event) =>
        
        @config.onSize(drag, event) if @config.onSize?

        w    = drag.target.widget
        wpos = w.absPos()
        spos = Stage.absPos(event)

        if drag.border in ['left', 'topleft', 'top']
            dx = wpos.x - spos.x
            dy = wpos.y - spos.y
        else
            dx = spos.x - wpos.x - w.getWidth()
            dy = spos.y - wpos.y - w.getHeight()

        if @config.elem.hasClassName 'selected'
            for sw in knix.selectedWidgets()
                @sizeWidget drag, sw, dx, dy
        else
            @sizeWidget drag, w, dx, dy
        event.stop()

    sizeWidget: (drag, w, dx, dy) =>
        
        wpos = w.absPos()
        wdt = w.getWidth() + dx
        hgt = w.getHeight() + dy

        if drag.border in ['left', 'topleft', 'top']
            br = wpos.plus(pos(w.getWidth(), w.getHeight()))
        
        wdt = Math.min(w.maxWidth(), wdt)
        wdt = Math.max(w.minWidth(), wdt)
        hgt = Math.min(w.maxHeight(), hgt)
        hgt = Math.max(w.minHeight(), hgt)
        hgt = null if drag.border == 'left' or drag.border == 'right'
        wdt = null if drag.border == 'top' or drag.border == 'bottom'

        # log wdt, hgt
        w.resize wdt, hgt

        if drag.border in ['left', 'topleft', 'top']
            if not wdt? then dx = 0 else dx = br.x-w.getWidth()-wpos.x
            if not hgt? then dy = 0 else dy = br.y-w.getHeight()-wpos.y
            w.moveBy dx, dy
            
        
