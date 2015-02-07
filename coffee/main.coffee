
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    wid = knix.init()

    c = Console.create()
    c.shade()

    # _________________________________________________________________________ layout test

    knix.get
        title:     'layout'
        hasSize:   true
        minWidth:  200
        minHeight: 90
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
                children: \
                [
                    type:       'connector'
                    style:
                        display: 'table-cell'
                ,
                    id:         'slider'
                    type:       'slider'
                    style:
                        display:  'table-cell'
                        width:    '100%'
                ,
                    id:         'value'
                    type:       'value'
                    format:     "%3.0f"
                    style:
                        display:  'table-cell'
                        minWidth: '80px'
                ,
                    type:       'connector'
                    style:
                        display:  'table-cell'
                ]
            ]
        ,
            type:       'button'
            text:       '<i class="fa fa-cog fa-spin"></i> ok'
            style:
                clear:  'both'
            onClick:    -> @getWindow().close()
            connect: \
            [
                signal: 'slider:onValue'
                slot:   'value:setValue'
            ,
                signal: 'value:onValue'
                slot:   'slider:setValue'
            ]
        ]

    # _________________________________________________________________________ raise

    c.raise()

    # _________________________________________________________________________ widget test

    # Test.stageButtons()
    # Test.sliderHello()
    # Test.sliderAndValue()

    return
