###

     0000000   000   000   0000000   000      000   000  0000000   00000000  00000000
    000   000  0000  000  000   000  000       000 000  000        000       000   000
    000000000  000 0 000  000000000  000        00000    0000000   0000000   0000000
    000   000  000  0000  000   000  000         000          000  000       000   000
    000   000  000   000  000   000  000000000   000     0000000   00000000  000   000

###

class Analyser extends Window

    constructor: (cfg, defs) ->

        cfg = _.def cfg, defs
        cfg = _.def cfg,
            scaleX: 1.0
            scaleY: 1.0

        @audio = \
        @analyser = Audio.analyser()
        @dataArray = new Uint8Array(@analyser.fftSize);

        super cfg,
            title: 'analyser'
            children: \
            [
                type: 'jacks'
                audio: @audio
            ,
                id:   'analyser_canvas'
                type: 'canvas'
                style:
                    width:  '100%'
                    height: '100%'
            ,
                type:       'sliderspin'
                id:         'scaleX'
                value:      cfg.scaleX
                onValue:    @setScaleX
                minValue:   1.0
                maxValue:   20.0
                valueStep:  1
            ]

        @canvas = @getChild('analyser_canvas')

        knix.animate @
        @sizeWindow()

    setScaleX: (a) => @config.scaleX = _.arg(a)
    setScaleY: (a) => @config.scaleY = _.arg(a)

    sizeWindow: =>
        hbox = @getChild('hbox')
        height = @contentHeight()
        content = @getChild('content')
        content.setHeight(height)
        height = content.innerHeight() - 90
        @canvas.setHeight height
        width  = content.innerWidth() - 20
        @canvas.elem.width  = width
        @canvas.elem.height = height

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_analyser'
            icon:   'octicon-pulse'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Analyser
                            center: true

    anim: (timestamp) =>

        @analyser.getByteTimeDomainData(@dataArray)

        cvs = @canvas.elem
        ctx = cvs.getContext("2d")
        cvw = cvs.getWidth()
        cvh = cvs.getHeight()

        ctx.lineWidth = 1

        ctx.fillStyle   = "rgb(200,0,0)"
        ctx.fillRect    0, 0, cvw, cvh
        ctx.strokeStyle = 'rgb(0,0,0)'
        ctx.strokeRect  0, 0, cvw, cvh
        ctx.strokeStyle = 'rgb(255,205,0)'

        ctx.beginPath()

        xd = cvw * @config.scaleX / @analyser.fftSize
        x = 0

        for i in [0..@analyser.fftSize]
            v = @dataArray[i] / 128.0
            y = v * cvh/2

            if  i == 0
                ctx.moveTo(x, y)
            else
                ctx.lineTo(x, y)

            x += xd

        ctx.stroke()
