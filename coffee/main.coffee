
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    wid = knix.init()

    c = Console.create()
    c.shade()

    # _________________________________________________________________________ svg test

    svg = wid.get
        id:    'stage_svg'
        type:  'svg'

    pth = wid.get
        svg:   svg.svg
        type:  'path'

    start = wid.get
        x: pth.config.start[0]
        y: pth.config.start[1]
        type: 'button'
        path: pth

    end = wid.get
        x: pth.config.end[0]
        y: pth.config.end[1]
        type: 'button'
        path: pth

    startHead = wid.get
        x: pth.config.startHead[0]
        y: pth.config.startHead[1]
        type: 'button'
        path: pth
        style:
            backgroundColor: '#ff0'

    endHead = wid.get
        x: pth.config.endHead[0]
        y: pth.config.endHead[1]
        type: 'button'
        path: pth
        style:
            backgroundColor: '#f00'

    Drag.create
        target: start
        onMove: (drag, event) ->
            p = drag.target.absPos()
            drag.target.config.path.setStart [p.x, p.y]

    Drag.create
        target: startHead
        onMove: (drag, event) ->
            p = drag.target.absPos()
            drag.target.config.path.setStartHead [p.x, p.y]

    Drag.create
        target: end
        onMove: (drag, event) ->
            p = drag.target.absPos()
            drag.target.config.path.setEnd [p.x, p.y]

    Drag.create
        target: endHead
        onMove: (drag, event) ->
            p = drag.target.absPos()
            drag.target.config.path.setEndHead [p.x, p.y]


    # _________________________________________________________________________ raise

    c.raise()

    # _________________________________________________________________________ widget test

    # Test.stageButtons()
    # Test.sliderHello()
    # Test.sliderAndValue()

    return
