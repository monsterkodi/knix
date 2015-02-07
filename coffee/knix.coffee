###

    KKK  KKK  NNN   NNN  III  XXX   XXX
    KKK KKK   NNNN  NNN  III    XXXXX
    KKKKK     NNN N NNN  III     XXX
    KKK KKK   NNN  NNNN  III    XXXXX
    KKK  KKK  NNN   NNN  III  XXX   XXX

###

class knix

    # ________________________________________________________________________________ element creation

    @version = '0.1.2'

    @init: ->

        log 'knix '+@version

        @initTools()
        @

    @initTools: ->

        Console.menu()

        btn =
            type:   'button'
            parent: 'tool'
            class:  'tool-button'

        @get btn,
            icon:   'octicon-device-desktop'
            onClick: -> Stage.toggleFullscreen()

        About.menu()

        @get btn,
            icon:   'octicon-x'
            onClick: -> knix.closeAll()

    @create: (config, defaults) ->

        cfg = _.def(config,defaults)

        if @[cfg.type]? and typeof @[cfg.type] == 'function'
            #log 'create knix.' + cfg.type
            @[cfg.type] cfg
        else if window[_.capitalize(cfg.type)] and typeof window[_.capitalize(cfg.type)].create == 'function'
            #log 'create class', _.capitalize(cfg.type)
            window[_.capitalize(cfg.type)].create cfg
        else
            #console.log 'fallback to widget for type', cfg.type
            Widget.setup cfg, { type: 'widget' }

    @setup: (config, defaults) -> Widget.setup config, defaults

    @mixin: (w) -> # merge in object functions

        className = _.capitalize(w.config.type)
        if window[className] and typeof window[className].prototype?
            Object.extend w, window[className].prototype
        else:
            Object.extend w, Widget.prototype

    # ________________________________________________________________________________ get

    # shortcut to call any of the type functions below (@window, @button, @slider, ...)
    # uses @window if no type is specified

    @get: (cfg={},def) -> @create _.def(cfg,def), { type:'window', parent:'stage_content' }

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
            parent: 'stage_content'
        svg.svg = SVG(svg.id)
        svg

    # ________________________________________________________________________________ button

    @button: (cfg) ->
        if cfg.icon?
            cfg.child =
                type: 'icon'
                icon: cfg.icon

        @setup cfg,
            type:     'button'
            noDown:   true

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
