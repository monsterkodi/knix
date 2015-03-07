###

00     00  00000000  000   000  000   000
000   000  000       0000  000  000   000
000000000  0000000   000 0 000  000   000
000 0 000  000       000  0000  000   000
000   000  00000000  000   000   0000000 

###

class Menu extends Widget

    init: (cfg, defs) =>
    
        cfg = _.def cfg, defs
        
        super cfg,
            type: 'menu'
        @
        
    isSubmenu: => @elem.hasClassName 'submenu'
        
    show: =>
        if @isSubmenu()
            $('stage_content').appendChild @elem
            @setPos @config.parent.absPos().plus pos 0, @config.parent.getHeight()
        @elem.addEventListener 'click', @hide
        @elem.addEventListener 'mouseleave', @hide
        super
        
    hide: =>
        if @isSubmenu()
            @elem.removeEventListener 'mousedown', @hide
            @elem.removeEventListener 'mouseleave', @hide
        super
        
    @menu: (id) => $(id)?.getWidget()
        
    @addButton: (cfg, defs) => 
        cfg = _.def cfg, defs
        @menu(cfg.menu).insertChild cfg,
            type    : 'button'
            class   : 'tool-button'
            id      : cfg.menu+'_button_'+cfg.text
            tooltip : cfg.text

    @initContextMenu: =>
        stage = $('stage_content')
        stage.addEventListener 'contextmenu', Menu.showContextMenu

    @showContextMenu: (event) =>

        event.preventDefault()

        m = @menu 'context-menu'

        if m?
            m.setPos Stage.absPos event
            return
            
        children = []
        for e in $('audio')?.getWidget()?.elem.childNodes
            btn         = _.clone e.widget.config
            btn.id      = undefined
            btn.parent  = 'context-menu'
            btn.menu    = 'context-menu'
            btn.action  = @onContextAction
            btn.action  = e.widget.config.action
            children.push btn

        m = knix.get
            title    : 'audio'
            class    : 'context-menu'
            id       : 'context-menu'
            hasClose : true
            hasMaxi  : false
            resize   : false
            hasShade : true 
            pos      : Stage.absPos event            
            children : children
                        
    @onContextAction: (event) =>
        w = event.target.getWidget().getUp('button').config.action event
        m = @menu('context-menu')
        w.setPos m.absPos()
        m.close()
        
