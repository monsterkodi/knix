###

000   000  00000000  000   000  0000000     0000000    0000000   00000000   0000000  
000  000   000        000 000   000   000  000   000  000   000  000   000  000   000
0000000    0000000     00000    0000000    000   000  000000000  0000000    000   000
000  000   000          000     000   000  000   000  000   000  000   000  000   000
000   000  00000000     000     0000000     0000000   000   000  000   000  0000000  

###

class Keyboard extends Window

    @noteNames = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B']

    @notes = 
        C:    4186.01  
        Cs:   4434.92  
        D:    4698.63  
        Ds:   4978.03  
        E:    5274.04  
        F:    5587.65  
        Fs:   5919.91  
        G:    6271.93  
        Gs:   6644.88  
        A:    7040.00  
        As:   7458.62  
        B:    7902.13
        
    @keys = 
        C:    'z'
        Cs:   's'
        D:    'x'
        Ds:   'd'
        E:    'c'
        F:    'v'
        Fs:   'g'
        G:    'b'
        Gs:   'h'
        A:    'n'
        As:   'j'
        B:    'm'

    @allNotes: =>
        if not @_allNotes?
            @_allNotes = {}            
            for n in @allNoteNames()
                nb = n.slice(0,-1)
                o = Number(n.slice(-1))
                frequency = @notes[nb] / Math.pow(2, (8-o))
                @_allNotes[n] = frequency.toFixed(3)
        @_allNotes
    
    @noteIndex: (noteName) => @allNoteNames().indexOf noteName    
    @allNoteNames: =>
        if not @_allNoteNames?
            @_allNoteNames = []
            for o in [0..8]
                for n in @noteNames
                    @_allNoteNames.push '%s%d'.fmt n, o
        @_allNoteNames

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            octave : 4
        
        children = []
        for n, v of Keyboard.notes
            sharp = n.length == 2
            children.push
                type   : 'button'
                class  : sharp and 'keyboard-key-sharp' or 'keyboard-key'
                valign : sharp and 'top' or 'bottom'
                text   : n
                # recKey : n
                keys   : [Keyboard.keys[n]]

        super cfg,
            type  : 'keyboard'
            title : 'keyboard'
            resize: false
            children : \
            [
                type     : 'hbox'
                children : \
                [
                    type     : 'spin'
                    class    : 'octave'
                    tooltip  : 'octave'
                    value    : cfg.octave
                    minValue : 0
                    maxValue : 8
                    style      :
                        width  : '100%'
                ,
                    type      : 'connector'
                    signal    : 'note'
                ]                
            ,
                type     : 'hbox'
                class    : 'keys'
                noMove   : true
                spacing  : 0
                children : children
            ]     
            
        @keys = @getChild('keys').allChildren()
        for key in @keys
            key.connect 'trigger',   @onKeyPress
            key.connect 'release',   @onKeyRelease
            
        Keys.add ',', @octaveDown
        Keys.add '.', @octaveUp
        @connect 'octave:onValue', @setOctave
        @setOctave @config.octave
        @
            
    octaveUp:   => @getChild('octave').incr '+'
    octaveDown: => @getChild('octave').incr '-'
    setOctave: (v) => 
        @config.octave = _.value v
        for key in @keys
            key.config.octave = @config.octave
            
    onKeyPress: (event) =>
        key = event.target.widget
        note = "%s%d".fmt key.config.text, @config.octave
        # log 'emit trigger', note
        @emit 'note', { note: note, type: 'trigger' }

    onKeyRelease: (event) =>    
        key = event.target.widget
        note = "%s%d".fmt key.config.text, @config.octave
        # log 'emit release', note
        @emit 'note', { note: note, type: 'release' }
        
    @menu: =>

        @menuButton
            text   : 'Keyboard'
            icon   : 'fa-music'
            action : -> new Keyboard
                            center: true
