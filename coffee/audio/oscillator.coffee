###

 0000000    0000000   0000000  000  000      000       0000000   000000000   0000000   00000000 
000   000  000       000       000  000      000      000   000     000     000   000  000   000
000   000  0000000   000       000  000      000      000000000     000     000   000  0000000  
000   000       000  000       000  000      000      000   000     000     000   000  000   000
 0000000   0000000    0000000  000  0000000  0000000  000   000     000      0000000   000   000

###

class Oscillator extends AudioWindow

    @shapes = ['sine', 'triangle', 'sawtooth', 'square']

    init: (cfg, defs) =>
    
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            shape: Oscillator.shapes[0]

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
                value:      cfg.shape
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

        @setFreq  @config.freq
        @setShape @config.shape
        @sizeWindow()
        @

    setFreq:  (v) => @config.freq  = _.value v; @audio.frequency.value = @config.freq
    setShape: (v) => 
        @config.shape = if _.isString v then v else _.value v 
        @audio.type = @config.shape

    paramValuesAtConnector: (paramValues, connector) => Audio.setValuesForParam paramValues, @audio.frequency

    @menu: =>

        @menuButton
            text:    'oscillator'
            icon:    'fa-circle-o-notch'
            action:  -> new Oscillator
                            center: true
