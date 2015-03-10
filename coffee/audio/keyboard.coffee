###

000   000  00000000  000   000  0000000     0000000    0000000   00000000   0000000  
000  000   000        000 000   000   000  000   000  000   000  000   000  000   000
0000000    0000000     00000    0000000    000   000  000000000  0000000    000   000
000  000   000          000     000   000  000   000  000   000  000   000  000   000
000   000  00000000     000     0000000     0000000   000   000  000   000  0000000  

###

class Keyboard extends Window

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
        H:    7902.13

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
        H:    'm'

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            octave : 4
        
        children = []
        for n, v of Keyboard.notes
            sharp = n.length == 2
            children.push
                type   : sharp and 'keyboard-key-sharp' or 'keyboard-key'
                valign : sharp and 'top' or 'bottom'
                text   : n
                keys   : [Keyboard.keys[n]]
                style  :
                    textAlign : 'center'

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
                    signal    : 'onValue'
                ]                
            ,
                type     : 'hbox'
                class    : 'keys'
                noMove   : true
                spacing  : 0
                children : children
            ]     
            
        for key in @getChild('keys').allChildren()
            key.connect 'click', @onKeyPress
            
        @connect 'octave:onValue', @setOctave
        @
            
    setOctave: (v) => @config.octave = _.value v
            
    onKeyPress: (event) =>    
        key = event.target.widget
        frequency = Keyboard.notes[key.config.text] / Math.pow(2, (8-@config.octave))
        @emitValue frequency
        
    @menu: =>

        @menuButton
            text   : 'Keyboard'
            icon   : 'fa-music'
            action : -> new Keyboard
                            center: true
