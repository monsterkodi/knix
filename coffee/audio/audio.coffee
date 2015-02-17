###

     0000000   000   000  0000000    000   0000000
    000   000  000   000  000   000  000  000   000
    000000000  000   000  000   000  000  000   000
    000   000  000   000  000   000  000  000   000
    000   000   0000000   0000000    000   0000000

###

class Audio

    @init: =>

        @context = new (window.AudioContext || window.webkitAudioContext)()

        Oscillator.menu()
        Filter.menu()
        Gain.menu()
        Analyser.menu()

    @filter: (cfg) =>

        cfg = _.def cfg,
            freq:       440
            minFreq:    100
            maxFreq:    12000
            detune:     0
            minDetune:  -100
            maxDetune:  100
            gain:       1
            minGain:    0
            maxGain:    1
            Q:          1
            minQ:       0.0
            maxQ:       50
            filter:     'bandpass'

        filter = @context.createBiquadFilter()
        filter.frequency.value = cfg.freq   # in Hz
        filter.detune.value    = cfg.detune # in cnt
        filter.Q.value         = cfg.Q
        filter.type            = cfg.filter
        filter.gain.value      = cfg.gain   # [0.0, 1.0]
        [ filter, cfg ]

    @oscillator: (cfg) =>

        oscillator = @context.createOscillator()
        oscillator.frequency.value = cfg.freq or 440 # in Hz
        oscillator.start 0
        oscillator

    @gain: (cfg) =>

        gain = @context.createGain()
        gain.gain.value = cfg.gain? and cfg.gain or 0.0 # [0.0, 1.0]

        if cfg.master
            gain.connect @context.destination

        gain

    @analyser: (cfg) =>

        analyser = @context.createAnalyser()
        analyser.minDecibels = -90
        analyser.maxDecibels = -10
        analyser.smoothingTimeConstant = 0.85
        analyser.fftSize = 2048
        analyser
