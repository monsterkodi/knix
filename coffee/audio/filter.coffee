###

     00000000  000  000        000000000  00000000  00000000
     000       000  000           000     000       000   000
     000000    000  000           000     0000000   0000000
     000       000  000           000     000       000   000
     000       000  000000000     000     00000000  000   000

###

class Filter extends Window

    @filters = ['bandpass', 'lowpass', 'highpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']

    constructor: (cfg) ->

        [ @audio, cfg ] = Audio.filter cfg

        super cfg,
            title:     'filter'
            minWidth:  240
            minHeight: 60
            children:  \
            [
                type:       'jacks'
                audio:      @audio
            ,
                type:       'sliderspin'
                id:         'filter'
                value:      Filter.filters.indexOf(cfg.filter)
                minValue:   0
                maxValue:   Filter.filters.length-1
                sliderStep: 1
                sliderKnob: true
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
            ,
                type:       'sliderspin'
                id:         'gain'
                value:      cfg.gain
                onValue:    @setGain
                minValue:   0.0
                maxValue:   1.0
            ]

        @setFilter Filter.filters.indexOf cfg.filter

    setDetune: (arg) => @audio.detune.value       = _.arg(arg)
    setQ:      (arg) => @audio.Q.value            = _.arg(arg)
    setFreq:   (arg) => @audio.frequency.value    = _.arg(arg)
    setGain:   (arg) => @audio.gain.value         = _.arg(arg)
    setFilter: (arg) => @audio.type = Filter.filters[_.arg(arg)]

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_filter'
            icon:   'octicon-gear'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Filter
                            center: true
