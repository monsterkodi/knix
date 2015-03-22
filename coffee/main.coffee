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
        console:  true
        # loadLast: true
        # console: 'shade'

    # _________________________________________________________________________ widget test

    # Test.connectors()
    # Test.stageButtons()
    # Test.helloSlider()
    # Test.sliderAndValue()
    # Test.svgPath()
    Test.audio()
    # StyleSwitch.toggle()
    # $('show_about').click()
    
    Settings.set 'tooltips', true
    
    Test.synth()
    
    # s1 = new Synth
    #     noteName     : 'C7'
    #     x            : 10
    #     y            : 50
    #     width        : 1500
    #     instrument   : 'test1'
    #     duration     : 0.01
    # 
    # s2 = new Synth
    #     noteName     : 'C7'
    #     x            : 10
    #     y            : 430
    #     width        : 1500
    #     instrument   : 'test2'
    #     duration     : 0.01
