log = require './log.coffee'
wid = require './wid.coffee'
stg = require './stage.coffee'

document.observe "dom:loaded", ->

    $$(".menu").each (menu) -> $(menu.id).raise()

    wid.get
        type:   'button'
        text:   'add'
        parent: 'menu'
        onClick: ->
            ssz = stg.size()
            wid.get
                width:    300
                height:   200
                title:    'widget'
                x:        Math.random() * parseInt ssz.width - 300
                y:        Math.random() * parseInt ssz.height - 200

    wid.get
        type:   'button'
        id:     'hello'
        text:   'hello'
        parent: 'menu'
        onClick: ->
            wid.get
                type:      'widget'
                y:         30
                title:     'hello'
                hasSize:   true
                width:     130
                minWidth:  120
                minHeight: 150
                maxHeight: 150
                children: \
                [
                    id:         'slider_1'
                    type:       'slider'
                    value:      50.0
                    valueStep:  10
                ,
                    id:         'slider_2'
                    type:       'slider'
                    hasKnob:    true
                    hasBar:     true
                    value:      70.0
                    valueMin:   0.0
                    valueMax:   100.0
                    valueStep:  1
                ,
                    type:       'value'
                    value:      50
                    valueMin:   -20
                    valueMax:   80
                    # valueStep:  0.2
                    format:     "%3.2f"
                    connect: \
                    [
                        signal: 'slider_2:onValue'
                        slot:   'setValue'
                    ,
                        signal: 'onValue'
                        slot:   'slider_1:setValue'
                    # ,
                    #     signal: 'slider_1:onValue'
                    #     slot:   (event) ->
                    #         log "---", event.detail.value
                    ]
                ,
                    type:       'relative'
                    children:   \
                    [
                        type:       'button'
                        text:       'ok'
                        class:      'top-left'
                        onClick:    -> @getWidget().getChild('no').close()
                    ,
                        type:       'button'
                        id:         'no'
                        text:       'no'
                        class:      'top-right'
                        onClick:    -> @getWidget().close()
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

        wid.get
            type:       'button'
            text:       'del'
            width:      200
            x:          150
            y:          150
            onClick:    wid.closeAll

    wid.get
        type:   'button'
        text:   'del'
        parent: 'footer'
        onClick: -> wid.closeAll()

    $('hello').click()

    return
