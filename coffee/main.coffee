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

    new Oscillator
            x: 100
            y: 100

    new Oscillator
            x: 100
            y: 300
            freq: 2000

    # new Gain
    #         x: 300
    #         y: 102

    new Gain
            master: true
            x: 500
            y: 104
    return
