
#   ###  ###  ###   ###  ###  ###   ###
#   ### ###   ####  ###  ###    #####
#   #####     ### # ###  ###     ###
#   ### ###   ###  ####  ###    #####
#   ###  ###  ###   ###  ###  ###   ###

pos     = require './tools/pos.coffee'
log     = require './tools/log.coffee'
tls     = require './tools/tools.coffee'
drag    = require './tools/drag.coffee'

Widget  = require './widgets/widget.coffee'
Window  = require './widgets/window.coffee'
Value   = require './widgets/value.coffee'
Console = require './widgets/console.coffee'

class Knix

    # ________________________________________________________________________________ element creation

    @init: window.knix = Knix

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

        drag.create
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

module.exports = Knix
