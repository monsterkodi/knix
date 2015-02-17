###

     0000000    0000000   000  000   000
    000        000   000  000  0000  000
    000  0000  000000000  000  000 0 000
    000   000  000   000  000  000  0000
     0000000   000   000  000  000   000

###

class Gain extends Window

    constructor: (cfg) ->

        @audio = Audio.gain cfg

        super cfg,
            title:     cfg.master and 'master' or 'gain'
            minWidth:  240
            minHeight: 60
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

    setGain:  (arg) => @audio.gain.value = _.arg(arg)
    setValue: (arg) => @audio.gain.value = _.arg(arg)

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
