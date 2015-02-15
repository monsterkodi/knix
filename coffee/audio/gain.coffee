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
                type:     'hbox'
                children: children
            ,
                type:     'hbox'
                children: \
                [
                    type:       'connector'
                    slot:       'gain:setValue'
                ,
                    id:         'gain_slider'
                    type:       'slider'
                    minValue:   0.0
                    maxValue:   1.0
                    style:
                        width:  '50%'
                ,
                    id:         'gain'
                    type:       'spin'
                    value:      @audio.gain.value
                    minValue:   0.0
                    maxValue:   1.0
                    onValue:    @setValue
                    format:     "%3.2f"
                    style:
                        width:  '50%'
                ,
                    type:       'connector'
                    signal:     'gain:onValue'
                ]
            ]
            connect: \
            [
                signal: 'gain_slider:onValue'
                slot:   'gain:setValue'
            ,
                signal: 'gain:onValue'
                slot:   'gain_slider:setValue'
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
