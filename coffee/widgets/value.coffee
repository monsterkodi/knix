###

    000   000   0000000   000     000   000  00000000
    000   000  000   000  000     000   000  000
     000 000   000000000  000     000   000  0000000
       000     000   000  000     000   000  000
        0      000   000  0000000  0000000   00000000

###

class Value extends Widget

    constructor: (cfg,def) ->

        super _.def(cfg,def),
            value:      0
            minValue:   0
            maxValue:   100

    initEvents: =>
        @elem.on "onValue", @config.onValue  if @config.onValue?
        super

    setValue: (arg) =>
        oldValue = @config.value
        v = @round(@clamp(_.arg(arg)))
        @input.value = @strip0 @format(v)
        if v != oldValue
            @config.value = v
            @emit 'onValue',
                value: v
        @

    incr: (d) =>
        if d in ['+', '++'] then d = 1
        else if d in ['-', '--'] then d = -1
        if @config.valueStep? then step = @config.valueStep else step = 1
        @setValue @input.getValue() + step*d
