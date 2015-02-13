###

    000   000  000   000  000  000   000
    000  000   0000  000  000   000 000
    0000000    000 0 000  000    00000
    000  000   000  0000  000   000 000
    000   000  000   000  000  000   000

###

class knix

    # ________________________________________________________________________________ element creation

    @version = '::package.json:version::'

    @init: (config) =>

        s = 'welcome to'; log 'knix'+@version

        if config.console?
            c = new Console()
            c.shade() if config.console == 'shade'

        Stage.initContextMenu()
        @initSVG()
        @initAnim()
        @initTools()
        @initAudio()
        c.raise()
        @

    # ________________________________________________________________________________ tools menu

    @initTools: =>

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
            icon:   'octicon-dash'
            onClick: -> knix.shadeAll()

        @get btn,
            icon:   'octicon-x'
            onClick: -> knix.closeAll()

    # ________________________________________________________________________________ element creation

    @create: (config, defaults) =>

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

    # ________________________________________________________________________________ get

    # shortcut to call @create with default type window and stage_content as parent

    @get: (cfg={},def) => @create _.def(cfg,def), { type:'window', parent:'stage_content' }

    # ________________________________________________________________________________ widget handling

    @closeAll: => # close all windows
        $$('.window').each (windowElement) ->
            windowElement.widget.close()

    @shadeAll: -> # shade all windows
        $$('.window').each (windowElement) ->
            windowElement.widget.shade()

    @addPopup: (p) =>
        @popups = [] if not @popups?
        @popups.push p
        log 'install popup handler'
        if not @popupHandler?
            @popupHandler = document.on 'mousedown', @closePopups

    @delPopup: (p) =>
        log 'delpopup'
        @popups = @popups.without p

    @closePopups: =>
        log 'closepopups'
        if @popups?
            p.close() for p in @popups
        if @popupHandler?
            @popupHandler.stop()
            @popupHandler = null

    # ________________________________________________________________________________ animation

    @initAnim: => window.requestAnimationFrame @anim

    @animObjects = []
    @animate: (o) => @animObjects.push(o)
    @anim: (timestamp) =>
        for animObject in @animObjects
            animObject.anim timestamp
        window.requestAnimationFrame @anim


    @initAudio: => Audio.init()

    # ________________________________________________________________________________ svg

    @initSVG: =>

        svg = @get
            id:    'stage_svg'
            type:  'svg'

        @svg = svg.svg

    @svg: (cfg) =>
        svg = new Widget cfg,
            elem: 'svg'
            parent: 'stage_content'
        svg.svg = SVG(svg.elem.id)
        svg

    # ________________________________________________________________________________ canvas

    @canvas: (cfg) =>
        cvs = new Widget cfg,
            elem: 'canvas'
        fbc = new fabric.StaticCanvas cvs.elem.id
        fbc.setWidth(cfg.width) if cfg.width?
        fbc.setHeight(cfg.height) if cfg.height?
        cvs.fc = fbc
        cvs

    # ________________________________________________________________________________ icon

    @icon: (cfg) =>
        new Widget cfg,
            child:
                elem:   'span'
                type:   'octicon'
                class:   cfg.icon

    # ________________________________________________________________________________ input

    @input: (cfg) =>
        inp = new Widget cfg,
            elem: 'input'
            type: 'input'

        inp.elem.setAttribute 'size', 6
        inp.elem.setAttribute 'type', 'text'
        inp.elem.setAttribute 'inputmode', 'numeric'
        inp.elem.getValue = -> parseFloat(@value)
        inp
