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
                value    : Instruments.names[0]
                values   : Instruments.names
            ,
                type     : 'button'
                text     : 'trigger'
                class    : 'trigger'                
            ]

        @instruments = new Instruments()

        @connect 'trigger:trigger',    @onTrigger
        @connect 'gain:onValue',       @setGain
        @connect 'duration:onValue',   @setDuration
        @connect 'note:onValue',       @onNoteValue
        @connect 'instrument:onValue', @instruments.setInstrument
        
        @setDuration   @config.duration
        @setGain       @config.gain
        @
            
    setGain:      (v) => @config.gain     = _.value v; @gain.gain.value = @config.gain
    setDuration:  (v) => @config.duration = _.value v
    onNoteValue:  (v) => log _.value v

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
                                                                    
    # sizeWindow: =>
    #     super
    #     if @pad?
    #         content = @getChild 'content'
    #         content.setHeight @contentHeight()
    #         height = content.innerHeight() - 214
    #         width  = content.innerWidth() - 20
    #         @pad.setSize width, height            
                        
    @menu: =>

        @menuButton
            text   : 'Synth'
            icon   : 'fa-database'
            action : -> new Synth
                            center: true
