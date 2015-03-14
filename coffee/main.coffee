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
    # Test.audio()
    # StyleSwitch.toggle()
    # $('show_about').click()
    
    Settings.set 'tooltips', true

    keyboard = () -> 
        k = new Keyboard
            x : 20
            y : 50
        
        a = new ADSR
            x            : 400
            y            : 50
            duration     : 1.0
            # numHandles   : 4
            sustainIndex : 2
            vals         : [pos(0,0), pos(.1,1), pos(1,0), pos(1,0)] 
            # shape : 'square'

        m = new Gain
            master : true
            gain   : 0.2
            x      : 800
            y      : 50

        t = new Timeline
            x : 10
            y : 430
        
        new Connection
            source   : k.connector 'note'
            target   : t.connector 'noteIn'

        new Connection
            source   : t.connector 'noteOut'
            target   : a.connector 'note'

        new Connection
            source   : a.connector 'audio:out'
            target   : m.connector 'audio:in'

    keyboard()
