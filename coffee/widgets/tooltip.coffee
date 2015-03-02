###

000000000   0000000    0000000   000      000000000  000  00000000 
   000     000   000  000   000  000         000     000  000   000
   000     000   000  000   000  000         000     000  00000000 
   000     000   000  000   000  000         000     000  000      
   000      0000000    0000000   0000000     000     000  000      

###

class Tooltip

    @create: (cfg, defs) =>

        cfg = _.def cfg, defs
        cfg = _.def cfg, 
                  delay : 700
                  
        cfg.target.tooltip = cfg
        cfg.target.elem.on 'mousemove',  @onHover
        cfg.target.elem.on 'mouseleave', @onLeave
        cfg.target.elem.on 'mousedown',  @onLeave

    @onHover: (event, d) =>
        for e in [d, d.ancestors()].flatten()
            if e?.widget?.tooltip?
                tooltip = e.widget.tooltip
                if tooltip.window?
                    tooltip.window.close()
                    tooltip.window = null
                if tooltip.timer?
                    clearInterval tooltip.timer
                popup = -> Tooltip.popup(e, Stage.absPos event)
                tooltip.timer = setInterval(popup, tooltip.delay)
                return

    @popup: (e, pos) =>
        tooltip = e.widget.tooltip
        if tooltip.timer?
            clearInterval tooltip.timer
            tooltip.timer = null
        if tooltip.onTooltip?
            text = tooltip.onTooltip()
        else if tooltip.text?
            text = tooltip.text
        else
            text = e.id
        tooltip.window = new Window
            class     : 'tooltip'
            parent    : 'stage_content'
            isMovable : false
            x         : pos.x + 12
            y         : pos.y + 12
            hasClose  : false
            hasShade  : false
            hasTitle  : false
            child     :
                text  : text

    @onLeave: (event, e) =>
        if tooltip = e?.widget?.tooltip
            if tooltip.timer?
                clearInterval tooltip.timer
                tooltip.timer = null
            if w = tooltip.window
                w.close()
                e.widget.tooltip.window = null
