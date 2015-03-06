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
            if win.constructor.name in ['Tracker', 'Analyser'] then continue
            for c in win.getAllChildren()
                if c.constructor.name in ['Spin', 'Slider', 'Spinner', 'Button', 'Pad']
                    @widgets.push c
                    switch c.constructor.name
                        when 'Button' then c.connect 'mousedown', @onButtonDown
                        # when 'Pad'    then log 'todo:pad'
                        else c.connect 'valueInput', @onValueInput 
                    
        log 'recording: %d elements'.fmt @widgets.length 
        # for w in @widgets
        #     log w.getWindow().elem.id, w.elem.id #, w.constructor.name
        @
        
    onValueInput: (event) =>
        # log 'value', event.target.id, _.value event
        @tracker.addValue event
        
    onButtonDown: (event) =>
        # log 'button down', event.target
        @tracker.addTrigger event
    
    close: =>
        log @config.tracker
