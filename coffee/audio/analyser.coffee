###

 0000000   000   000   0000000   000      000   000   0000000  00000000  00000000 
000   000  0000  000  000   000  000       000 000   000       000       000   000
000000000  000 0 000  000000000  000        00000    0000000   0000000   0000000  
000   000  000  0000  000   000  000         000          000  000       000   000
000   000  000   000  000   000  0000000     000     0000000   00000000  000   000

###

class Analyser extends Window

    init: (cfg, defs) =>        
    
        _.def cfg, defs
    
        cfg = _.def cfg,
            scaleX:     1.0
            scaleY:     1.0
            triggerY:   0.0

        [ @audio, cfg ] = Audio.analyser cfg
        @dataArray = new Uint8Array(cfg.fftSize);

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
            # ,
            #     type:       'sliderspin'
            #     id:         'triggerY'
            #     value:      cfg.triggerY
            #     onValue:    @setTriggerY
            #     minValue:   -1.0
            #     maxValue:   1.0
            #     spinStep:   0.01
            ]

        @canvas = @getChild 'analyser_canvas'

        new Drag
            doMove:  false
            target:  @canvas.elem
            cursor:  'crosshair'
            onStart: @onCanvasTrigger
            onMove:  @onCanvasTrigger

        knix.animate @
        @sizeWindow()

    close: =>
        knix.deanimate @
        super

    setScaleX:   (v) => @config.scaleX   = _.value v
    setScaleY:   (v) => @config.scaleY   = _.value v
    setTriggerY: (v) => @config.triggerY = _.value v

    onCanvasTrigger: (drag, event) =>
        if event.target == @canvas.elem
            @setTriggerY -2*(drag.relPos(event).y/@canvas.elem.height-0.5)

    sizeWindow: =>
        
        hbox = @getChild('hbox')
        height = @contentHeight()
        content = @getChild('content')
        content.setHeight(height)
        height = content.innerHeight() - 100
        @canvas?.setHeight height
        width  = content.innerWidth() - 20
        @canvas?.elem.width  = width
        @canvas?.elem.height = height
        @dataArray = new Uint8Array(2*width)

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

        @audio.getByteTimeDomainData(@dataArray)

        cvs = @canvas.elem
        ctx = cvs.getContext("2d")
        cvw = cvs.getWidth()
        cvh = cvs.getHeight()

        ctx.lineWidth = 1

        # ctx.fillStyle   = "rgb(200,0,0)"
        ctx.fillStyle   = StyleSwitch.colors.analyser
        ctx.fillRect    0, 0, cvw, cvh
        ctx.strokeStyle = 'rgb(0,0,0)'
        ctx.strokeRect  0, 0, cvw, cvh

        ctx.beginPath()
        # ctx.strokeStyle = 'rgba(100,0,0,0.4)'
        ctx.strokeStyle = StyleSwitch.colors.analyser_trigger
        th = cvh*(0.5-@config.triggerY/2)
        ctx.moveTo  0,   th
        ctx.lineTo  cvw, th
        ctx.stroke()

        # ctx.strokeStyle = 'rgb(255,200,0)'
        ctx.strokeStyle = StyleSwitch.colors.analyser_trace
        ctx.beginPath()

        samples = @dataArray.length
        xd = @config.scaleX

        t  = 0
        t += 1 while @dataArray[t] >= 128 + 128*@config.triggerY and t < samples
        t += 1 while @dataArray[t]  < 128 + 128*@config.triggerY and t < samples
        t = 0 if t >= samples
        x = 0

        for i in [t..samples]
            v = 1 - @dataArray[i] / 256.0
            y = v * cvh

            if  i == t
                ctx.moveTo(x, y)
            else
                ctx.lineTo(x, y)

            x += xd

        ctx.stroke()
