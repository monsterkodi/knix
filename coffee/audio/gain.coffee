###

     0000000    0000000   000  000   000
    000        000   000  000  0000  000
    000  0000  000000000  000  000 0 000
    000   000  000   000  000  000  0000
     0000000   000   000  000  000   000

###

class Gain extends Window

    constructor: (config={}) ->

        @audio = Audio.gain config

        super config,
            title:     config.master and 'master' or 'gain'
            minWidth:  240
            minHeight: 60
            children:  \
            [
                type:       'jacks'
                audio:      @audio
                hasOutput:  not config.master?
            ,
                type:       'sliderspin'
                id:         'gain'
                value:      @audio.gain.value
                onValue:    @setValue
                minValue:   0.0
                maxValue:   1.0
            ]

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
