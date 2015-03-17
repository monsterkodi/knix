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
            type     : 'oscillator'
            title    : 'oscillator'
            resize   : 'horizontal'
            children : \
            [
                type     : 'jacks'
                hasInput : false
                content  : 
                    type     : 'spinner'
                    class    : 'shape'
                    recKey   : 'shape' 
                    tooltip  : 'shape'
                    value    : cfg.shape
                    values   : Oscillator.shapes
            ,
                type     : 'sliderspin'
                class    : 'frequency'
                tooltip  : 'frequency'
                value    : cfg.frequency
                minValue : cfg.minFrequency
                maxValue : cfg.maxFrequency
            ]

        @connect 'shape:onValue',     @setShape
        @connect 'frequency:onValue', @setFrequency

        @setFrequency @config.frequency
        @setShape     @config.shape
        @

    setFrequency: (v) => @config.frequency  = _.value v; @audio.frequency.value = @config.frequency
    setShape: (v) => 
        @config.shape = if _.isString v then v else _.value v 
        @audio.type   = @config.shape

    paramValuesAtConnector: (paramValues, connector) => Audio.setValuesForParam paramValues, @audio.frequency

    @menu: =>

        @menuButton
            text   : 'oscillator'
            icon   : 'fa-circle-o-notch'
            action : -> new Oscillator
                            center: true
