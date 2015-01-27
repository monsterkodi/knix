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
                type:       'scroll'
                width: 100
                valueMin:   20.0
                valueMax:   60.0
                rangeMin:   0.0
                rangeMax:   100.0
            ,
                type:       'slider'
                width: 100
                hasKnob: true
                hasBar: true
                value:      70.0
                rangeMin:   0.0
                rangeMax:   100.0
            ,
                type:       'value'
                value:      600.0
                rangeMin:   4
                rangeMax:   10
                step:       1
            ,
                type:       'button'
                text:       'ok'
                style:      'button a static-left'
                onClick:    (event, element) -> @getParent().getChild('b').close()
            ,
                type:       'button'
                text:       'no'
                style:      'button b static-right'
                onClick:    (event, element) -> @getParent().close()
            ]

            document.stageButtons()

    @stageButtons = () ->

        wid.get
            type:       'scroll'
            parent:     'stage_content'
            width:      200
            x:          150
            y:          30

        wid.get
            type:       'slider'
            parent:     'stage_content'
            hasKnob:    true
            hasBar:     true
            width:      200
            x:          150
            y:          60

        wid.get
            type:       'value'
            parent:     'stage_content'
            width:      200
            x:          150
            y:          90

    $('add_b').click()

    return
