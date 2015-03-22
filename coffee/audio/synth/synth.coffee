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
            instrument   : 'guitar'
            noteName     : 'C4'
            height       : 330 
            duration     : 0.4
            minDuration  : 0.01
            maxDuration  : 2.0
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
                        type    : 'connector'
                        slot    : 'note'
                    ,
                        type    : 'spinner'
                        class   : 'note'
                        recKey  : 'note' 
                        tooltip : 'note'
                        value   : cfg.noteName
                        recKey  : 'note'
                        values  : Keyboard.allNoteNames()
                        style   : 
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

        @instruments = new Instruments
                            duration : cfg.duration
                            
        @canvas = @getChild 'canvas'

        @connect 'trigger:trigger',    @onTrigger
        @connect 'gain:onValue',       @setGain
        @connect 'note:onValue',       @setNote
        @connect 'duration:onValue',   @setDuration
        @connect 'instrument:onValue', @setInstrument
        
        @setDuration   @config.duration
        @setGain       @config.gain
        @
            
    setNote:       (v) => @config.noteName = _.value v; @drawCurve()
    setGain:       (v) => @config.gain = _.value v; @gain.gain.value = @config.gain
    setDuration:   (v) => 
        @config.duration = _.value v
        @instruments.setDuration v
        @drawCurve()

    setInstrument: (v) => 
        @instruments.setInstrument v
        @drawCurve()
        
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
        @drawCurve()
        
    drawCurve: =>
        
        cvs = @canvas.elem
        ctx = cvs.getContext("2d")
        cvw = cvs.getWidth()
        cvh = cvs.getHeight()

        ctx.lineWidth = 1

        ctx.fillStyle   = StyleSwitch.colors.synth_canvas
        ctx.fillRect    0, 0, cvw, cvh
        ctx.strokeStyle = 'rgb(0,0,0)'
        ctx.strokeRect  0, 0, cvw, cvh

        ctx.beginPath()
        ctx.strokeStyle = StyleSwitch.colors.analyser_trigger
        hh = cvh * 0.5
        ctx.moveTo  0,   hh
        ctx.lineTo  cvw, hh
        ctx.stroke()

        ctx.strokeStyle = StyleSwitch.colors.synth_trace
        ctx.beginPath()

        xd = cvw / @instruments.sampleLength

        x = 0

        sampleIndex = Keyboard.noteIndex @config.noteName
            
        for i in [0...@instruments.sampleLength]
            v = @instruments.samples[sampleIndex][i]*0.1
            y = (0.5 + v) * cvh
            if i == 0
                ctx.moveTo(x, y)
            else
                ctx.lineTo(x, y)
            x += xd

        ctx.stroke()        
                        
    @menu: =>

        @menuButton
            text   : 'Synth'
            icon   : 'fa-database'
            action : -> new Synth
                            center: true
