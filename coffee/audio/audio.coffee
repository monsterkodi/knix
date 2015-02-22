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
        Delay.menu()
        Analyser.menu()

    @filter: (cfg) =>

        cfg = _.def cfg,
            freq:       440
            minFreq:    100
            maxFreq:    12000
            detune:     0
            minDetune:  -1000
            maxDetune:  1000
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
        [ filter, cfg ]

    @delay: (cfg) =>
        
        cfg = _.def cfg,
            delay:      0.005
            maxDelay:   5.0
            minDelay:   0.0
        
        delay = @context.createDelay(cfg.maxDelay)
        delay.delayTime.value = cfg.delay
        [ delay, cfg ]

    @oscillator: (cfg) =>

        cfg = _.def cfg,
            freq:    0
            minFreq: 0
            maxFreq: 14000

        oscillator = @context.createOscillator()
        oscillator.frequency.value = cfg.freq # in Hz
        oscillator.start 0
        [ oscillator, cfg ]

    @gain: (cfg) =>

        cfg = _.def cfg,
            gain:    0        

        gain = @context.createGain()
        gain.gain.value = cfg.gain # [0.0, 1.0]

        if cfg.master
            gain.connect @context.destination
        [ gain, cfg ]

    @analyser: (cfg) =>

        cfg = _.def cfg,
            minDecibels:    -90    
            maxDecibels:    -10   
            smoothingTime:   0.85      
            fftSize:         2048

        analyser = @context.createAnalyser()
        analyser.minDecibels = cfg.minDecibels
        analyser.maxDecibels = cfg.maxDecibels
        analyser.smoothingTimeConstant = cfg.smoothingTime
        analyser.fftSize = cfg.fftSize
        [ analyser, cfg ]
