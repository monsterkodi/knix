
document.observe "dom:loaded", ->

    # _________________________________________________________________________ svg test

    wid = knix

    wid.init()

    svg = wid.get
        id:    'stage_svg'
        type:  'svg'

    set = svg.s.set()
    p = svg.s.path()
    p   .M  100, 100
        .Q  200, 100, 200, 200
        .Q  200, 300, 300, 300
    set.add p
    set.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
    set.stroke(color: "rgba(255,150,0,0.2)", width: 16).fill('none')

    svg2 = wid.get
        id:    'stage_svg2'
        type:  'svg'

    set = svg2.s.set()
    p = svg2.s.path()
    p   .M  300, 100
        .Q  200, 100, 100, 200
        .Q  200, 200, 300, 300
    set.add p
    set.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
    set.stroke(color: "rgba(0,150,250,0.5)", width: 16).fill('none')

    # _________________________________________________________________________ widget test

    Test.stageButtons()
    Test.sliderHello()
    Test.sliderAndValue()

    Console.create().shade()

    return
