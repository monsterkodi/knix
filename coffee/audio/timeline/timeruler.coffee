###

000000000  000  00     00  00000000  00000000   000   000  000      00000000  00000000 
   000     000  000   000  000       000   000  000   000  000      000       000   000
   000     000  000000000  0000000   0000000    000   000  000      0000000   0000000  
   000     000  000 0 000  000       000   000  000   000  000      000       000   000
   000     000  000   000  00000000  000   000   0000000   0000000  00000000  000   000

###

class TimeRuler extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        cfg = _.def cfg,
            stepWidth: 50
            
        children = []
        for r in [0...cfg.steps]
            children.push
                type  : cfg.cell
                class : 'RulerCell off'
                style :
                    position  : 'absolute'
                    left      : '%dpx'.fmt r * cfg.stepWidth
                    top       : '0px'
                    width     : '%dpx'.fmt cfg.stepWidth
                    textAlign : 'center'
                index : r
                text  : '<i class="fa fa-%s"></i>'.fmt(r % 2 and 'circle-o' or r % 4 and 'dot-circle-o' or r % 8 and 'bullseye' or 'circle')
            
        super cfg,
            type     : 'TimeRuler'
            noMove   : true
            noSelect : true
            children : children
            style    : 
                position : 'relative'

        @cell = @children()
        for c in @cell
            c.elem.addEventListener 'mousedown', @onCellDown
        @

    on: (step) => 
        e = @cell[step].elem
        e.removeClassName 'off'
        e.addClassName 'on'
        
    off: (step) =>
        e = @cell[step].elem
        e.removeClassName 'on'
        e.addClassName 'off'

    onCellDown: (event) => 
        @getWindow().setStep event.target.getWidget().config.index
        event.stop()
