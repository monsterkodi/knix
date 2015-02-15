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

        if not @config.valueStep?
            range = @config.maxValue - @config.minValue
            @config.valueStep = range > 1 and 1 or range/100

    initEvents: =>
        @elem.on "onValue", @config.onValue  if @config.onValue?
        super

    setValue: (arg) =>
        # tag 'value'
        oldValue = @config.value
        v = @round(@clamp(_.arg(arg)))
        if v != oldValue
            # log v
            @config.value = v
            @emit 'onValue', value: v
        @

    incr: (d) =>
        if d in ['+', '++'] then d = 1
        else if d in ['-', '--'] then d = -1
        if @config.valueStep? then step = @config.valueStep else step = 1
        @setValue @input.getValue() + step*d

    # ____________________________________________________________________________ tools

    clamp: (v) => _.clamp @config.minValue, @config.maxValue, v # clamps v to the [minValue,maxValue] range
    round: (v) => # rounds v to multiples of valueStep
        r = v
        if @config.valueStep?
            d = v - Math.round(v/@config.valueStep)*@config.valueStep
            r -= d
        r
