###

 0000000    0000000   000  000   000
000        000   000  000  0000  000
000  0000  000000000  000  000 0 000
000   000  000   000  000  000  0000
 0000000   000   000  000  000   000

###

class Gain extends Window

    constructor: (cfg) ->

        [ @audio, cfg ]  = Audio.gain cfg

        super cfg,
            title:     cfg.master and 'master' or 'gain'
            minWidth:  240
            resize:    'horizontal'
            children:  \
            [
                type:       'jacks'
                audio:      @audio
                hasOutput:  not cfg.master?
            ,
                type:       'sliderspin'
                id:         'gain'
                value:      cfg.gain
                onValue:    @setGain
                minValue:   0.0
                maxValue:   1.0
            ]

    setGain:  (v) => @audio.gain.value = _.value v
    setValue: (v) => @audio.gain.value = _.value v

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_gain'
            icon:   'octicon-dashboard'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Gain
                            center: true

        knix.create
            type:   'button'
            id:     'new_master'
            icon:   'octicon-unmute'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Gain
                            center: true
                            master: true
