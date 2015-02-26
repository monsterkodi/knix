###

000   000   0000000   000      000   000  00000000
000   000  000   000  000      000   000  000     
 000 000   000000000  000      000   000  0000000 
   000     000   000  000      000   000  000     
    0      000   000  0000000   0000000   00000000

###

class Value extends Widget

    init: (cfg, def) => 
        
        cfg = _.def cfg, def
        
        super cfg,
            value:      0
            noMove:     true
            minValue:   0
            maxValue:   100
            tooltip:    true

    onTooltip: => @elem.id

    initEvents: =>
        @elem.on "onValue", @config.onValue  if @config.onValue?
        super

    setValue: (v) =>
        # tag 'value'
        oldValue = @config.value
        v = @round(@clamp(_.value(v)))
        if v != oldValue
            # log v
            @config.value = v
            @emit 'onValue', value: v
        @

    incr: (d=1) =>
        if d in ['+', '++'] then d = 1
        else if d in ['-', '--'] then d = -1
        if @config.valueStep? then step = @config.valueStep else step = 1
        @setValue @config.value + step*d

    decr: => @incr -1

    # ____________________________________________________________________________ tools

    percentage: (v) => # returns the percentage of value v in the [minValue,maxValue] range
        cfg = @config
        pct = 100 * (v - cfg.minValue) / @range()
        Math.max(0,Math.min(pct,100))

    size2value: (s) => # returns the value in the [minValue,maxValue] range that lies at point s
        @config.minValue + @range() * s / @innerWidth()

    range: => @config.maxValue - @config.minValue
    steps: => 1 + @range() / @config.valueStep
    clamp: (v) => _.clamp @config.minValue, @config.maxValue, v # clamps v to the [minValue,maxValue] range
    round: (v) => # rounds v to multiples of valueStep
        if @config.valueStep?
            d = - v + Math.round(v/@config.valueStep)*@config.valueStep
            # log 'd', d
            v += d
        v
