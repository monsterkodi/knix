
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    wid = knix.init()

    # c = Console.create().shade()
    c = Console.create()

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

    endHead = wid.get
        x: pth.config.endHead[0]
        y: pth.config.endHead[1]
        type: 'button'
        path: pth

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

    svg2 = wid.get
        id:    'stage_svg2'
        type:  'svg'

    set = svg2.svg.set()
    pth = svg2.svg.path()
    pth .M  100, 100
        .Q  200, 100, 200, 200
        .Q  200, 300, 300, 300
    set.add pth
    set.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
    set.stroke(color: "rgba(50,50,50,0.2)", width: 16).fill('none')

    c.raise()

    # _________________________________________________________________________ widget test

    Test.stageButtons()
    Test.sliderHello()
    Test.sliderAndValue()

    return
