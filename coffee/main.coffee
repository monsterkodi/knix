
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    wid = knix.init()

    c = Console.create()
    # c.shade()

    # _________________________________________________________________________ layout test

    knix.get
        title:     'layout'
        hasSize:   true
        minWidth:  180
        center:    true
        children: \
        [
            type: 'table'
            style:
                display: 'table'
            children: \
            [
                type: 'horizontal-layout'
                style:
                    display: 'table-row'
                    width:   '100%'
                    # backgroundColor: '#ff0'
                children: \
                [
                    type:       'connector'
                    style:
                        display: 'table-cell'
                ,
                    id:         'slider'
                    type:       'slider'
                    valueStep:  5
                    style:
                        display:  'table-cell'
                        width:    '100%'
                ,
                    type:       'value'
                    format:     "%3.2f"
                    valueStep:  21
                    style:
                        display:  'table-cell'
                        minWidth: '80px'
                    # connect: \
                    # [
                    #     signal: 'slider:onValue'
                    #     slot:   'setValue'
                    # ]
                ,
                    type:       'connector'
                    style:
                        display:  'table-cell'
                ]
            ]
        ,
            elem: 'i'
            class: "fa fa-cog fa-spin"
        ,
            type:       'button'
            text:       'ok'
            style:
                clear:  'both'
            onClick:    -> @getWindow().close()
        ]

    # _________________________________________________________________________ raise

    c.raise()

    # _________________________________________________________________________ widget test

    # Test.stageButtons()
    # Test.sliderHello()
    # Test.sliderAndValue()

    return
