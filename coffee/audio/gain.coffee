###

 0000000    0000000   000  000   000
000        000   000  000  0000  000
000  0000  000000000  000  000 0 000
000   000  000   000  000  000  0000
 0000000   000   000  000  000   000

###

class Gain extends AudioWindow

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        [ @audio, cfg ]  = Audio.gain cfg
        
        super cfg,
            type     : 'gain'
            title    : cfg.master and 'master' or 'gain'
            minWidth : 240
            resize   : 'horizontal'
            children : \
            [
                type      : 'jacks'
                hasOutput : not cfg.master?
            ,
                type      : 'sliderspin'
                class     : 'gain'
                tooltip   : 'gain'
                value     : cfg.gain
                minValue  : 0.0
                maxValue  : 1.0
            ]
            
        @connect 'gain:onValue', @setGain
        @setGain @config.gain
        @

    setGain:  (v) => @config.gain = _.value v; @audio.gain.value = @config.gain
    setValue: (v) => @setGain v

    paramValuesAtConnector: (paramValues, connector) => Audio.setValuesForParam paramValues, @audio.gain
    
    @menu: =>

        @menuButton
            text   : 'gain'
            icon   : 'fa-volume-up'
            action : -> new Gain
                            center : true
                            gain   : 0.5

        @menuButton
            text   : 'master'
            icon   : 'fa-sign-out'
            action : -> new Gain
                            center : true
                            master : true
                            gain   : 0.1
