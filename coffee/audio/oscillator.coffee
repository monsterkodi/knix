###

 0000000    0000000   0000000  000  000      000       0000000   000000000   0000000   00000000 
000   000  000       000       000  000      000      000   000     000     000   000  000   000
000   000  0000000   000       000  000      000      000000000     000     000   000  0000000  
000   000       000  000       000  000      000      000   000     000     000   000  000   000
 0000000   0000000    0000000  000  0000000  0000000  000   000     000      0000000   000   000

###

class Oscillator extends Window

    @shapes = ['sine', 'triangle', 'sawtooth', 'square']

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        [ @audio, cfg ] = Audio.oscillator cfg

        super cfg,
            type:       'oscillator'
            title:      'oscillator'
            minWidth:   220
            resize:     'horizontal'
            children: \
            [
                type:       'jacks'
                hasInput:   false
            ,
                type:       'spinner'
                id:         'shape'
                value:      cfg.shape? and Oscillator.shapes.indexOf(cfg.shape) or 0
                values:     Oscillator.shapes
            ,
                type:       'sliderspin'
                id:         'frequency'
                value:      cfg.freq
                minValue:   cfg.minFreq
                maxValue:   cfg.maxFreq
            ]

        @connect 'shape:onValue',     @setShape
        @connect 'frequency:onValue', @setFreq

        @setFreq cfg.freq
        @setShape(Oscillator.shapes.indexOf(cfg.shape)) if cfg.shape?

    setFreq:  (v) => @audio.frequency.value = _.value v
    setShape: (v) => @audio.type = Oscillator.shapes[_.value(v)]

    paramValuesAtConnector: (paramValues, connector) => Audio.setValuesForParam paramValues, @audio.frequency

    @menu: =>

        knix.create
            type:    'button'
            tooltip: 'oscillator'
            id:      'new_oscillator'
            icon:    'octicon-sync'
            class:   'tool-button'
            parent:  'menu'
            onClick: -> new Oscillator
                            center: true
