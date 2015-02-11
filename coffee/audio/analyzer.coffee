
class Analyser

    constructor: (config={}) ->

        @analyser  = Audio.analyser()
        @dataArray = new Uint8Array(@analyser.fftSize);

        @initWindow config

        knix.animate @

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_analyser'
            icon:   'octicon-terminal'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Analyser()

    initWindow: (cfg) =>

        @window = knix.get cfg,
            title: 'analyser'
            child:
                id:   'analyser_canvas'
                type: 'canvas'

        @canvas = @window.getChild('analyser_canvas').elem

    anim: (timestamp) =>

        @analyser.getByteTimeDomainData(@dataArray)

        ctx = @canvas.getContext("2d")
        cvw = @canvas.getWidth()
        cvh = @canvas.getHeight()

        # ctx.fillStyle = 'rgb(30,30,30)'
        # ctx.fillRect(0,0,cvw,cvh)

        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgb(255,255,255)'

        ctx.beginPath()

        xd = cvw * 1.0 / @analyser.fftSize
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
