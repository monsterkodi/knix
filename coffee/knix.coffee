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

        Keys.init()
        StyleSwitch.init()
                
        @initSVG()
        @initMenu()
        @initAnim()
        @initTools()
        @initAudio()
                
        Menu.initContextMenu()
        
        if config.loadLast then Files.loadLast()
        
        c?.raise()
        
        log 'knix initialised'
        @
    
    # ________________________________________________________________________________ menus
        
    @initMenu: =>
        
        mainMenu = new Menu
            id      : 'menu'
            parent  : 'stage'
            style   : 
                top : '0px'
            
        toolMenu = new Menu
            id        : 'tool'
            parent    : 'stage'
            style     :
                top   : '0px'
                right : '0px'
        
    # ________________________________________________________________________________ tools menu

    @initTools: =>

        btn = 
            menu    : 'tool'

        Menu.addButton btn,
            tooltip : 'save'
            keys    : ['s']
            icon    : 'fa-floppy-o'
            action : Files.saveWindows

        Menu.addButton btn,
            tooltip : 'reload'
            keys    : ['r']
            icon    : 'fa-retweet'
            action : Files.loadLast

        Menu.addButton btn,
            tooltip : 'load'
            icon    : 'fa-folder-o'
            action  : Files.loadMenu

        Menu.addButton btn,
            tooltip : 'console'
            icon    : 'octicon-terminal'
            action  : -> new Console()

        Menu.addButton btn,
            tooltip : 'fullscreen'
            icon    : 'octicon-device-desktop'
            action  : -> Stage.toggleFullscreen()

        Menu.addButton btn,
            tooltip : 'style'
            keys    : ['i']
            icon    : 'octicon-color-mode'
            action  : -> StyleSwitch.toggle()

        Menu.addButton btn,
            tooltip : 'set key'
            icon    : 'fa-keyboard-o'
            action  : -> Keys.interactiveKey()

        Menu.addButton btn,
            tooltip : 'about'
            icon    : 'octicon-info'
            action  : -> About.show()

        Menu.addButton btn,
            tooltip : 'shade all'
            icon    : 'octicon-dash'
            action  : -> knix.shadeWindows()

        Menu.addButton btn,
            tooltip : 'close all'
            icon    : 'octicon-x'
            keys    : ['x']
            action  : -> knix.closeWindows()

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

    @allWindows       : => w.widget for w in $$('.window') when not (w.hasClassName('console-window') or w.hasClassName('tooltip'))
    @allConnections   : => _.uniq _.flatten ( c.widget.connections for c in $$('.connector') )
    @closeConnections : => @allConnections().each (c) -> c.close()
    @closeWindows     : => 
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
            type   : 'svg'
            id     : 'stage_svg'
            parent : 'stage_content'

        @svg = svg.svg
