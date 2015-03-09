###

 0000000   0000000     0000000  00000000 
000   000  000   000  000       000   000
000000000  000   000  0000000   0000000  
000   000  000   000       000  000   000
000   000  0000000    0000000   000   000

###

class ADSR extends Window

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        cfg = _.def cfg,
            type        : 'adsr'
            shape       : Oscillator.shapes[0]
            duration    : 0.2
            minDuration : 0.0
            maxDuration : 10.0
            freqfactor  : 1.0
            frequency   : 440
            gain        : 1.0
            numHandles  : 7

        [ @gain,       cfg ] = Audio.gain cfg
        [ @volume,     cfg ] = Audio.gain cfg
        [ @oscillator, cfg ] = Audio.oscillator cfg

        @oscillator.connect @volume
        @volume.connect @gain

        super cfg,
            title    : 'adsr'
            children : \
            [
                type     : 'jacks'
                hasInput : false
                content  :
                    type     : 'spinner'
                    class    : 'shape'
                    recKey   : 'shape' 
                    tooltip  : 'shape'
                    value    : cfg.shape
                    values   : Oscillator.shapes
            ,
                type       : 'pad'
                class      : 'pad'
                numHandles : cfg.numHandles
                vals       : cfg.vals
                minHeight  : 50
                minWidth   : 150
            ,
                type     : 'sliderspin'
                class    : 'duration'
                tooltip  : 'duration'
                recKey   : 'duration'
                value    : cfg.duration
                minValue : cfg.minDuration
                maxValue : cfg.maxDuration
                spinStep : cfg.durationStep
            ,
                type     : 'sliderspin'
                class    : 'freqfactor'
                tooltip  : 'freqfactor'
                value    : cfg.freqFactor
                minValue : 0
                maxValue : 1.0
            ,
                type     : 'sliderspin'
                class    : 'frequency'
                tooltip  : 'frequency'
                value    : cfg.frequency
                minValue : cfg.minFrequency
                maxValue : cfg.maxFrequency
            ,
                type      : 'sliderspin'
                class     : 'gain'
                tooltip   : 'gain'
                value     : cfg.gain
                minValue  : 0.0 
                maxValue  : 1.0
            ,
                type     : 'button'
                text     : 'trigger'
                class    : 'trigger'                
            ]

        log 1
        @connect 'trigger:trigger',   @trigger
        @connect 'duration:onValue',  @setDuration
        log 2
        @connect 'shape:onValue',      @setShape
        log 4
        @connect 'frequency:onValue',  @setFrequency
        log 5
        @connect 'freqFactor:onValue', @setFreqFactor
        log 3
        @setFrequency  @config.frequency
        @setShape @config.shape
        @pad = @getChild 'pad'
        @sizeWindow()
        @
            
    # paramValuesAtConnector: (paramValues, connector) =>
    #     if paramValues.duration? 
    #         paramValues.values = [] 
    #         for v in @pad.config.vals
    #             paramValues.values.push
    #                 time:  v.x * paramValues.duration
    #                 value: v.y
    #         Audio.sendParamValuesFromConnector paramValues, @connector "envelope:onValue"

    setGain: (v)       => @config.gain       = _.value v; @gain.gain.value            = @config.gain
    setFrequency: (v)  => @config.frequency  = _.value v; #@oscillator.frequency.value = @config.frequency
    setFreqFactor: (v) => @config.freqFactor = _.value v
    setShape: (v) => 
        @config.shape    = if _.isString v then v else _.value v 
        @oscillator.type = @config.shape

    setDuration: (v) => @config.duration = _.value v

    trigger: (event) =>
        if @config.reltime != 0
            knix.deanimate @

        @gain.gain.cancelScheduledValues Audio.context.currentTime
        @oscillator.frequency.cancelScheduledValues Audio.context.currentTime
        t = Audio.context.currentTime + 0.01
        for v in @pad.config.vals
            time = v.x * @config.duration
            value = (@config.freqfactor + (v.y*(1.0-@config.freqfactor))) * @config.frequency
            @oscillator.frequency.linearRampToValueAtTime value, t + time
            @gain.gain.linearRampToValueAtTime v.x, t + time
                        
        @setRelTime 0
        if event.detail? and event.detail.metaKey
            knix.animate @
                            
    anim: (step) =>
        @setRelTime @config.reltime + step.dsecs / @config.duration
        if @config.reltime > 1.0
            knix.deanimate @
            @setRelTime 0

    setRelTime: (rel) =>
        @config.reltime = rel
        @config.value = @pad.valAtRel @config.reltime
        if @config.reltime == 0
            @pad.hideRuler()
        else
            @pad.showRuler @config.reltime, @config.value

    sizeWindow: =>
        if @pad?
            content = @getChild 'content'
            content.setHeight @contentHeight()
            height = content.innerHeight() - 200
            width  = content.innerWidth() - 20
            @pad.setSize width, height

    @menu: =>

        @menuButton
            text   : 'ADSR'
            icon   : 'fa-cogs'
            action : -> new ADSR
                            center: true
