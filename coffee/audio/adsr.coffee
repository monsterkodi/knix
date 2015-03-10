###

 0000000   0000000     0000000  00000000 
000   000  000   000  000       000   000
000000000  000   000  0000000   0000000  
000   000  000   000       000  000   000
000   000  0000000    0000000   000   000

###

class ADSR extends AudioWindow

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        cfg = _.def cfg,
            type         : 'ADSR'
            shape        : Oscillator.shapes[0]
            duration     : 0.2
            minDuration  : 0.0
            maxDuration  : 10.0
            freqFactor   : 1.0
            maxFrequency : 10000
            frequency    : 2000
            gain         : 0.5
            numHandles   : 3
            vals         : [pos(0,0), pos(.2,1), pos(1,0)]

        [@gain,       cfg] = Audio.gain cfg
        [@volume,     cfg] = Audio.gain cfg
        [@oscillator, cfg] = Audio.oscillator cfg

        @volume.gain.value = 0

        @oscillator.connect @volume
        @volume.connect @gain
        @audio = @gain

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
                class    : 'freqFactor'
                tooltip  : 'freqency factor'
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

        @connect 'trigger:trigger',    @trigger
        @connect 'gain:onValue',       @setGain
        @connect 'shape:onValue',      @setShape
        @connect 'duration:onValue',   @setDuration
        @connect 'freqFactor:onValue', @setFreqFactor
        @connect 'frequency:onValue',  @setFrequency
        
        @setFreqFactor @config.freqFactor
        @setFrequency  @config.frequency
        @setDuration   @config.duration
        @setShape      @config.shape
        @setGain       @config.gain
        
        @pad = @getChild 'pad'
        @sizeWindow()
        @
            
    setGain:       (v) => @config.gain       = _.value v; @gain.gain.value = @config.gain
    setDuration:   (v) => @config.duration   = _.value v
    setFrequency:  (v) => @config.frequency  = _.value v
    setFreqFactor: (v) => @config.freqFactor = _.value v
    setShape:      (v) => 
        @config.shape    = if _.isString v then v else _.value v 
        @oscillator.type = @config.shape

    trigger: (event) =>
        if @config.reltime != 0
            knix.deanimate @

        @volume.gain.cancelScheduledValues Audio.context.currentTime
        @oscillator.frequency.cancelScheduledValues Audio.context.currentTime
        t = Audio.context.currentTime + 0.01
        for v in @pad.config.vals
            time = v.x * @config.duration
            value = (@config.freqFactor + (v.y*(1.0-@config.freqFactor))) * @config.frequency
            @oscillator.frequency.linearRampToValueAtTime value, t + time
            @volume.gain.linearRampToValueAtTime v.y, t + time
                        
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
