###

      0000000   000      000  0000000    00000000  00000000
     000        000      000  000   000  000       000   000
      0000000   000      000  000   000  0000000   0000000
           000  000      000  000   000  000       000   000
      0000000   0000000  000  0000000    00000000  000   000

###

class Slider extends Value

    constructor: (cfg) ->

        sliderFunc = (drag, event) ->
            slider = drag.target.widget
            pos    = slider.absPos()
            width  = event.clientX-pos.x
            v      = slider.size2value width
            slider.setValue(v)

        super cfg,
            type:      'slider'
            value:      0
            minValue:   0
            maxValue:   100
            minWidth:   50
            child:
                type:    'slider-bar'
                child:
                    type: 'slider-knob'

        # @setValue @config.value
        @setBarValue @config.value

        # this is only to fix a minor glitch in the knob display, might cost too much performance:
        sizeCB = (event,e) -> @setValue(@config.value)
        @getWindow().elem.on "size", sizeCB.bind(@) if @getWindow()

        Drag.create
            cursor:     'ew-resize'
            target:     @elem
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

    valueToPercentOfWidth: (value) => # returns the percentage of value v in the [minValue,maxValue] range
        cfg = @config
        knobWidth = @getChild('slider-knob').getWidth()
        borderWidth = @getChild('slider-bar').getHeight() - @getChild('slider-bar').innerHeight()
        knobMinPercent = 100 * (knobWidth+borderWidth) / Math.max(1, @getWidth())
        barFactor = (value - cfg.minValue) / (cfg.maxValue - cfg.minValue)
        barPercent = knobMinPercent + ( (100-knobMinPercent) * barFactor )
        barPercent

    setBarValue: (barValue) =>
        pct = @valueToPercentOfWidth(barValue)
        @getChild('slider-bar').elem.style.width = "%.2f%%".fmt(pct)

    setValue: (arg) =>
        tag 'value'
        oldValue = @config.value
        v = @round(@clamp(_.arg(arg)))
        if v != oldValue
            log v
            @config.value = v
            @setBarValue(v)
            @emit 'onValue', value:v
        @
