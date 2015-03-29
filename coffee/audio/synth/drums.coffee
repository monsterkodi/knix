###

0000000    00000000   000   000  00     00   0000000
000   000  000   000  000   000  000   000  000     
000   000  0000000    000   000  000000000  0000000 
000   000  000   000  000   000  000 0 000       000
0000000    000   000   0000000   000   000  0000000 

###

class Drums extends AudioWindow
    
    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            type         : 'Drums'
            noteName     : 'C0'
            height       : 330 
            duration     : 0.4
            minDuration  : 0.01
            maxDuration  : 2.0
            gain         : 0.5

        [@gain, cfg] = Audio.gain cfg

        @audio = @gain

        super cfg,
            title    : 'drums'
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

        @drumset = new DrumSet()
                            
        @canvas = @getChild 'canvas'

        @connect 'trigger:trigger',    @onTrigger
        @connect 'gain:onValue',       @setGain
        @connect 'note:onValue',       @setNote
        
        @setGain       @config.gain
        @
            
    setNote:       (v) => @config.noteName = _.value v; @drawCurve()
    setGain:       (v) => @config.gain = _.value v; @gain.gain.value = @config.gain
        
    note: (event) =>
        if event.detail.event == 'trigger'
            @playNote event.detail

    onTrigger: (event) => @playNote { event: 'trigger', noteName: @getChild('note').config.value }
        
    playNote: (note) =>
        audioBuffer = @drumset.createAudioBufferForNoteIndex Keyboard.noteIndex note.noteName

        node = Audio.context.createBufferSource()
        node.buffer = audioBuffer
        node.connect @gain
        node.state = node.noteOn
        node.start 0
                                                                    
    sizeWindow: =>
        super
        content    = @getChild 'content'
        content.setHeight @contentHeight()
        height     = content.innerHeight() - 120
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

        sample = @drumset.sampleForNoteName @config.noteName
        xd = cvw / sample.length
        x = 0
            
        for i in [0...sample.length]
            v = sample[i]*0.1
            y = (0.5 + v) * cvh
            if i == 0
                ctx.moveTo(x, y)
            else
                ctx.lineTo(x, y)
            x += xd

        ctx.stroke()        
                        
    @menu: =>

        @menuButton
            text   : 'Drums'
            icon   : 'fa-database'
            action : -> new Drums
                            center: true
