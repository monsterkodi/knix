###

0000000    00000000  000       0000000   000   000
000   000  000       000      000   000   000 000 
000   000  0000000   000      000000000    00000  
000   000  000       000      000   000     000   
0000000    00000000  0000000  000   000     000   

###

class Delay extends Window

    constructor: (cfg) ->

        [ @audio, cfg ] = Audio.delay cfg

        super cfg,
            title:     'delay'
            minWidth:  240
            resize:    'horizontal'
            children:  \
            [
                type:       'jacks'
                audio:      @audio
            ,
                type:       'sliderspin'
                id:         'delay'
                value:      cfg.delay
                minValue:   cfg.minDelay
                maxValue:   cfg.maxDelay
                spinStep:   0.00001
                spinFormat: "%3.5f"
                onValue:    @setDelay
            ]

    setDelay: (arg) => @audio.delayTime.value = _.arg(arg)

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_delay'
            icon:   'octicon-dashboard'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Delay
                            center: true
