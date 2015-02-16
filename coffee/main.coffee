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

    # StyleSwitch.toggle()

    # $('show_about').click()

    o1= new Oscillator
        title: 'high'
        minFreq: 2000
        x: 10
        y: 40

    o2= new Oscillator
        title: 'mid'
        minFreq: 400
        maxFreq: 2000
        freq:    400
        x: 10
        y: 240

    o3= new Oscillator
        title: 'low'
        maxFreq: 400
        freq:    200
        x: 10
        y: 440

    g1= new Gain
        gain: 0.1
        x: 100
        y: 142

    g2= new Gain
        gain: 0.2
        x: 100
        y: 342

    g3= new Gain
        gain: 0.3
        x: 100
        y: 542

    an= new Analyser
        width: 500
        height: 300
        x: 400
        y: 42

    gm= new Gain
        master: true
        gain: 0.01
        x: 400
        y: 544

    new Connection
        source: o1.connector 'audio:out'
        target: g1.connector 'audio:in'
    new Connection
        source: o2.connector 'audio:out'
        target: g2.connector 'audio:in'
    new Connection
        source: o3.connector 'audio:out'
        target: g3.connector 'audio:in'
    new Connection
        source: g1.connector 'audio:out'
        target: an.connector 'audio:in'
    new Connection
        source: g2.connector 'audio:out'
        target: an.connector 'audio:in'
    new Connection
        source: g3.connector 'audio:out'
        target: an.connector 'audio:in'
    new Connection
        source: an.connector 'audio:out'
        target: gm.connector 'audio:in'

    return
