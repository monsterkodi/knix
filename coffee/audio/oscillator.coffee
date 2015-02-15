###

     0000000    0000000    0000000  000  000       000        0000000  000000000   0000000   00000000
    000   000  000        000       000  000       000       000   000    000     000   000  000   000
    000   000   0000000   000       000  000       000       000000000    000     000   000  0000000
    000   000        000  000       000  000       000       000   000    000     000   000  000   000
     0000000    0000000    0000000  000  000000000 000000000 000   000    000      0000000   000   000

###

class Oscillator

    constructor: (config={}) ->

        @gain = Audio.oscillator()

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
            child:
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
