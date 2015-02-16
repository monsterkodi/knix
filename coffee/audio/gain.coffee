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

        children = [
            type:       'connector'
            in:         'audio'
            audio:      @audio
        ,
            type:       'label'
            text:       'audio'
            style:
                width:  '100%'
        ]

        if not config.master
            children.push
                type:         'connector'
                out:          'audio'
                audio:        @audio
                onConnect:    (source, target) -> source.config.audio.connect    target.config.audio
                onDisconnect: (source, target) -> source.config.audio.disconnect target.config.audio

        super config,
            title:     config.master and 'master' or 'gain'
            minWidth:  240
            minHeight: 60
            children:  \
            [
                type:       'hbox'
                children:   children
            ,
                type:       'sliderspin'
                id:         'gain'
                value:      @audio.gain.value
                onValue:    @setValue
                minValue:   0.0
                maxValue:   1.0
            ]

    setValue: (arg) =>
        # log _.arg(arg)
        @audio.gain.value = _.arg(arg)

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
