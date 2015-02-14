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

    Test.connectors()
    # Test.stageButtons()
    Test.helloSlider()
    Test.sliderAndValue()
    # Test.svgPath()

    # StyleSwitch.toggle()

    # $('show_about').click()

    return
