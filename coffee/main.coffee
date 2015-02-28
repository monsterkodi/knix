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
    
    e = new Envelope
        center: true
        
    r = new Range
        x: 200
        y: 50

    o = new Oscillator
        freq: 200
        x: 500
        y: 50

    m = new Gain
        master: true
        x: 500
        y: 300

    new Connection
        source: e.connector 'envelope:onValue'
        target: r.connector 'range_in:setValue'

    new Connection
        source: r.connector 'range_out:onValue'
        target: m.connector 'gain:setValue'

    new Connection
        source: o.connector 'audio:out'
        target: m.connector 'audio:in'

    # StyleSwitch.toggle()
    # $('show_about').click()
