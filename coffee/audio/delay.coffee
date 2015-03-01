###

0000000    00000000  000       0000000   000   000
000   000  000       000      000   000   000 000 
000   000  0000000   000      000000000    00000  
000   000  000       000      000   000     000   
0000000    00000000  0000000  000   000     000   

###

class Delay extends Window
    
    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        [ @audio, cfg ] = Audio.delay cfg

        super cfg,
            type:      'delay'
            title:     'delay'
            minWidth:  240
            resize:    'horizontal'
            children:  \
            [
                type:       'jacks'
            ,
                type:       'sliderspin'
                id:         'delay'
                value:      cfg.delay
                minValue:   cfg.minDelay
                maxValue:   cfg.maxDelay
                spinStep:   0.00001
                spinFormat: "%3.5f"
            ]
            
        @connect 'delay:onValue', @setDelay

    setDelay: (v) => @audio.delayTime.value = _.value v

    @menu: =>

        knix.create
            type:    'button'
            id:      'new_delay'
            tooltip: 'delay'
            icon:    'octicon-hourglass'
            class:   'tool-button'
            parent:  'menu'
            onClick: -> new Delay
                            center: true
