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

        btn =
            parent: 'tool'
            class:  'tool-button'

        new Button btn,
            tooltip: 'save'
            icon:    'fa-floppy-o'
            onClick:  Files.saveWindows

        new Button btn,
            tooltip: 'load'
            icon:    'fa-folder-o'
            onClick:  Files.loadMenu

        new Button btn,
            tooltip: 'console'
            icon:   'octicon-terminal'
            onClick: -> new Console()

        new Button btn,
            tooltip: 'fullscreen'
            icon:    'octicon-device-desktop'
            onClick: -> Stage.toggleFullscreen()

        new Button btn,
            tooltip: 'style'
            icon:    'octicon-color-mode'
            onClick: -> StyleSwitch.toggle()

        new Button btn,
            tooltip: 'about'
            icon:    'octicon-info'
            onClick: -> About.show()

        new Button btn,
            tooltip: 'shade all'
            icon:    'octicon-dash'
            onClick: -> knix.shadeWindows()

        new Button btn,
            tooltip: 'close all'
            icon:    'octicon-x'
            onClick: -> knix.closeWindows()

    # ________________________________________________________________________________ element creation

    @create: (cfg, defs) =>

        cfg = _.def cfg, defs
        # log cfg
        if cfg.type? and window[_.capitalize(cfg.type)]? and typeof window[_.capitalize(cfg.type)] == 'function'
            new window[_.capitalize(cfg.type)] cfg
        else
            new Widget cfg, { type: 'widget' }

    # ________________________________________________________________________________ get

    # shortcut to call @create with default type window and stage_content as parent

    @get: (cfg, def) =>
        cfg = _.def cfg, def
        w = @create _.def cfg,
            type:   'window'
            parent: 'stage_content'
        Stage.positionWindow w    
        w
        
    # ________________________________________________________________________________ windows

    @allWindows:     => w.widget for w in $$('.window') when not (w.hasClassName('console-window') or w.hasClassName('tooltip'))
    @allConnections: => _.uniq _.flatten ( c.widget.connections for c in $$('.connector') )
    @closeConnections: => @allConnections().each (c) -> c.close()
    @closeWindows: => 
        @closeConnections()
        @allWindows().each (w) -> w.close()
    @shadeWindows: => @allWindows().each (w) -> w.shade()

    @restore: (state) =>
        @restoreWindows     state.windows
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
            @popupHandler = document.addEventListener 'mousedown', @closePopups
            
    @delPopup: (p) =>
        @popups = @popups.without p

    @closePopups: (event) =>
        e = event?.target
        if @popups?
            for p in @popups
                p.close() for p in @popups when e not in p.elem.descendants()
        if @popupHandler?
            @popupHandler.stop()
            @popupHandler = null
                        
    # ________________________________________________________________________________ animation

    @initAnim: => 
        @animTimeStamp = 0
        window.requestAnimationFrame @anim

    @animObjects = []
    @animate: (o) => @animObjects.push(o)
    @deanimate: (o) => _.del @animObjects, o
    
    @anim: (timestamp) =>
        step = 
            stamp: timestamp 
            delta: timestamp-@animTimeStamp
            dsecs: (timestamp-@animTimeStamp)*0.001
        for animObject in @animObjects
            animObject.anim step
        @animTimeStamp = timestamp
        window.requestAnimationFrame @anim

    # ________________________________________________________________________________ audio

    @initAudio: => Audio.init()

    # ________________________________________________________________________________ svg

    @initSVG: =>

        svg = @create
            type:   'svg'
            id:     'stage_svg'
            parent: 'stage_content'

        @svg = svg.svg
