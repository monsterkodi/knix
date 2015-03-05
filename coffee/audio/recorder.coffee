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
                if c.constructor.name in ['Spin', 'Slider', 'Button', 'Pad']
                    @widgets.push c
        log 'found %d elements'.fmt @widgets.length 
        # for w in @widgets
        #     log w.getWindow().elem.id, w.elem.id #, w.constructor.name
        @
        
    close: =>
        log @config.tracker
