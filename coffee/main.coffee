
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    wid = knix.init()

    c = new Console()
    # c.shade()

    # _________________________________________________________________________ layout test

    knix.get
        title:     'layout'
        hasSize:   true
        minWidth:  200
        minHeight: 90
        # center:    true
        x: 100
        y: 100
        children: \
        [
            type: 'hbox'
            children: \
            [
                type:       'connector'
            ,
                id:         'slider'
                type:       'slider'
                value:      50
                style:
                    width:    '100%'
            ,
                id:         'value'
                type:       'value'
                format:     "%3.0f"
                value:      50
                style:
                    minWidth: '80px'
            ,
                type:       'connector'
            ]
        ,
            type: 'hbox'
            children: \
            [
                type:       'connector'
            ,
                id:         'slider2'
                type:       'slider'
                value:      50
                style:
                    width:    '100%'
            ,
                type:       'connector'
            ]
        ,
            type: 'hbox'
            children: \
            [
                type:       'connector'
            ,
                id:         'slider3'
                type:       'slider'
                value:      50
                style:
                    width:    '100%'
            ,
                type:       'connector'
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


    # _________________________________________________________________________ raise

    c.raise()

    # _________________________________________________________________________ widget test

    # Test.stageButtons()
    # Test.sliderHello()
    # Test.sliderAndValue()
    # Test.svgPath()

    return
