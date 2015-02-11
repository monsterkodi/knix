
class Audio

    @init: =>

        @context = new (window.AudioContext || window.webkitAudioContext)()

        # osc1.connect(gain)
        # osc1.connect(analyser)
        # osc2.connect(gain)
        # gain.connect(context.destination)

        Analyser.menu()
        Gain.menu()
        Oscillator.menu()

    @oscillator: =>

        oscillator = @context.createOscillator()
        oscillator.frequency.value = 50 # Hz?
        oscillator.start 0
        oscillator

    @gain: =>

        gain = @context.createGain()
        gain.gain.value = 0.0 # [0.0, 1.0]
        gain

    @analyser: =>

        analyser = @context.createAnalyser()
        analyser.minDecibels = -90
        analyser.maxDecibels = -10
        analyser.smoothingTimeConstant = 0.85
        analyser.fftSize = 2048
        analyser
