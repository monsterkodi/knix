###

000   000  000   000  000  000   000
000  000   0000  000  000   000 000 
0000000    000 0 000  000    00000  
000  000   000  0000  000   000 000 
000   000  000   000  000  000   000

###

class knix

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
        Audio.init()
        Stage.init()
    
        c?.raise()
    
        if config.loadLast then Files.loadLast()
            
        log 'knix initialised'
        @
    
    ###
    00     00  00000000  000   000  000   000   0000000
    000   000  000       0000  000  000   000  000     
    000000000  0000000   000 0 000  000   000  0000000 
    000 0 000  000       000  0000  000   000       000
    000   000  00000000  000   000   0000000   0000000 
    ###
        
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
        
    @initTools: =>

        a = Menu.addButton
            menu   : 'menu'
            text   : 'audio'
            icon   : 'fa-music'
            action : -> Menu.menu('audio').show()

        m = new Menu
            id      : 'audio'
            class   : 'submenu'
            parent  : a
        m.hide()

        btn = 
            menu    : 'tool'

        Menu.addButton btn,
            tooltip : 'save'
            keys    : ['⌥ß']
            icon    : 'fa-floppy-o'
            action  : Files.saveWindows

        Menu.addButton btn,
            tooltip : 'reload'
            keys    : ['u', '⌥®']
            icon    : 'fa-retweet'
            action  : Files.loadLast

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
            action  : Stage.toggleFullscreen

        Menu.addButton btn,
            tooltip : 'style'
            keys    : ['i']
            icon    : 'octicon-color-mode'
            action  : StyleSwitch.toggle

        Menu.addButton btn,
            tooltip : 'set key'
            keys    : ['k']
            icon    : 'fa-keyboard-o'
            action  : Keys.startInteractive

        Menu.addButton btn,
            tooltip : 'about'
            icon    : 'octicon-info'
            action  : About.show

        Menu.addButton btn,
            tooltip : 'shade all'
            icon    : 'octicon-dash'
            action  : knix.shadeWindows

        Menu.addButton btn,
            tooltip : 'close all'
            icon    : 'octicon-x'
            keys    : ['⌥∑']
            action  : knix.closeWindows
            
        Keys.add 'Backspace', knix.delSelection
        Keys.add '⌥∂', knix.deselectAll
        Keys.add '⌥å', knix.selectAll
        Keys.add '⌘x', knix.cutSelection
        Keys.add '⌘c', knix.copySelection
        Keys.add '⌘v', knix.pasteSelection
        Keys.add '⇧S', Selectangle.toggle
        Keys.add 's',   Selectangle.toggle

    ###
     0000000  00000000   00000000   0000000   000000000  00000000
    000       000   000  000       000   000     000     000     
    000       0000000    0000000   000000000     000     0000000 
    000       000   000  000       000   000     000     000     
     0000000  000   000  00000000  000   000     000     00000000
    ###

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
        
    ###
    000   000  000  000   000  0000000     0000000   000   000   0000000
    000 0 000  000  0000  000  000   000  000   000  000 0 000  000     
    000000000  000  000 0 000  000   000  000   000  000000000  0000000 
    000   000  000  000  0000  000   000  000   000  000   000       000
    00     00  000  000   000  0000000     0000000   00     00  0000000 
    ###

    @stateForWidgets : (widgets) => 
        JSON.stringify {
            'windows'     : (_.clone(w.config) for w in widgets)
            'connections' : ( [ c.config.source.elem.id, c.config.target.elem.id ] for c in @connectionsForWidgets widgets )
            }, null, '    '        
        
    @cleanState: (state) =>
        idmap = {}
        cleanConfig = (cfg) ->
            delete cfg.parentID
            idmap[cfg.id] = Widget.newID(cfg.type or 'widget')
            cfg.id = idmap[cfg.id]
            cleanConfig cfg.child if cfg.child?
            cfg.children?.each (c) -> cleanConfig c
            
        for cfg in state.windows
            cleanConfig cfg

        for c in state.connections
            if idmap[c[0]]? then c[0] = idmap[c[0]]
            if idmap[c[1]]? then c[1] = idmap[c[1]]
            
        state

    @connectionsForWidgets : (widgets) => 
        widgetConnections = []
        for connection in @allConnections()
            if connection.config.target.getWindow() in widgets and connection.config.source.getWindow() in widgets
                # log 'connection', connection.config
                widgetConnections.push connection
        widgetConnections

    @allWindows       : => w.widget for w in $$('.window') when not (w.hasClassName('console-window') or w.hasClassName('tooltip'))
    @selectedWindows  : => w.widget for w in $$('.window.selected') when not (w.hasClassName('console-window') or w.hasClassName('tooltip'))
    @selectedOrAllWindows : => 
        w = @selectedWindows()
        w = @allWindows() if _.isEmpty w
        w
    @selectedWidgets  : => w.widget for w in $$('.selected') when not (w.hasClassName('console-window') or w.hasClassName('tooltip'))
    @allConnections   : => _.uniq _.flatten ( c.widget.connections for c in $$('.connector') )
    @closeConnections : => @allConnections().each (c) -> c.close()
    @delSelection     : => @selectedWidgets().each (w) -> w.del?()
    @deselectAll      : => @selectedWidgets().each (w) -> w.elem.removeClassName 'selected'
    @selectAll        : => @allWindows().each (w) -> w.elem.addClassName 'selected'
    @copySelection    : => 
        @copyBuffer = @stateForWidgets @selectedWidgets()
        log @copyBuffer
        # window.prompt "Copy to clipboard", JSON.stringify(@copyBuffer)
    @cutSelection     : =>
        log 'cut'
        @copySelection()
        @delSelection()
        # log JSON.stringify c
        # window.prompt "Copy to clipboard", JSON.stringify(@copyBuffer)
    @pasteSelection   : =>
        log 'paste', @copyBuffer
        @deselectAll()
        for win in @restore JSON.parse @copyBuffer
            win.moveBy 10,10
            win.elem.addClassName 'selected'

    @shadeWindows     : => @selectedOrAllWindows().each (w) -> w.shade()
    @closeWindows     : => @selectedWindows().each (w) -> w.close()
    @closeAllWindows  : => @allWindows().each (w) -> w.close()

    @restore: (state) =>
        @cleanState state
        # log state
        windows = @restoreWindows state.windows
        @restoreConnections state.connections
        windows

    @restoreWindows: (windows) => ( @get(w) for w in windows )
                    
    @restoreConnections: (connections) =>
        # log connections
        for c in connections
            new Connection c
            
    ###
    000000000   0000000    0000000   000      000000000  000  00000000    0000000
       000     000   000  000   000  000         000     000  000   000  000     
       000     000   000  000   000  000         000     000  00000000   0000000 
       000     000   000  000   000  000         000     000  000             000
       000      0000000    0000000   0000000     000     000  000        0000000 
    ###

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
            delete @popupHandler
                        
    ###
     0000000   000   000  000  00     00   0000000   000000000  000   0000000   000   000
    000   000  0000  000  000  000   000  000   000     000     000  000   000  0000  000
    000000000  000 0 000  000  000000000  000000000     000     000  000   000  000 0 000
    000   000  000  0000  000  000 0 000  000   000     000     000  000   000  000  0000
    000   000  000   000  000  000   000  000   000     000     000   0000000   000   000
    ###

    @initAnim: => 
        @animTimeStamp = 0
        window.requestAnimationFrame @anim

    @animObjects = []
    @animate: (o) => @animObjects.push o
    @deanimate: (o) => 
        # log @animObjects.length
        _.del @animObjects, o
        # log @animObjects.length
    
    @anim: (timestamp) =>
        step = 
            stamp: timestamp 
            delta: timestamp-@animTimeStamp
            dsecs: (timestamp-@animTimeStamp)*0.001
        for animObject in @animObjects
            animObject?.anim? step
        @animTimeStamp = timestamp
        window.requestAnimationFrame @anim

    ###
     0000000  000   000   0000000 
    000       000   000  000      
    0000000    000 000   000  0000
         000     000     000   000
    0000000       0       0000000 
    ###

    @initSVG: =>

        svg = @create
            type   : 'svg'
            id     : 'stage_svg'
            parent : 'stage_content'

        @svg = svg.svg
