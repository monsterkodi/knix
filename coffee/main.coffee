###

00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000

###

document.observe "dom:loaded", ->

    # _________________________________________________________________________ init

    knix.init
        console: true
        # console: 'shade'

    # _________________________________________________________________________ widget test

    # Test.connectors()
    # Test.stageButtons()
    # Test.helloSlider()
    # Test.sliderAndValue()
    # Test.svgPath()
    Test.audio()

    t = new Ramp
        x: 200
        y: 250
        duration: 1
    
    e = new Envelope
        center: true   
        vals:        [pos(0,0), pos(0.15,0.75), pos(0.5,1), pos(0.75,0.25), pos(1,0)]

    r = new Range
        x: 200
        y: 50
        low: 100
        high: 400

    o = new Oscillator
        freq: 200
        maxFreq: 2000
        x: 500
        y: 50

    m = new Gain
        master: true
        x: 500
        y: 300

    new Connection
        source: t.connector 'ramp:onValue'
        target: e.connector 'envelope_in:setValue'

    new Connection
        source: e.connector 'envelope:onValue'
        target: m.connector 'gain:setValue'

    new Connection
        source: e.connector 'envelope:onValue'
        target: r.connector 'range_in:setValue'

    new Connection
        source: r.connector 'range_out:onValue'
        target: o.connector 'frequency:setValue'

    new Connection
        source: o.connector 'audio:out'
        target: m.connector 'audio:in'

    # StyleSwitch.toggle()
    # $('show_about').click()
