###

 0000000    0000000   0000000  000  000      000       0000000   000000000   0000000   00000000 
000   000  000       000       000  000      000      000   000     000     000   000  000   000
000   000  0000000   000       000  000      000      000000000     000     000   000  0000000  
000   000       000  000       000  000      000      000   000     000     000   000  000   000
 0000000   0000000    0000000  000  0000000  0000000  000   000     000      0000000   000   000

###

class Oscillator extends Window

    @shapes = ['sine', 'triangle', 'sawtooth', 'square']

    constructor: (cfg) ->

        cfg = _.def cfg,
            freq:    0
            minFreq: 0
            maxFreq: 14000

        @audio = Audio.oscillator cfg

        super cfg,
            title: 'oscillator'
            minWidth: 150
            minHeight: 60
            children: \
            [
                type:       'jacks'
                audio:      @audio
                hasInput:   false
            ,
                type:       'sliderspin'
                id:         'frequency'
                value:      cfg.freq
                minValue:   cfg.minFreq
                maxValue:   cfg.maxFreq
                onValue:    @setFreq
            ,
                type:       'sliderspin'
                id:         'shape'
                value:      cfg.shape? and Oscillator.shapes.indexOf(cfg.shape) or 0
                minValue:   0
                maxValue:   3
                sliderStep: 1
                sliderKnob: true
                onValue:    @setShape
            ]

        @setFreq cfg.freq
        @setShape(Oscillator.shapes.indexOf(cfg.shape)) if cfg.shape?

    setFreq: (arg)  => @audio.frequency.value = _.arg(arg)
    setShape: (arg) => @audio.type = Oscillator.shapes[_.arg(arg)]

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_oscillator'
            icon:   'octicon-sync'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Oscillator
                            center: true
