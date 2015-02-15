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

        # osc1.connect(gain)
        # osc1.connect(analyser)
        # osc2.connect(gain)
        # gain.connect(context.destination)

        Oscillator.menu()
        Analyser.menu()
        Gain.menu()

    @oscillator: (cfg) =>

        oscillator = @context.createOscillator()
        oscillator.frequency.value = 50 # Hz?
        oscillator.start 0
        oscillator

    @gain: (cfg) =>

        gain = @context.createGain()
        gain.gain.value = 0.0 # [0.0, 1.0]

        if cfg.master
            gain.connect(@context.destination)

        gain

    @analyser: (cfg) =>

        analyser = @context.createAnalyser()
        analyser.minDecibels = -90
        analyser.maxDecibels = -10
        analyser.smoothingTimeConstant = 0.85
        analyser.fftSize = 2048
        analyser
