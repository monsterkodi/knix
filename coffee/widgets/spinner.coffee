###

 0000000  00000000   000  000   000  000   000  00000000  00000000 
000       000   000  000  0000  000  0000  000  000       000   000
0000000   00000000   000  000 0 000  000 0 000  0000000   0000000  
     000  000        000  000  0000  000  0000  000       000   000
0000000   000        000  000   000  000   000  00000000  000   000

###

class Spinner extends Spin
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs

        super cfg,
            tooltip   : false
            valueStep : 1
            minValue  : 0
            maxValue  : cfg.values.length-1

        Drag.create
            cursor    : 'ew-resize'
            target    : @getChild('spin-content').elem
            doMove    : false
            onMove    : @sliderFunc
            onStart   : @sliderFunc

        @input = null
        @

    onWindowSize: => 
        # log 'onWindowSize'
        @setValue @config.value
        
    size2value: (s) => @config.minValue + @range() * s / @getChild('spin-content').getWidth()

    sliderFunc: (drag, event) =>
        pos    = @getChild('spin-content').absPos()
        width  = event.clientX-pos.x
        v      = @size2value width
        
        d = v - @range()/2
        i = @range()/2 + d * @config.valueStep  * @steps() / @range()
        i = @clamp @round(i)

        @setValue @config.values[i]

    index: => @config.values.indexOf @config.value

    incr: (d=1) =>
        log d
        if d in ['+', '++'] then d = 1
        else if d in ['-', '--'] then d = -1
        i = @clamp(@index() + d)
        @setValue @config.values[i]

    setValue: (a) =>
        v = _.arg a
        i = @config.values.indexOf v
        c = @getChild 'spin-content'
        c.clear()
        w = c.getWidth()/@steps()
        c.elem.insert '<div class="spinner-knob" style="width:%dpx; left:%dpx"/>'.fmt(w, i*w)
        @config.value = @config.values[i]
        c.elem.insert String @config.value
        @emitValue @config.value
