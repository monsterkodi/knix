###

 0000000  000   000  000   000  000000000  000   000
000        000 000   0000  000     000     000   000
0000000     00000    000 0 000     000     000000000
     000     000     000  0000     000     000   000
0000000      000     000   000     000     000   000

###

class Synth extends AudioWindow
    
    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            type         : 'Synth'
            instrument   : Instruments.names[0]
            noteName     : 'C4'
            height       : 330 
            duration     : 0.2
            minDuration  : 0.0
            maxDuration  : 10.0
            gain         : 0.5

        [@gain, cfg] = Audio.gain cfg

        @audio = @gain

        super cfg,
            title    : 'synth'
            recKey   : 'synth'
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
                        value    : cfg.noteName
                        recKey   : 'note'
                        values   : Keyboard.allNoteNames()
                        style: 
                            width: '100%'
                    ]
            ,
                type       : 'canvas'
                class      : 'synth_canvas'
                style      :
                    width  : '100%'
                    height : '100%'
                    marginBottom: '6px'
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
                class    : 'gain'
                tooltip  : 'gain'
                value    : cfg.gain
                minValue : 0.0 
                maxValue : 1.0
            ,
                type     : 'spinner'
                class    : 'instrument'
                tooltip  : 'instrument'
                value    : cfg.instrument
                values   : Instruments.names
            ,
                type     : 'button'
                text     : 'trigger'
                class    : 'trigger'                
            ]

        @instruments = new Instruments()
        @canvas = @getChild 'canvas'

        @connect 'trigger:trigger',    @onTrigger
        @connect 'gain:onValue',       @setGain
        @connect 'duration:onValue',   @setDuration
        @connect 'instrument:onValue', @setInstrument
        
        @setDuration   @config.duration
        @setGain       @config.gain
        @
            
    setGain:      (v) => @config.gain     = _.value v; @gain.gain.value = @config.gain
    setDuration:  (v) => @config.duration = _.value v
    setInstrument: (v) => 

        @instruments.setInstrument v
        
        cvs = @canvas.elem
        ctx = cvs.getContext("2d")
        cvw = cvs.getWidth()
        cvh = cvs.getHeight()

        ctx.lineWidth = 1

        ctx.fillStyle   = StyleSwitch.colors.analyser
        ctx.fillRect    0, 0, cvw, cvh
        ctx.strokeStyle = 'rgb(0,0,0)'
        ctx.strokeRect  0, 0, cvw, cvh

        ctx.strokeStyle = StyleSwitch.colors.analyser_trace
        ctx.beginPath()

        xd = @getWidth() / @instruments.sampleLength

        x = 0

        sampleIndex = Keyboard.noteIndex 'C4'

        # for i in [0..10]
        #     log @instruments.samples[sampleIndex][i*10]
            
        for i in [0...@instruments.sampleLength]
            v = @instruments.samples[sampleIndex][i]*0.1
            y = (0.5 + v) * cvh
            if i == 0
                ctx.moveTo(x, y)
            else
                ctx.lineTo(x, y)

            x += xd

        ctx.stroke()

    note: (event) =>
        if event.detail.event == 'trigger'
            @playNote event.detail

    onTrigger: (event) => @playNote { event: 'trigger', noteName: @getChild('note').config.value }
        
    playNote: (note) =>
        audioBuffer = @instruments.createAudioBufferForNoteIndex Keyboard.noteIndex note.noteName

        node = Audio.context.createBufferSource()
        node.buffer = audioBuffer
        node.connect @gain
        node.state = node.noteOn
        node.start 0
                                                                    
    sizeWindow: =>
        super
        content    = @getChild 'content'
        content.setHeight @contentHeight()
        height     = content.innerHeight() - 180
        width      = content.innerWidth() - 20
        @canvas?.resize width, height
                        
    @menu: =>

        @menuButton
            text   : 'Synth'
            icon   : 'fa-database'
            action : -> new Synth
                            center: true
