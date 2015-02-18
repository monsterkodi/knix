###

 0000000  00000000   000  000   000  000   000  00000000  00000000 
000       000   000  000  0000  000  0000  000  000       000   000
0000000   00000000   000  000 0 000  000 0 000  0000000   0000000  
     000  000        000  000  0000  000  0000  000       000   000
0000000   000        000  000   000  000   000  00000000  000   000

###

class Spinner extends Spin

    constructor: (cfg, defs) ->

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
        
    sliderFunc: (drag, event) =>
        log 'sliderfunc'
        pos    = @absPos()
        width  = event.clientX-pos.x
        v      = @size2value width
        @setValue v

    setValue: (a) =>
        super a
        c = @getChild('spin-content')
        c.clear()
        c.elem.insert(String(@config.values[@config.value]))
        log @config.value
