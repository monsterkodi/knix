
class Oscillator

    constructor: (config={}) ->

        @gain = Audio.oscillator()

        @initWindow config

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_oscillator'
            icon:   'octicon-terminal'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Oscillator()

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
                    type:       'connector'
                    slot:       'slider_frequency:setValue'
                ,
                    id:         'slider_frequency'
                    type:       'slider'
                    value:      50
                    minValue:   0
                    maxValue:   18000
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    signal:     'slider_frequency:onValue'
                ]
            ]
