
class Gain

    constructor: (config={}) ->

        @gain = Audio.gain()

        @initWindow config

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_gain'
            icon:   'octicon-unmute'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Gain()

    initWindow: (cfg) =>

        @window = knix.get cfg,
            title: 'gain'
            minWidth: 150
            minHeight: 60
            children: \
            [
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
                    signal:     'slider_frequency:onValue'
                ]

            ]
