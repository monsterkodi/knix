###

00000000   00000000   0000000   0000000   00000000   0000000    00000000  00000000 
000   000  000       000       000   000  000   000  000   000  000       000   000
0000000    0000000   000       000   000  0000000    000   000  0000000   0000000  
000   000  000       000       000   000  000   000  000   000  000       000   000
000   000  00000000   0000000   0000000   000   000  0000000    00000000  000   000

###

class Recorder

    constructor: (cfg, defs) -> @init cfg, defs

    init: (cfg, defs) =>
        
        @config  = _.def cfg, defs
        @tracker = $(@config.tracker).getWidget()
        @widgets = []
        for win in knix.allWindows()
            @registerWindow win
                    
        log 'recording: %d elements'.fmt @widgets.length
        @
        
    registerWindow: (win) =>
        if win.constructor.name in ['Tracker', 'Analyser'] then return
        for c in win.getAllChildren()
            if c.constructor.name in ['Spin', 'Slider', 'Spinner', 'Button', 'Pad']
                switch c.constructor.name
                    when 'Button'
                        if not c.elem.hasClassName 'tool-button'
                            @widgets.push c
                            c.connect 'mousedown', @onButtonDown
                    # when 'Pad'    then log 'todo:pad'
                    else c.connect 'valueInput', @onValueInput 
                
    onValueInput: (event) =>
        # log 'value', event.target.id, _.value event
        @tracker.addValue event.target
        
    onButtonDown: (event) =>
        # log 'button down', event.target
        @tracker.addTrigger event.target
    
    close: =>
        log @config.tracker
