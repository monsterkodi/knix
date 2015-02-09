
class Test

    @connectorBox: ->

        knix.get

            title:     'connector'
            hasSize:   true
            minWidth:  200
            minHeight: 150
            x:         100
            y:         100
            children: \
            [
                type: 'hbox'
                children: \
                [
                    type:       'connector'
                    class:      'slot'
                ,
                    id:         'slider'
                    type:       'slider'
                    value:      50
                    style:
                        width:  '100%'
                ,
                    id:         'value'
                    type:       'value'
                    format:     "%3.0f"
                    value:      50
                    style:
                        minWidth: '80px'
                ,
                    type:       'connector'
                    class:      'signal'
                ]
            ,
                type: 'hbox'
                children: \
                [
                    type:       'connector'
                    class:      'slot'
                ,
                    id:         'slider2'
                    type:       'slider'
                    value:      50
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    class:      'signal'
                ]
            ,
                type: 'hbox'
                children: \
                [
                    type:       'connector'
                    class:      'slot'
                ,
                    id:         'slider3'
                    type:       'slider'
                    value:      50
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    class:      'signal'
                ]
            ,
                type:       'button'
                text:       '<i class="fa fa-cog fa-spin"></i> ok'
                style:
                    clear:  'both'
                onClick:    -> @getWindow().close()
            ]
            connect: \
            [
                signal: 'slider:onValue'
                slot:   'value:setValue'
            ,
                signal: 'value:onValue'
                slot:   'slider:setValue'
            ]

    @connectors: ->

        b = knix.get
            type:   'button'
            text:   'connectors'
            parent: 'menu'
            onClick: ->

                a = Test.connectorBox()
                b = Test.connectorBox().setPos pos(200,400)
                c = Test.connectorBox().setPos pos(200,600)
                d = Test.connectorBox().setPos pos(400,200)

    # _________________________________________________________________________ svg path test

    @svgPath: ->

        pth = knix.get
            type:  'path'

        start = knix.get
            x: pth.config.start[0]
            y: pth.config.start[1]
            type: 'button'
            path: pth

        end = knix.get
            x: pth.config.end[0]
            y: pth.config.end[1]
            type: 'button'
            path: pth

        startHead = knix.get
            x: pth.config.startHead[0]
            y: pth.config.startHead[1]
            type: 'button'
            path: pth
            style:
                backgroundColor: '#ff0'

        endHead = knix.get
            x: pth.config.endHead[0]
            y: pth.config.endHead[1]
            type: 'button'
            path: pth
            style:
                backgroundColor: '#f00'

        Drag.create
            target: start.elem
            onMove: (drag, event) ->
                p = drag.absPos(event)
                pth.setStart [p.x, p.y]

        Drag.create
            target: startHead.elem
            onMove: (drag, event) ->
                p = drag.absPos(event)
                pth.setStartHead [p.x, p.y]

        Drag.create
            target: end.elem
            onMove: (drag, event) ->
                p = drag.absPos(event)
                pth.setEnd [p.x, p.y]

        Drag.create
            target: endHead.elem
            onMove: (drag, event) ->
                p = drag.absPos(event)
                pth.setEndHead [p.x, p.y]

    @sliderHello: ->

        b = knix.get
            type:   'button'
            text:   'slider hello'
            parent: 'menu'
            onClick: ->
                w = knix.get
                    title:     'hello'
                    hasSize:   true
                    minWidth:  130
                    center:    true
                    children: \
                    [
                        type:       'slider'
                        hasBar:     true
                        hasKnob:    true
                        valueStep:  5
                    ,
                        type:       'value'
                        format:     "%3.2f"
                        valueStep:  21
                    ,
                        type:       'button'
                        text:       'ok'
                        onClick:    -> @getWindow().close()
                    ]
                    connect: \
                    [
                        signal: 'slider:onValue'
                        slot:   'value:setValue'
                    ]

                w.resolveSlot('slider:setValue') 33.3

        b.elem.click()

    @sliderAndValue: ->

        b = knix.get
            type:   'button'
            text:   'slider & value'
            parent: 'menu'
            onClick: ->
                knix.get
                    y:         30
                    title:     'slider & value'
                    hasSize:   true
                    width:     150
                    minWidth:  150
                    minHeight: 150
                    maxHeight: 150
                    children: \
                    [
                        id:         'slider_1'
                        type:       'slider'
                        value:      50.0
                        # valueStep:  10
                    ,
                        id:         'slider_2'
                        type:       'slider'
                        hasKnob:    true
                        hasBar:     true
                        value:      70.0
                    ,
                        id:         'value'
                        type:       'value'
                        value:      50
                        format:     "%3.2f"
                    ,
                        type:       'relative'
                        child:
                            type:       'button'
                            text:       'ok'
                            class:      'top-right'
                            onClick:    -> @getWindow().close()
                    ]
                    connect: \
                    [
                        signal: 'slider_2:onValue'
                        slot:   'value:setValue'
                    ,
                        signal: 'value:onValue'
                        slot:   'slider_1:setValue'
                    ]

        b.elem.click()

    @stageButtons: () ->

        knix.get
            id:         'slider_3'
            type:       'slider'
            hasKnob:    false
            hasBar:     false
            parent:     'stage_content'
            width:      200
            x:          150
            y:          30
            maxValue:   255
            connect: \
            [
                signal: 'onValue'
                slot:   (v) ->
                    v = @slotArg(v)
                    c = 'rgba(%d,0,0,0.2)'.fmt(v)
                    # sc = $('stage_canvas').fc
                    # sc.setBackgroundColor(c, sc.renderAll.bind(sc))
            ]

        knix.get
            parent:     'stage_content'
            type:       'slider'
            hasKnob:    true
            hasBar:     true
            width:      200
            x:          150
            y:          60

        knix.get
            parent:     'stage_content'
            type:       'slider'
            hasKnob:    true
            hasBar:     false
            width:      200
            x:          150
            y:          90

        knix.get
            parent:     'stage_content'
            type:       'value'
            width:      200
            x:          150
            y:          120

        knix.get
            parent:     'stage_content'
            type:       'button'
            text:       'del'
            width:      200
            x:          150
            y:          150
            onClick:    knix.closeAll

    # _________________________________________________________________________ canvas test
    #
    # sc = knix.get
    #     id:      'stage_canvas'
    #     type:    'canvas'
    #     width:   parseInt window.innerWidth
    #     height:  parseInt window.innerHeight
    #
    # p = new fabric.Path('M 0 0 L 200 100 L 170 200')
    # p.set
    #     left: 20, top: 120, fill: '',
    #     stroke: 'black', strokeWidth: 20, strokeLineCap: 'round', strokeLineJoin: 'round'
    #     opacity: 0.5
    # sc.fc.add(p)
    #
    # resizeStageCanvas = (x,y) -> sc.fc.setWidth x; sc.fc.setHeight y
    #
    # window.onresize = (event) ->
    #     resizeStageCanvas parseInt(window.innerWidth), parseInt(window.innerHeight)

    # Console.create()
