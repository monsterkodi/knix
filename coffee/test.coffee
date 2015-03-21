###

000000000  00000000   0000000  000000000
   000     000       000          000   
   000     0000000   0000000      000   
   000     000            000     000   
   000     00000000  0000000      000   

###

class Test

    ###
     0000000  000   000  000   000  000000000  000   000
    000        000 000   0000  000     000     000   000
    0000000     00000    000 0 000     000     000000000
         000     000     000  0000     000     000   000
    0000000      000     000   000     000     000   000
    ###

    @synth: -> 
        k1 = new Keyboard
            x : 20
            y : 50
            octave: 4

        k2 = new Keyboard
            x : 20
            y : 430
            octave: 4

        l1 = new Timeline
            x      : 360
            y      : 50
            steps  : 16 
            height : 350

        l2 = new Timeline
            x      : 360
            y      : 430
            steps  : 16 
            height : 350

        s1 = new Synth
            noteName     : 'C4'
            x            : 800
            y            : 50
            instrument   : 'guitar'
            duration     : 1.0

        s2 = new Synth
            noteName     : 'C6'
            x            : 800
            y            : 430
            instrument   : 'bell'
            duration     : 0.08

        m = new Gain
            master : true
            gain   : 0.5
            x      : 1200
            y      : 50
        
        new Connection
            source   : k1.connector 'note'
            target   : l1.connector 'noteIn'

        new Connection
            source   : l1.connector 'noteOut'
            target   : s1.connector 'note'

        new Connection
            source   : s1.connector 'audio:out'
            target   : m.connector 'audio:in'

        new Connection
            source   : k2.connector 'note'
            target   : l2.connector 'noteIn'

        new Connection
            source   : l2.connector 'noteOut'
            target   : s2.connector 'note'

        new Connection
            source   : s2.connector 'audio:out'
            target   : m.connector 'audio:in'

    ###
    000000000  000  00     00  00000000  000      000  000   000  00000000
       000     000  000   000  000       000      000  0000  000  000     
       000     000  000000000  0000000   000      000  000 0 000  0000000 
       000     000  000 0 000  000       000      000  000  0000  000     
       000     000  000   000  00000000  0000000  000  000   000  00000000
    ###
    
    @timeline: -> 
        k1 = new Keyboard
            x : 20
            y : 50
            octave: 4

        k2 = new Keyboard
            x : 20
            y : 430
            octave: 5

        k3 = new Keyboard
            x : 20
            y : 650
            octave: 6
        
        a = new ADSR
            noteName     : 'C6'
            x            : 400
            y            : 50
            duration     : 0.5
            sustainIndex : 8
            vals         : [pos(0,0), pos(.1,1), pos(.2,0), pos(.3,.8), pos(.4,0), pos(.5,.6), pos(.6,.0), pos(.7,.4) , pos(1,0)] 

        m = new Gain
            master : true
            gain   : 0.5
            x      : 800
            y      : 50

        t = new Timeline
            x      : 400
            y      : 430
            height : 500
        
        new Connection
            source   : k1.connector 'note'
            target   : t.connector 'noteIn'

        new Connection
            source   : k2.connector 'note'
            target   : t.connector 'noteIn'

        new Connection
            source   : k3.connector 'note'
            target   : t.connector 'noteIn'

        new Connection
            source   : t.connector 'noteOut'
            target   : a.connector 'note'

        new Connection
            source   : a.connector 'audio:out'
            target   : m.connector 'audio:in'

    ###
    00000000  000   000  000   000  00000000  000       0000000   00000000   00000000
    000       0000  000  000   000  000       000      000   000  000   000  000     
    0000000   000 0 000   000 000   0000000   000      000   000  00000000   0000000 
    000       000  0000     000     000       000      000   000  000        000     
    00000000  000   000      0      00000000  0000000   0000000   000        00000000
    ###

    @envelope: -> 
        
        t = new Ramp
            x        : 200
            y        : 250
            duration : .1
        
        e = new Envelope
            center   : true 
            vals     : [pos(0,0), pos(0.15,0.75), pos(0.5,1), pos(0.75,0.25), pos(1,0)]

        r = new Range
            x        : 200
            y        : 50
            low      : 0
            high     : 100

        o = new Oscillator
            frequency    : 200
            maxFrequency : 2000
            x            : 500
            y            : 50

        m = new Gain
            master   : true
            x        : 500
            y        : 300

        new Connection
            source   : t.connector 'ramp:onValue'
            target   : e.connector 'envelope_in:setValue'

        new Connection
            source   : e.connector 'envelope:onValue'
            target   : m.connector 'gain:setValue'

        new Connection
            source   : e.connector 'envelope:onValue'
            target   : r.connector 'range_in:setValue'

        new Connection
            source   : r.connector 'range_out:onValue'
            target   : o.connector 'frequency:setValue'

        new Connection
            source   : o.connector 'audio:out'
            target   : m.connector 'audio:in'

    ###
    0000000    00000000  000       0000000   000   000
    000   000  000       000      000   000   000 000 
    000   000  0000000   000      000000000    00000  
    000   000  000       000      000   000     000   
    0000000    00000000  0000000  000   000     000   
    ###
    
    @delay: ->
        
        o1 = new Oscillator
            title        : 'low'
            minFrequency : 1
            maxFrequency : 1000
            frequency    : 333
            shape        : 'sine'
            x            : 20
            y            : 50

        g1 = new Gain
            gain     : 0.5
            x        : 20
            y        : 200

        a1 = new Analyser
            x        : 300
            y        : 42

        a2 = new Analyser
            x        : 300
            y        : 350

        d1 = new Delay
            x        : 830
            y        : 42
            delay    : 5
            maxDelay : 10

        g2 = new Gain
            gain     : 0.5
            x        : 830
            y        : 200

        gm = new Gain
            master   : true
            gain     : 0.0
            x        : 300
            y        : 650

        new Connection
            source : o1.connector 'audio:out'
            target : g1.connector 'audio:in'
        new Connection
            source : g1.connector 'audio:out'
            target : a1.connector 'audio:in'
        new Connection
            source : a1.connector 'audio:out'
            target : d1.connector 'audio:in'
        new Connection
            source : a1.connector 'audio:out'
            target : g2.connector 'audio:in'
        new Connection
            source : d1.connector 'audio:out'
            target : g2.connector 'audio:in'
        new Connection
            source : g2.connector 'audio:out'
            target : a2.connector 'audio:in'
        new Connection
            source : a2.connector 'audio:out'
            target : gm.connector 'audio:in'

        return
    
    ###
     0000000    0000000   0000000  000  000      000       0000000   000000000   0000000   00000000 
    000   000  000       000       000  000      000      000   000     000     000   000  000   000
    000   000  0000000   000       000  000      000      000000000     000     000   000  0000000  
    000   000       000  000       000  000      000      000   000     000     000   000  000   000
     0000000   0000000    0000000  000  0000000  0000000  000   000     000      0000000   000   000
    ###
        
    @oscillator: ->
        
        o1= new Oscillator
            title        : 'high'
            minFrequency : 2000
            maxFrequency : 12000
            frequency    : 3000
            x            : 10
            y            : 40

        o2= new Oscillator
            title        : 'mid'
            minFrequency : 400
            maxFrequency : 2000
            frequency    : 400
            x            : 10
            y            : 240

        o3= new Oscillator
            title        : 'low'
            minFrequency : 0
            maxFrequency : 400
            frequency    : 333
            shape        : 'square'
            x            : 10
            y            : 440

        g1= new Gain
            gain    : 0.1
            x       : 400
            y       : 40

        g2= new Gain
            gain    : 0.2
            x       : 400
            y       : 240

        g3= new Gain
            gain    : 0.3
            x       : 400
            y       : 440

        an= new Analyser
            x       : 800
            y       : 42

        f4= new Filter
            x       : 1200
            y       : 42

        a4= new Analyser
            x       : 800
            y       : 400

        gm= new Gain
            master  : true
            gain    : 0.0
            x       : 1200
            y       : 400

        new Connection
            source : o1.connector 'audio:out'
            target : g1.connector 'audio:in'
        new Connection
            source : o2.connector 'audio:out'
            target : g2.connector 'audio:in'
        new Connection
            source : o3.connector 'audio:out'
            target : g3.connector 'audio:in'
        new Connection
            source : g1.connector 'audio:out'
            target : an.connector 'audio:in'
        new Connection
            source : g2.connector 'audio:out'
            target : an.connector 'audio:in'
        new Connection
            source : g3.connector 'audio:out'
            target : an.connector 'audio:in'
        new Connection
            source : an.connector 'audio:out'
            target : f4.connector 'audio:in'
        new Connection
            source : f4.connector 'audio:out'
            target : a4.connector 'audio:in'
        new Connection
            source : a4.connector 'audio:out'
            target : gm.connector 'audio:in'

        return
        
    ###
     0000000   000   000  0000000    000   0000000 
    000   000  000   000  000   000  000  000   000
    000000000  000   000  000   000  000  000   000
    000   000  000   000  000   000  000  000   000
    000   000   0000000   0000000    000   0000000 
    ###
        
    @audio: ->

        a = knix.get
            type    : 'button'
            text    : 'oscillator'
            parent  : 'menu'
            action  : -> Test.oscillator()

        b = knix.get
            type    : 'button'
            text    : 'delay'
            parent  : 'menu'
            action  : -> Test.delay()

        c = knix.get
            type    : 'button'
            text    : 'envelope'
            parent  : 'menu'
            action  : -> Test.envelope()

        d = knix.get
            type    : 'button'
            text    : 'timeline'
            parent  : 'menu'
            action  : -> Test.timeline()

        e = knix.get
            type    : 'button'
            text    : 'synth'
            parent  : 'menu'
            action  : -> Test.synth()

        # Test.synth()

    ###

         0000000  0000000   000   000  000   000  00000000  0000000 000000000  0000000   00000000
        000      000   000  0000  000  0000  000  000      000         000    000   000  000   000
        000      000   000  000 0 000  000 0 000  000000   000         000    000   000  0000000
        000      000   000  000  0000  000  0000  000      000         000    000   000  000   000
         0000000  0000000   000   000  000   000  00000000  0000000    000     0000000   000   000

    ###

    @connectorBox: ->

        knix.get

            title    : 'connector'
            resize   : 'horizontal'
            x        : 100
            y        : 100
            children : \
            [
                type             : 'hbox'
                children         : \
                [
                    type         : 'connector'
                    slot         : 'slider:setValue'
                ,
                    id           : 'slider'
                    type         : 'slider'
                    value        : 50
                    style        :
                        width    : '100%'
                ,
                    id           : 'value'
                    type         : 'value'
                    format       : "%3.0f"
                    value        : 50
                    style        :
                        minWidth : '80px'
                ,
                    type         : 'connector'
                    signal       : 'value:onValue'
                ]
            ,
                type          : 'hbox'
                children      : \
                [
                    type      : 'connector'
                    slot      : 'slider2:setValue'
                ,
                    id        : 'slider2'
                    type      : 'slider'
                    value     : 50
                    style     :
                        width : '50%'
                ,
                    id        : 'slider3'
                    type      : 'slider'
                    value     : 0
                    minValue  : 20
                    maxValue  : 80
                    valueStep : 10
                    style     :
                        width : '50%'
                ,
                    type      : 'connector'
                    signal    : 'slider3:onValue'
                ]
            ,
                type          : 'hbox'
                children      : \
                [
                    type      : 'connector'
                    slot      : 'slider4:setValue'
                ,
                    id        : 'slider4'
                    type      : 'slider'
                    value     : 50
                    valueStep : 20
                    style     :
                        width : '100%'
                ,
                    type      : 'connector'
                    signal    : 'slider4:onValue'
                ]
            ,
                type      : 'button'
                text      : '<i class="fa fa-cog fa-spin"></i> ok'
                style     :
                    clear : 'both'
                action    : (event, e) -> e.getWidget().getWindow().close()
            ]
            connect: \
            [
                signal : 'slider:onValue'
                slot   : 'value:setValue'
            ,
                signal : 'value:onValue'
                slot   : 'slider:setValue'
            ,
                signal : 'slider2:onValue'
                slot   : 'slider3:setValue'
            ,
                signal : 'slider3:onValue'
                slot   : 'slider2:setValue'
            ]

    @connectors: ->

        b = knix.get
            type    : 'button'
            text    : 'connectors'
            parent  : 'menu'
            action  : ->

                a = Test.connectorBox()
                b = Test.connectorBox().setPos pos(200,400)
                c = Test.connectorBox().setPos pos(200,600)
                d = Test.connectorBox().setPos pos(400,200)

                new Connection
                    source: a.connector 'value:onValue'
                    target: b.connector 'slider2:setValue'

        b.elem.click()

    ###

        00000000    0000000   000000000  000   000
        000   000  000   000     000     000   000
        00000000   000000000     000     000000000
        000        000   000     000     000   000
        000        000   000     000     000   000

    ###

    @svgPath: ->

        pth = knix.get
            type : 'path'

        start = knix.get
            x    : pth.config.start[0]
            y    : pth.config.start[1]
            type : 'button'
            path : pth

        end = knix.get
            x    : pth.config.end[0]
            y    : pth.config.end[1]
            type : 'button'
            path : pth

        startHead = knix.get
            x     : pth.config.startHead[0]
            y     : pth.config.startHead[1]
            type  : 'button'
            path  : pth
            style :
                backgroundColor: '#ff0'

        endHead = knix.get
            x     : pth.config.endHead[0]
            y     : pth.config.endHead[1]
            type  : 'button'
            path  : pth
            style :
                backgroundColor: '#f00'

        new Drag
            target : start.elem
            onMove : (drag, event) ->
                p = drag.absPos(event)
                pth.setStart [p.x, p.y]

        new Drag
            target : startHead.elem
            onMove : (drag, event) ->
                p = drag.absPos(event)
                pth.setStartHead [p.x, p.y]

        new Drag
            target : end.elem
            onMove : (drag, event) ->
                p = drag.absPos(event)
                pth.setEnd [p.x, p.y]

        new Drag
            target : endHead.elem
            onMove : (drag, event) ->
                p = drag.absPos(event)
                pth.setEndHead [p.x, p.y]

    ###

         000   000  00000000  000      000       0000000      0000000   000      000  0000000    00000000  00000000
         000   000  000       000      000      000   000    000        000      000  000   000  000       000   000
         000000000  0000000   000      000      000   000     0000000   000      000  000   000  0000000   0000000
         000   000  000       000      000      000   000          000  000      000  000   000  000       000   000
         000   000  00000000  0000000  0000000   0000000      0000000   0000000  000  0000000    00000000  000   000

    ###

    @helloSlider: ->

        b = knix.get
            type    : 'button'
            text    : 'hello slider'
            parent  : 'menu'
            action  : ->
                w = knix.get
                    title    : 'hello'
                    resize   : true
                    minWidth : 130
                    center   : true
                    children : \
                    [
                        type      : 'slider'
                        hasBar    : true
                        hasKnob   : true
                        valueStep : 5
                    ,
                        type      : 'value'
                        format    : "%3.2f"
                        valueStep : 21
                    ,
                        type      : 'button'
                        text      : 'ok'
                        action    : (event, e) -> e.getWidget().getWindow().close()
                    ]
                    connect   : \
                    [
                        signal : 'slider :onValue'
                        slot   : 'value  :setValue'
                    ]

                w.resolveSlot('slider:setValue') 33.3

        # b.elem.click()

    ###

      0000000   000      000  0000000    00000000  00000000       000   000   0000000   000     000   000  00000000
     000        000      000  000   000  000       000   000      000   000  000   000  000     000   000  000
      0000000   000      000  000   000  0000000   0000000         000 000   000000000  000     000   000  0000000
           000  000      000  000   000  000       000   000         000     000   000  000     000   000  000
      0000000   0000000  000  0000000    00000000  000   000          0      000   000  0000000  0000000   00000000

    ###

    @sliderAndValue: ->

        b = knix.get
            type    : 'button'
            text    : 'slider & value'
            parent  : 'menu'
            action  : ->
                knix.get
                    y        : 30
                    minWidth : 200
                    title    : 'slider & value'
                    resize   : 'horizontal'
                    children : \
                    [
                        id      : 'slider_1'
                        type    : 'slider'
                        value   : 50.0
                    ,
                        id      : 'slider_2'
                        type    : 'slider'
                        hasKnob : true
                        hasBar  : true
                        value   : 70.0
                    ,
                        id      : 'value'
                        type    : 'value'
                        value   : 50
                        format  : "%3.2f"
                    ,
                        type    : 'button'
                        text    : 'ok'
                        action  : (event, e) -> e.getWidget().getWindow().close()
                    ]
                    connect: \
                    [
                        signal : 'slider_2 :onValue'
                        slot   : 'value    :setValue'
                    ,
                        signal : 'value    :onValue'
                        slot   : 'slider_1 :setValue'
                    ]

        # b.elem.click()

    ###

         0000000  000000000  0000000    0000000   00000000
        000          000    000   000  000        000
         0000000     000    000000000  000  0000  0000000
              000    000    000   000  000   000  000
         0000000     000    000   000   0000000   00000000

    ###

    @stageButtons: () ->

        knix.get
            id       : 'slider_3'
            type     : 'slider'
            hasKnob  : false
            hasBar   : false
            parent   : 'stage_content'
            width    : 200
            x        : 150
            y        : 30
            maxValue : 255
            connect  : \
            [
                signal : 'onValue'
                slot   : ->
                    v = _.value()
                    c = 'rgba(%d,0,0,0.2)'.fmt(v)
            ]

        knix.get
            parent  : 'stage_content'
            type    : 'slider'
            hasKnob : true
            hasBar  : true
            width   : 200
            x       : 150
            y       : 60

        knix.get
            parent  : 'stage_content'
            type    : 'slider'
            hasKnob : true
            hasBar  : false
            width   : 200
            x       : 150
            y       : 90

        knix.get
            parent  : 'stage_content'
            type    : 'value'
            width   : 200
            x       : 150
            y       : 120

        knix.get
            parent  : 'stage_content'
            type    : 'button'
            text    : 'del'
            width   : 200
            x       : 150
            y       : 150
            action  : knix.closeAll
