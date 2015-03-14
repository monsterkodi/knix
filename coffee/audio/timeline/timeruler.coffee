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
                text  : '<i class="fa fa-%s"></i>'.fmt(r % 4 and 'circle-o' or r % 8 and 'dot-circle-o' or 'circle')
            
        children.push
            type   : 'ruler-line'
            # height : 1000
            width  : 1
            style  :
                position : 'absolute'
                top      : '0px'

        super cfg,
            type     : 'TimeRuler'
            noMove   : true
            noSelect : true
            children : children
            style    : 
                position : 'absolute'
                top      : '0px'

        @linex = 0
        @cell = @children()
        for c in @cell
            c.elem.addEventListener 'mousedown', @onCellDown
        @line = @getChild('ruler-line')
        # log @config.steps * @config.stepWidth
        # @setWidth @config.steps * @config.stepWidth
        @

    on: (step) => 
        e = @cell[step].elem
        e.removeClassName 'off'
        e.addClassName 'on'
        
    off: (step) =>
        e = @cell[step].elem
        e.removeClassName 'on'
        e.addClassName 'off'

    setTime: (time) => 
        @linex = time * @config.stepWidth / @config.stepSecs
        @line.moveTo @linex

    onCellDown: (event) => 
        @getWindow().setStep event.target.getWidget().config.index
        event.stop()
