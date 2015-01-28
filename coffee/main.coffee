log = require './log.coffee'
wid = require './widget.coffee'
stg = require './stage.coffee'

document.observe "dom:loaded", ->

    #log (x + y for x in [1, 2] for y in [7, 8])

    $$(".menu").each (menu) -> $(menu.id).raise()

    $('del').observe 'click', (e) -> wid.closeAll()

    $('add_a').on 'click', () ->
        ssz = stg.size()
        wid.get
            width:    300
            height:   200
            title:    'widget'
            x:        Math.random() * parseInt ssz.width - 300
            y:        Math.random() * parseInt ssz.height - 200

    $('add_b').on 'click', () ->
        wid.get
            type:     'widget'
            y:        30
            title:    'hello'
            hasSize:  true
            children: \
            [
                type:       'slider'
                value:      40.0
                valueMin:   20.0
                valueMax:   60.0
                valueStep:  10
            ,
                type:       'slider'
                hasKnob:    true
                hasBar:     true
                value:      70.0
                valueMin:   0.0
                valueMax:   100.0
                valueStep:  1
            ,
                type:       'value'
                value:      666.0
                valueMin:   4
                valueMax:   10
                valueStep:  0.1
            ,
                type:       'relative'
                minWidth:   '60px'
                children:   \
                [
                    type:       'button'
                    text:       'ok'
                    style:      'button a'
                    onClick:    (event, element) -> @getParent().getChild('b').close()
                ,
                    type:       'button'
                    text:       'no'
                    style:      'button top-right'
                    onClick:    (event, element) -> @getParent().close()
                ]
            ]

            document.stageButtons()

    @stageButtons = () ->

        wid.get
            type:       'slider'
            hasKnob:    false
            hasBar:     false
            width:      200
            x:          150
            y:          30

        wid.get
            type:       'slider'
            hasKnob:    true
            hasBar:     true
            width:      200
            x:          150
            y:          60

        wid.get
            type:       'slider'
            hasKnob:    true
            hasBar:     false
            width:      200
            x:          150
            y:          90

        wid.get
            type:       'value'
            width:      200
            x:          150
            y:          120

    $('add_b').click()

    return
