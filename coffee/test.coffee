
class Test

    @sliderHello: ->

        b = knix.get
            type:   'button'
            text:   'slider hello'
            parent: 'menu'
            onClick: ->
                knix.get
                    title:     'hello'
                    hasSize:   true
                    minWidth:  130
                    center:    true
                    children: \
                    [
                        id:         'slider'
                        type:       'slider'
                        hasBar:     true
                        hasKnob:    true
                        valueStep:  5
                    ,
                        type:       'value'
                        format:     "%3.2f"
                        valueStep:  21
                        connect: \
                        [
                            signal: 'slider:onValue'
                            slot:   'setValue'
                        ]
                    ,
                        type:       'button'
                        text:       'ok'
                        onClick:    -> @getWindow().close()
                    ]

                $('slider').setValue 33.3

        b.click()

    @sliderAndValue: ->

        b = knix.get
            type:   'button'
            text:   'slider & value'
            parent: 'menu'
            onClick: ->
                knix.get
                    y:         30
                    title:     'hello'
                    hasSize:   true
                    width:     130
                    minWidth:  130
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
                        valueStep:  1
                        format:     "%3.2f"
                        connect: \
                        [
                            signal: 'slider_2:onValue'
                            slot:   'setValue'
                        ,
                            signal: 'onValue'
                            slot:   'slider_1:setValue'
                        ]
                    ,
                        type:       'relative'
                        child:
                            type:       'button'
                            text:       'ok'
                            class:      'top-right'
                            onClick:    -> @getWindow().close()
                    ]

        b.click()

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
            valueMin:   0
            valueMax:   255
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
    # sc = wid.get
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
