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
            height       : 330 
            duration     : 0.2
            minDuration  : 0.0
            maxDuration  : 10.0
            freqFactor   : 1.0
            maxFrequency : 10000
            frequency    : 2000
            gain         : 0.5
            voices       : 16
            numHandles   : 3
            sustainIndex : 1
            vals         : [pos(0,0), pos(.2,1), pos(1,0)]

        [@gain,       cfg] = Audio.gain cfg

        @voice = []
        @volume = []
        @oscillator = []
        for i in [0...cfg.voices]
            [volume,     cfg] = Audio.gain cfg
            [oscillator, cfg] = Audio.oscillator cfg
            @voice.push undefined
            @volume.push volume
            @oscillator.push oscillator
            oscillator.connect volume
            volume.gain.value = 0
            volume.connect @gain
        
        @audio = @gain

        super cfg,
            title    : 'adsr'
            recKey   : 'adsr'
            children : \
            [
                type     : 'jacks'
                hasInput : false
                content  :
                    type: 'hbox'
                    children: \
                    [
                        type      : 'connector'
                        slot      : 'note'
                    ,
                        type     : 'spinner'
                        class    : 'note'
                        recKey   : 'note' 
                        tooltip  : 'note'
                        value    : 'C0'
                        recKey   : 'note'
                        values   : Keyboard.allNoteNames()
                        style: 
                            width: '50%'
                    ,
                        type     : 'spinner'
                        class    : 'shape'
                        recKey   : 'shape' 
                        tooltip  : 'shape'
                        value    : cfg.shape
                        values   : Oscillator.shapes
                        style: 
                            width: '50%'
                    ]
            ,
                type         : 'pad'
                class        : 'pad'
                numHandles   : cfg.numHandles
                sustainIndex : cfg.sustainIndex
                vals         : cfg.vals
                minHeight    : 50
                minWidth     : 150
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
                type     : 'sliderspin'
                class    : 'gain'
                tooltip  : 'gain'
                value    : cfg.gain
                minValue : 0.0 
                maxValue : 1.0
            ,
                type     : 'button'
                text     : 'trigger'
                class    : 'trigger'                
            ]

        @connect 'trigger:trigger',    @trigger
        @connect 'trigger:release',    @release
        @connect 'gain:onValue',       @setGain
        @connect 'shape:onValue',      @setShape
        @connect 'duration:onValue',   @setDuration
        @connect 'freqFactor:onValue', @setFreqFactor
        @connect 'frequency:onValue',  @setFrequency
        @connect 'note:onValue',       @onNoteValue
        
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
        @config.shape  = if _.isString v then v else _.value v 
        for i in [0...@config.voices]
            @oscillator[i].type = @config.shape

    voiceIndex: (id) =>
        for i in [0...@config.voices]
            if @voice[i]?.id == id then return i
        for i in [0...@config.voices]
            if @voice[i] == undefined
                @voice[i] = { id : id }
                return i
        warn 'no free voice'
        @voice[0] = { id : id }
        0

    onNoteValue: (event) =>
        note = _.value event
        f = Keyboard.allNotes()[note]
        @getChild('frequency').setValue f
        
    note: (event) =>
        note = event.detail
        f = @config.frequency
        @config.frequency = Keyboard.allNotes()[note.note]
        if note.type == 'trigger'
            @trigger { detail: note.note }
        else
            @release { detail: note.note }
        @emit 'onNote'
        @config.frequency = f

    trigger: (event) =>
        # log event.detail
        i = @voiceIndex event.detail
        @volume[i].gain.cancelScheduledValues Audio.context.currentTime
        @oscillator[i].frequency.cancelScheduledValues Audio.context.currentTime
        t = Audio.context.currentTime + 0.01
        for vi in [0..@pad.config.sustainIndex]
            v = @pad.config.vals[vi]
            time = v.x * @config.duration
            value = (@config.freqFactor + (v.y*(1.0-@config.freqFactor))) * @config.frequency
            @oscillator[i].frequency.linearRampToValueAtTime value, t + time
            @volume[i].gain.linearRampToValueAtTime v.y, t + time
            if vi == @pad.config.sustainIndex
                @voice[i].done = t + time
                        
    release: (event) =>
        # log event.detail
        i = @voiceIndex event.detail
        t = Audio.context.currentTime + 0.01
        for vi in [@pad.config.sustainIndex...@pad.config.vals.length]
            v = @pad.config.vals[vi]
            time = v.x * @config.duration
            value = (@config.freqFactor + (v.y*(1.0-@config.freqFactor))) * @config.frequency
            @oscillator[i].frequency.linearRampToValueAtTime value, t + time
            @volume[i].gain.linearRampToValueAtTime v.y, t + time
            # log v.y, t, t + time
            if vi == @pad.config.vals.length-1
                @voice[i].done = Math.max @voice[i].done, t + time
                msec = (@voice[i].done-t)*1000
                @voice[i].timeout = setTimeout @voiceDone, msec, i
                
    voiceDone: (i) => @voice[i] = undefined
                            
    sizeWindow: =>
        super
        if @pad?
            content = @getChild 'content'
            content.setHeight @contentHeight()
            height = content.innerHeight() - 214
            width  = content.innerWidth() - 20
            @pad.setSize width, height

    @menu: =>

        @menuButton
            text   : 'ADSR'
            icon   : 'fa-cogs'
            action : -> new ADSR
                            center: true
