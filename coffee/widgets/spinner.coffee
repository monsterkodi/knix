###

 0000000  00000000   000  000   000  000   000  00000000  00000000 
000       000   000  000  0000  000  0000  000  000       000   000
0000000   00000000   000  000 0 000  000 0 000  0000000   0000000  
     000  000        000  000  0000  000  0000  000       000   000
0000000   000        000  000   000  000   000  00000000  000   000

###

class Spinner extends Spin

    constructor: (cfg, defs) -> super cfg, defs
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs

        super cfg,
            tooltip:    false
            valueStep:  1
            minValue:   0
            maxValue:   cfg.values.length-1

        Drag.create
            cursor:     'ew-resize'
            target:     @getChild('spin-content').elem
            doMove:     false
            onMove:     @sliderFunc
            onStart:    @sliderFunc

        @input = null

    onWindowSize: => @setValue @config.value
        
    size2value: (s) => @config.minValue + @range() * s / @getChild('spin-content').getWidth()

    sliderFunc: (drag, event) =>
        pos    = @getChild('spin-content').absPos()
        width  = event.clientX-pos.x
        v      = @size2value width
        @setValue v

    setValue: (v) =>
        d = _.value(v) - @range()/2
        v = @range()/2 + d * @config.valueStep  * @steps() / @range()
        super v
        c = @getChild 'spin-content'
        c.clear()
        w = c.getWidth()/@steps()
        c.elem.insert '<div class="spinner-knob" style="width:%dpx; left:%dpx"/>'.fmt(w, @config.value*w)
        c.elem.insert String @config.values[@config.value]
