###

00000000  000  000      000000000  00000000  00000000 
000       000  000         000     000       000   000
000000    000  000         000     0000000   0000000  
000       000  000         000     000       000   000
000       000  0000000     000     00000000  000   000

###

class Filter extends AudioWindow

    @filters = ['bandpass', 'lowpass', 'highpass', 'notch', 'allpass']

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs
        cfg = _.def cfg,
            filter: Filter.filters[0]

        [ @audio, cfg ] = Audio.filter cfg

        super cfg,
            type     : 'filter'
            title    : 'filter'
            minWidth : 240
            resize   : 'horizontal'
            children : \
            [
                type     : 'jacks'
            ,
                type     : 'spinner'
                class    : 'filter'
                tooltip  : 'filter'
                value    : cfg.filter
                values   : Filter.filters
            ,
                type     : 'sliderspin'
                class    : 'frequency'
                tooltip  : 'frequency'
                value    : cfg.frequency
                minValue : cfg.minFrequency
                maxValue : cfg.maxFrequency
            ,
                type     : 'sliderspin'
                class    : 'detune'
                tooltip  : 'detune'
                value    : cfg.detune
                minValue : cfg.minDetune
                maxValue : cfg.maxDetune
            ,
                type     : 'sliderspin'
                class    : 'Q'
                tooltip  : 'Q'
                value    : cfg.Q
                minValue : cfg.minQ
                maxValue : cfg.maxQ
                spinStep : 0.01
            ]
            
        @connect 'filter:onValue', @setFilter
        @connect 'frequency:onValue', @setFrequency
        @connect 'detune:onValue', @setDetune
        @connect 'Q:onValue', @setQ

        @setQ         @config.Q
        @setFrequency @config.frequency
        @setDetune    @config.detune
        @setFilter    @config.filter
        @

    setDetune:    (v) => @config.detune    = _.value v; @audio.detune.value    = @config.detune
    setQ:         (v) => @config.Q         = _.value v; @audio.Q.value         = @config.Q
    setFrequency: (v) => @config.frequency = _.value v; @audio.frequency.value = @config.frequency
    setFilter:    (v) =>
        @config.filter = if _.isString v then v else _.value v 
        @audio.type    = @config.filter
        
    @menu: =>

        @menuButton
            text   : 'filter'
            icon   : 'fa-filter'
            action : -> new Filter
                            center: true
