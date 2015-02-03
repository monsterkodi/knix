
#   ###  ###  ###   ###  ###  ###   ###
#   ### ###   ####  ###  ###    #####
#   #####     ### # ###  ###     ###
#   ### ###   ###  ####  ###    #####
#   ###  ###  ###   ###  ###  ###   ###

# pos     = require './tools/pos.coffee'
# log     = require './tools/log.coffee'
# tls     = require './tools/tools.coffee'
# drag    = require './tools/drag.coffee'

# Widget  = require './widgets/widget.coffee'
# Window  = require './widgets/window.coffee'
# Value   = require './widgets/value.coffee'
# Console = require './widgets/console.coffee'

class knix

    # ________________________________________________________________________________ element creation

    @init: -> log 'knix 0.1.1' #window.knix = Knix

    @create: (config, defaults) ->

        cfg = config
        cfg = Object.extend(defaults, config) if defaults?

        switch cfg.type
            when 'svg', 'canvas', 'slider', 'button', 'input', 'icon' then @[cfg.type] cfg
            when 'console' then Console.create cfg
            when 'value'   then Value.create   cfg
            when 'window'  then Window.create  cfg
            when 'widget'  then Widget.setup   cfg
            else
                console.log 'fallback to widget for type', cfg.type
                Widget.setup cfg, { type: 'widget' }

    @setup: (config, defaults) -> Widget.setup config, defaults

    # takes values from config and overwrites those in defaults

    @def: (config, defaults) -> Object.extend(defaults, config)

    @mixin: (w) -> # merge in object functions

        Object.extend w, switch w.config.type
            when 'console' then Console.prototype
            when 'value'   then Value.prototype
            when 'window'  then Window.prototype
            else Widget.prototype

    # ________________________________________________________________________________ get

    # shortcut to call any of the type functions below (@window, @button, @slider, ...)
    # uses @window if no type is specified and sets the stage_content as default parent

    @get: (cfg) ->
        @create cfg, { type:'window', parent: 'stage_content'}

    @closeAll: -> # close all windows
        $$(".window").each (win) ->
            win.close()
            return
        return

    # ________________________________________________________________________________ canvas

    @canvas: (cfg) ->
        cvs = @setup cfg,
            elem: 'canvas'
        fbc = new fabric.StaticCanvas cvs.id
        fbc.setWidth(cfg.width) if cfg.width?
        fbc.setHeight(cfg.height) if cfg.height?
        cvs.fc = fbc
        cvs

    # ________________________________________________________________________________ svg

    @svg: (cfg) ->
        svg = @setup cfg,
            elem: 'svg'
        svg.s = SVG('stage_svg')
        svg

    # ________________________________________________________________________________ slider

    @slider: (cfg) ->

        sliderFunc = (drag, event) ->
            sld = drag.target
            sps = sld.absPos()
            wdt = event.clientX-sps.x
            v   = sld.size2value wdt
            sld.setValue(v)

        children = []
        if cfg.hasBar or !cfg.hasKnob
            children.push
                type:    'slider-bar'
        if cfg.hasKnob
            children.push
                type:    'slider-knob'

        slider = @setup cfg,
            type:       'slider'
            value:      0
            valueMin:   0
            valueMax:   100
            horizontal: true
            children:   \
            [
                type:       'relative'
                children:   children
            ]

        slider.setValue = (arg) ->
            v = @slotArg(arg, 'value')
            if isNaN v
                log @id, 'farz', arg.detail
                return
            v = @clamp(v)
            @config.value = v
            pct = @percentage v
            slb = @getChild('slider-bar')
            if slb
                slb.style.width = "%d%%".fmt(pct)

            knb = @getChild('slider-knob')
            if knb
                knb.style.left = "%d%%".fmt(pct)
                knb.style.marginLeft = "-%dpx".fmt knb.getWidth()/2
            @emit 'onValue', value:v
            log @id, v
            return

        slider.setValue(slider.config.value)

        # this is only to fix a minor glitch in the knob display, might cost too much performance:
        sizeCB = (event,e) -> slider.setValue(slider.config.value)
        win = slider.getWindow()
        win.on "size", sizeCB if win

        Drag.create
            cursor:     'ew-resize'
            target:     slider
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

        slider

    # ________________________________________________________________________________ button

    @button: (cfg) ->
        @setup cfg,
            type:     'button'
            noDown:   true
            minWidth: 50

    # ________________________________________________________________________________ icon

    @icon: (cfg) ->
        @setup cfg,
            child:
                elem:   'span'
                type:   'octicon'
                class:   cfg.icon


    # ________________________________________________________________________________ input

    @input: (cfg) ->
        inp = @setup cfg,
            elem: 'input'
            type: 'input'

        inp.setAttribute "size", 6
        inp.setAttribute "type", "text"
        inp.setAttribute "inputmode", "numeric"
        inp.getValue = -> parseFloat(@value)
        inp

# module.exports = Knix

# log = require './tools/log.coffee'
# wid = require './knix.coffee'

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

    # _________________________________________________________________________ canvas test

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

    # _________________________________________________________________________ widget test

    wid.get
        type:   'button'
        id:     'hello'
        text:   'hello'
        parent: 'menu'
        onClick: ->
            log 'hello!'
            wid.get
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
                    # ,
                    #     signal: 'slider_1:onValue'
                    #     slot:   (event) ->
                    #         log "---", event.detail.value
                    ]
                ,
                    type:       'relative'
                    children:   \
                    [
                        type:       'button'
                        text:       'ok'
                        class:      'top-left'
                        onClick:    -> @getWindow().getChild('no').close()
                    ,
                        type:       'button'
                        id:         'no'
                        text:       'no'
                        class:      'top-right'
                        onClick:    -> @getWindow().close()
                    ]
                ]

    @stageButtons = () ->

        wid.get
            id:         'slider_3'
            type:       'slider'
            hasKnob:    false
            hasBar:     false
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

        wid.get
            type:       'slider'
            hasKnob:    true
            hasBar:     true
            width:      200
            x:          150
            y:          60

        wid.get
            type:       'slider'
            hasKnob:    true
            hasBar:     false
            width:      200
            x:          150
            y:          90

        wid.get
            type:       'value'
            width:      200
            x:          150
            y:          120

        wid.get
            type:       'button'
            text:       'del'
            width:      200
            x:          150
            y:          150
            onClick:    wid.closeAll

    wid.get
        type:   'button'
        text:   'del'
        parent: 'footer'
        onClick: -> wid.closeAll()

    $('hello').click()

    # Console = require './widgets/console.coffee'
    Console.menu()
    Console.create()

    document.stageButtons()

    return
