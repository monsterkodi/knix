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
        
        @config   = _.def cfg, defs
        @timeline = $(@config.timeline).getWidget()
        @triggers = []
        @values   = []
        for win in knix.allWindows()
            @registerWindow win
                    
        log 'recording: %d triggers %d values'.fmt @triggers.length, @values.length
        @
        
    registerWindow: (win) =>
        if win.constructor.name in ['Timeline', 'Analyser'] then return
        for c in win.allChildren()
            if c.constructor.name in ['Spin', 'Slider', 'Spinner', 'Button', 'Pad']
                switch c.constructor.name
                    when 'Button'
                        if not c.elem.hasClassName 'tool-button'
                            @triggers.push c
                            c.connect 'mousedown', @onButtonDown
                            c.connect 'mouseup',   @onButtonUp
                    # when 'Pad'    then log 'todo:pad'
                    else
                        if c.config.recKey
                            @values.push c
                            c.connect 'valueInput', @onValueInput 
                
    onValueInput: (event) =>
        # log 'value', event.target.id, _.value event
        @timeline.grid.addValue event.target.getWidget()
        
    onButtonDown: (event) =>
        # log 'button down', event.target
        @timeline.grid.addTrigger event.target

    onButtonUp: (event) =>
        # log 'button down', event.target
        @timeline.grid.addRelease event.target
    
    close: =>
        for trigger in @triggers
            trigger.disconnect 'mousedown', @onButtonDown
        @triggers.clear()        
        for value in @values
            value.disconnect 'valueInput', @onValueInput
        @values.clear()
