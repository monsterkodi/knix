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

        [ @gain,       cfg ] = Audio.gain cfg
        [ @oscillator, cfg ] = Audio.oscillator cfg

        cfg = _.def cfg,
            type        : 'adsr'
            shape       : Oscillator.shapes[0]
            duration    : 0.2
            minDuration : 0.0
            maxDuration : 10.0
            numHandles  : 7

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
            # ,
            #     type     : 'spinner'
            #     class    : 'shape'
            #     recKey   : 'shape' 
            #     tooltip  : 'shape'
            #     value    : cfg.shape
            #     values   : Oscillator.shapes
            ,
                type     : 'sliderspin'
                class    : 'freqfactor'
                tooltip  : 'freqfactor'
                value    : cfg.freqfactor
                minValue : 0
                maxValue : 1.0
            ,
                type     : 'sliderspin'
                class    : 'frequency'
                tooltip  : 'frequency'
                value    : cfg.freq
                minValue : cfg.minFreq
                maxValue : cfg.maxFreq
            ,
                type      : 'sliderspin'
                class     : 'gain'
                tooltip   : 'gain'
                value     : cfg.gain
                minValue  : 0.0 
                maxValue  : 1.0
            #     type      : 'spin'
            #     class     : 'output'
            #     tooltip   : 'output'
            #     valueStep : 0.00001
            #     minWidth  : 100
            #     maxWidth  : 10000
            #     format    : cfg.valueFormat
            #     style     :
            #         width : '50%'
            # ,                
            # type      : 'connector'
            # signal    : 'envelope:onValue'
            ,
                type     : 'button'
                text     : 'trigger'
                class    : 'trigger'                
            ]

        # @connect 'envelope_in:onValue', @setRel

        @connect 'trigger:trigger',   @trigger
        @connect 'duration:onValue',  @setDuration

        @connect 'shape:onValue',      @setShape
        @connect 'frequency:onValue',  @setFreq
        @connect 'freqfactor:onValue', @setFreqFactor

        @setFreq  @config.freq
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

    setGain:  (v) => @config.gain = _.value v; @gain.gain.value = @config.gain
    setFreq:  (v) => @config.freq  = _.value v; @oscillator.frequency.value = @config.freq
    setShape: (v) => 
        @config.shape    = if _.isString v then v else _.value v 
        @oscillator.type = @config.shape

    setDuration: (v) => @config.duration = _.value v

    trigger: (event) =>
        if @config.reltime != 0
            knix.deanimate @
        Audio.sendParamValuesFromConnector { duration: @config.duration }, @connector 'ramp:onValue'
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
        @config.value = @config.reltime
        @getChild('ramp').setValue @config.value
                                
    setRel: (rel) =>
        @config.reltime = _.value rel
        @config.value = @pad.valAtRel @config.reltime
        if @config.reltime == 0
            @pad.hideRuler()
        else
            @pad.showRuler @config.reltime, @config.value
        @getChild('envelope').setValue @config.value

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
