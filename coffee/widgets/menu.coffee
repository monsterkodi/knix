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
        
    @menu: (id) => $(id)?.getWidget()
        
    @addButton: (cfg, defs) => 
        cfg = _.def cfg, defs
        log 'add button'
        @menu(cfg.menu).insertChild cfg,
            type    : 'button'
            class   : 'tool-button'
            id      : cfg.menu+'_button_'+cfg.text
            tooltip : cfg.text

    @initContextMenu: =>

        log 'initContextMenu'
        
        $('stage_content').addEventListener 'mousedown', Menu.showContextMenu    

    @showContextMenu: (event) =>

        m = @menu 'context-menu'

        if m?
            m.setPos Stage.absPos event
            return
            
        children = []
        for e in $('menu')?.getWidget()?.elem.childNodes
            btn         = _.clone e.widget.config
            btn.id      = undefined
            btn.parent  = 'context-menu'
            btn.menu    = 'context-menu'
            btn.onClick = @onContextAction
            btn.action  = e.widget.config.action
            log btn
            children.push btn

        m = knix.get
            title    : 'audio'
            id       : 'context-menu'
            hasClose : true
            hasMaxi  : false
            resize   : false
            hasShade : true 
            pos      : Stage.absPos event            
            children : children
            
    @onContextAction: (event) =>
        log 'button action', event.target.getWidget()
        w = event.target.getWidget().config.action()
        m = @menu('context-menu')
        w.setPos m.absPos()
        m.close()
        
