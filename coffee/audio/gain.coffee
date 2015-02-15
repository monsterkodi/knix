###

     0000000    0000000   000  000   000
    000        000   000  000  0000  000
    000  0000  000000000  000  000 0 000
    000   000  000   000  000  000  0000
     0000000   000   000  000  000   000

###

class Gain

    constructor: (config={}) ->

        @audio = Audio.gain config
        @initWindow config

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

    initWindow: (cfg) =>

        children = [
            type:       'connector'
            in:         'audio'
            audio:      @audio
            # onConnect:  (source, target) -> log 'onConnect', source.config, target.config
        ,
            type:       'label'
            text:       'gain'
            style:
                width:  '100%'
        ]

        if not cfg.master
            children.push
                type:       'connector'
                out:        'audio'
                audio:      @audio
                onConnect:  (source, target) ->
                        log 'connect gain', source.config, target.config
                        source.config.audio.connect(target.config.audio)
                onDisconnect: (source, target) ->
                    log 'disconnect gain', source.config, target.config
                    source.config.audio.disconnect(target.config.audio)

        @window = knix.get cfg,
            title:     cfg.master and 'master' or 'gain'
            minWidth:  150
            minHeight: 60
            children:  \
            [
                type: 'hbox'
                children: children
            ,
                type: 'hbox'
                children: \
                [
                    type:       'connector'
                    slot:       'slider_gain:setValue'
                ,
                    id:         'slider_gain'
                    type:       'slider'
                    value:      0
                    minValue:   0.0
                    maxValue:   1.0
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    signal:     'slider_gain:onValue'
                ]
            ]
