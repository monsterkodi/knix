###

    KKK  KKK  NNN   NNN  III  XXX   XXX
    KKK KKK   NNNN  NNN  III    XXXXX
    KKKKK     NNN N NNN  III     XXX
    KKK KKK   NNN  NNNN  III    XXXXX
    KKK  KKK  NNN   NNN  III  XXX   XXX

###

class knix

    # ________________________________________________________________________________ element creation

    @version = '0.1.3'

    @init: ->

        log 'knix '+@version

        @initSVG()
        @initTools()
        @

    @initSVG: ->

        svg = knix.get
            id:    'stage_svg'
            type:  'svg'

        @svg = svg.svg

    @initTools: ->

        Console.menu()

        btn =
            type:   'button'
            parent: 'tool'
            class:  'tool-button'

        About.menu()

        @get btn,
            icon:   'octicon-device-desktop'
            onClick: -> Stage.toggleFullscreen()

        @get btn,
            icon:   'octicon-color-mode'
            onClick: -> StyleSwitch.toggle()

        @get btn,
            icon:   'octicon-x'
            onClick: -> knix.closeAll()

    @create: (config, defaults) ->

        cfg = _.def(config,defaults)

        if cfg.type? and @[cfg.type]? and typeof @[cfg.type] == 'function'
            # log 'create knix.' + cfg.type
            @[cfg.type] cfg
        else if cfg.type? and window[_.capitalize(cfg.type)]? and typeof window[_.capitalize(cfg.type)] == 'function'
            # log 'create class', _.capitalize(cfg.type)
            new window[_.capitalize(cfg.type)] cfg
        else
            # console.log 'fallback to widget for type', cfg.type
            new Widget cfg, { type: 'widget' }

    @mixin: (w) -> # merge in object functions

        className = _.capitalize(w.config.type)
        if window[className] and typeof window[className].prototype?
            # Object.extend w, window[className].prototype
            _.extend w, window[className].prototype
        else:
            # Object.extend w, Widget.prototype
            _.extend w, Widget.prototype

    # ________________________________________________________________________________ get

    # shortcut to call any of the type functions below (@window, @button, @slider, ...)
    # uses @window if no type is specified

    @get: (cfg={},def) -> @create _.def(cfg,def), { type:'window', parent:'stage_content' }

    @closeAll: -> # close all windows
        $$(".window").each (windowElement) ->
            windowElement.widget.close()
            return
        return

    # ________________________________________________________________________________ canvas

    @canvas: (cfg) ->
        cvs = new Widget cfg,
            elem: 'canvas'
        fbc = new fabric.StaticCanvas cvs.elem.id
        fbc.setWidth(cfg.width) if cfg.width?
        fbc.setHeight(cfg.height) if cfg.height?
        cvs.fc = fbc
        cvs

    # ________________________________________________________________________________ svg

    @svg: (cfg) ->
        svg = new Widget cfg,
            elem: 'svg'
            parent: 'stage_content'
        svg.svg = SVG(svg.elem.id)
        svg

    # ________________________________________________________________________________ button

    @button: (cfg) ->
        if cfg.icon?
            cfg.child =
                type: 'icon'
                icon: cfg.icon

        new Widget cfg,
            type:     'button'
            noDown:   true

    # ________________________________________________________________________________ icon

    @icon: (cfg) ->
        new Widget cfg,
            child:
                elem:   'span'
                type:   'octicon'
                class:   cfg.icon

    # ________________________________________________________________________________ input

    @input: (cfg) ->
        inp = new Widget cfg,
            elem: 'input'
            type: 'input'

        inp.elem.setAttribute "size", 6
        inp.elem.setAttribute "type", "text"
        inp.elem.setAttribute "inputmode", "numeric"
        inp.elem.getValue = -> parseFloat(@value)
        inp
