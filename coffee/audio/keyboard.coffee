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
                    value    : cfg.ocatave
                    minValue : 0
                    maxValue : 8
                    style      :
                        width  : '100%'
                ,
                    type      : 'connector'
                    signal    : 'onNote'
                ]                
            ,
                type     : 'hbox'
                noMove   : true
                spacing  : 0
                children : children
            ]                
        @
            
    @menu: =>

        @menuButton
            text   : 'Keyboard'
            icon   : 'fa-music'
            action : -> new Keyboard
                            center: true
