###

0000000    00000000  000       0000000   000   000
000   000  000       000      000   000   000 000 
000   000  0000000   000      000000000    00000  
000   000  000       000      000   000     000   
0000000    00000000  0000000  000   000     000   

###

class Delay extends AudioWindow
    
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
                class:      'delay'
                tooltip:    'delay'
                value:      cfg.delay
                minValue:   cfg.minDelay
                maxValue:   cfg.maxDelay
                spinStep:   0.0001
                spinFormat: "%3.5f"
            ]
            
        @connect 'delay:onValue', @setDelay
        @

    setDelay: (v) => @config.delay = _.value v; @audio.delayTime.value = @config.delay

    @menu: =>

        @menuButton
            text:    'delay'
            icon:    'octicon-hourglass'
            action:  -> new Delay
                            center: true
