###

     0000000    0000000    0000000  000  000       000        0000000  000000000   0000000   00000000
    000   000  000        000       000  000       000       000   000    000     000   000  000   000
    000   000   0000000   000       000  000       000       000000000    000     000   000  0000000
    000   000        000  000       000  000       000       000   000    000     000   000  000   000
     0000000    0000000    0000000  000  000000000 000000000 000   000    000      0000000   000   000

###

class Oscillator

    constructor: (config={}) ->

        @audio = Audio.oscillator config
        @initWindow config

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_oscillator'
            icon:   'octicon-sync'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Oscillator
                            center: true

    initWindow: (cfg) =>

        @window = knix.get cfg,
            title: 'oscillator'
            minWidth: 150
            minHeight: 60
            children: \
            [
                type: 'hbox'
                children: \
                [
                    type:       'label'
                    text:       'oscillator'
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    out:        'audio'
                    audio:      @audio
                    onConnect:  (source, target) ->
                        log 'connect oscillator', source.config, target.config
                        source.config.audio.connect(target.config.audio)
                    onDisconnect: (source, target) ->
                        log 'disconnect oscillator', source.config, target.config
                        source.config.audio.disconnect(target.config.audio)
                ]
            ,
                type: 'hbox'
                children: \
                [
                    type:       'connector'
                    slot:       'slider_frequency:setValue'
                ,
                    id:         'slider_frequency'
                    type:       'slider'
                    value:      500
                    minValue:   0
                    maxValue:   12000
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    signal:     'slider_frequency:onValue'
                ]
            ]
