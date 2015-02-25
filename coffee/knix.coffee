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

        if config.console?
            c = new Console()
            c.shade() if config.console == 'shade'

        s = 'welcome to'; log s, 'knix', 'version:', @version

        StyleSwitch.init()
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
            tooltip: 'save'
            icon:    'octicon-file-binary'
            onClick: @dumpWindows

        @get btn,
            tooltip: 'restore'
            icon:    'octicon-file-directory'
            onClick:  @restoreMenu

        @get btn,
            icon:   'octicon-dash'
            onClick: -> knix.shadeWindows()

        @get btn,
            icon:   'octicon-x'
            onClick: -> knix.closeWindows()

    # ________________________________________________________________________________ element creation

    @create: (cfg, defs) =>

        cfg = _.def cfg, defs

        if cfg.type? and @[cfg.type]? and typeof @[cfg.type] == 'function'
            @[cfg.type] cfg
        else if cfg.type? and window[_.capitalize(cfg.type)]? and typeof window[_.capitalize(cfg.type)] == 'function'
            new window[_.capitalize(cfg.type)] cfg
        else
            new Widget cfg, { type: 'widget' }

    # ________________________________________________________________________________ get

    # shortcut to call @create with default type window and stage_content as parent

    @get: (cfg, def) =>
        cfg = _.def cfg, def
        @create _.def cfg,
            type:   'window'
            parent: 'stage_content'

    # ________________________________________________________________________________ windows

    @allWindows:     => w.widget for w in $$('.window') when not w.hasClassName 'console-window'
    @allConnections: => _.uniq _.flatten ( c.widget.connections for c in $$('.connector') )

    @closeWindows: => @allWindows().each (w) -> w.close()
    @shadeWindows: => @allWindows().each (w) -> w.shade()
    @dumpWindows:  => 
        dump = '\n    knix.restore '
        dump += JSON.stringify { 'windows': (w.config for w in @allWindows()), 'connections': @allConnections() }, null, '    '
        dump = dump.slice(0,-1)
        dump += "    }"
        # log dump
        files = {} 
        if localStorage.getItem('files')?
            files = JSON.parse localStorage.getItem('files')
        files[uuid.v4()] = dump
        localStorage.setItem 'files', JSON.stringify(files)

    @restoreMenu: =>
        for file, data of JSON.parse(localStorage.getItem('files'))
            log 'file', file, data.length

    @restore: (state) =>
        @restoreWindows state.windows
        @restoreConnections state.connections

    @restoreWindows: (windows) => 
        for w in windows
            @get w
            
    @restoreConnections: (connections) =>
        for c in connections
            new Connection c
    # ________________________________________________________________________________ tooltips

    @addPopup: (p) =>
        @popups = [] if not @popups?
        @popups.push p
        if not @popupHandler?
            @popupHandler = document.on 'mousedown', @closePopups
            
    @delPopup: (p) =>
        @popups = @popups.without p

    @closePopups: (event,e) =>
        if @popups?
            for p in @popups
                p.close() for p in @popups when e not in p.elem.descendants()
        if @popupHandler?
            @popupHandler.stop()
            @popupHandler = null
                        
    # ________________________________________________________________________________ animation

    @initAnim: => window.requestAnimationFrame @anim

    @animObjects = []
    @deanimate: (o) => _.del @animObjects, o
    @animate: (o) => @animObjects.push(o)
    @anim: (timestamp) =>
        for animObject in @animObjects
            animObject.anim timestamp
        window.requestAnimationFrame @anim


    @initAudio: => Audio.init()

    # ________________________________________________________________________________ svg

    @initSVG: =>

        svg = @get
            type:   'svg'
            id:     'stage_svg'
            parent: 'stage_content'

        @svg = svg.svg

    # ________________________________________________________________________________ canvas

    @canvas: (cfg) =>
        cvs = new Widget cfg,
            elem: 'canvas'
            noMove: true
        # fbc = new fabric.Canvas cvs.elem.id
        # fbc.setWidth(cfg.width) if cfg.width?
        # fbc.setHeight(cfg.height) if cfg.height?
        # cvs.fc = fbc
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
