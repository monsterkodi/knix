###

00000000  000  000      000000000  00000000  00000000 
000       000  000         000     000       000   000
000000    000  000         000     0000000   0000000  
000       000  000         000     000       000   000
000       000  0000000     000     00000000  000   000

###

class Filter extends Window

    @filters = ['bandpass', 'lowpass', 'highpass', 'notch', 'allpass']

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs
        cfg = _.def cfg,
            filter: Filter.filters[0]

        [ @audio, cfg ] = Audio.filter cfg

        super cfg,
            type:      'filter'
            title:     'filter'
            minWidth:  240
            resize:    'horizontal'
            children:  \
            [
                type:       'jacks'
            ,
                type:       'spinner'
                id:         'filter'
                value:      cfg.filter
                values:     Filter.filters
            ,
                type:       'sliderspin'
                id:         'frequency'
                value:      cfg.freq
                minValue:   cfg.minFreq
                maxValue:   cfg.maxFreq
            ,
                type:       'sliderspin'
                id:         'detune'
                value:      cfg.detune
                minValue:   cfg.minDetune
                maxValue:   cfg.maxDetune
            ,
                type:       'sliderspin'
                id:         'Q'
                value:      cfg.Q
                minValue:   cfg.minQ
                maxValue:   cfg.maxQ
                spinStep:   0.01
            ]
            
        @connect 'filter:onValue', @setFilter
        @connect 'frequency:onValue', @setFreq
        @connect 'detune:onValue', @setDetune
        @connect 'Q:onValue', @setQ

        @setQ      @config.Q
        @setFreq   @config.freq
        @setDetune @config.detune
        @setFilter @config.filter
        @

    setDetune: (v) => @config.detune = _.value v; @audio.detune.value    = @config.detune
    setQ:      (v) => @config.Q      = _.value v; @audio.Q.value         = @config.Q
    setFreq:   (v) => @config.freq   = _.value v; @audio.frequency.value = @config.freq
    setFilter: (v) =>
        @config.filter = if _.isString v then v else _.value v 
        @audio.type    = @config.filter

    @menu: =>

        knix.create
            type:    'button'
            tooltip: 'filter'
            id:      'new_filter'
            icon:    'octicon-gear'
            class:   'tool-button'
            parent:  'menu'
            onClick: -> new Filter
                            center: true
