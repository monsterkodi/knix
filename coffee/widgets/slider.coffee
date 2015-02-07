
class Slider extends Widget

    @create: (cfg) ->

        sliderFunc = (drag, event) ->
            slider = drag.target
            pos    = slider.absPos()
            width  = event.clientX-pos.x
            v      = slider.size2value width
            slider.setValue(v)

        slider = knix.setup cfg,
            type:      'slider'
            value:      0
            minValue:   0
            maxValue:   100
            child:
                type:    'slider-bar'
                child:
                    type: 'slider-knob'

        slider.setValue slider.config.value

        # this is only to fix a minor glitch in the knob display, might cost too much performance:
        sizeCB = (event,e) -> slider.setValue(slider.config.value)
        win = slider.getWindow()
        win.on "size", sizeCB if win

        Drag.create
            cursor:     'ew-resize'
            target:     slider
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

        slider

    valueToPercentOfWidth: (value) -> # returns the percentage of value v in the [minValue,maxValue] range
        cfg = @config
        knobWidth = @getChild('slider-knob').getWidth()
        borderWidth = @getChild('slider-bar').getHeight() - @getChild('slider-bar').innerHeight()
        knobMinPercent = 100 * (knobWidth+borderWidth) / @getWidth()
        barFactor = (value - cfg.minValue) / (cfg.maxValue - cfg.minValue)
        barPercent = knobMinPercent + ( (100-knobMinPercent) * barFactor )
        barPercent

    setValue: (arg) ->
        oldValue = @config.value
        v = @slotArg(arg, 'value')
        v = @clamp(v)
        if v != oldValue
            @config.value = v
            pct = @valueToPercentOfWidth v
            bar = @getChild('slider-bar')
            bar.style.width = "%.2f%%".fmt(pct)

            @emit 'onValue', value:v
            log @id, "%.2f%%".fmt(pct), v
        @
