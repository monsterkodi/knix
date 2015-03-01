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

        [ @audio, cfg ] = Audio.filter cfg

        super cfg,
            type:      'filter'
            title:     'filter'
            minWidth:  240
            resize:    'horizontal'
            children:  \
            [
                type:       'jacks'
                audio:      @audio
            ,
                type:       'spinner'
                id:         'filter'
                value:      Filter.filters.indexOf(cfg.filter)
                values:     Filter.filters
                onValue:    @setFilter
            ,
                type:       'sliderspin'
                id:         'frequency'
                value:      cfg.freq
                minValue:   cfg.minFreq
                maxValue:   cfg.maxFreq
                onValue:    @setFreq
            ,
                type:       'sliderspin'
                id:         'detune'
                value:      cfg.detune
                minValue:   cfg.minDetune
                maxValue:   cfg.maxDetune
                onValue:    @setDetune
            ,
                type:       'sliderspin'
                id:         'Q'
                value:      cfg.Q
                onValue:    @setQ
                minValue:   cfg.minQ
                maxValue:   cfg.maxQ
                spinStep:   0.01
            # ,
            #     type:       'sliderspin'
            #     id:         'gain'
            #     value:      cfg.gain
            #     onValue:    @setGain
            #     minValue:   0.0
            #     maxValue:   1.0
            ]

        @setFilter Filter.filters.indexOf cfg.filter

    setDetune: (v) => @audio.detune.value       = _.value v
    setQ:      (v) => @audio.Q.value            = _.value v
    setFreq:   (v) => @audio.frequency.value    = _.value v
    setGain:   (v) => @audio.gain.value         = _.value v
    setFilter: (v) => @audio.type = Filter.filters[_.value v]

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
