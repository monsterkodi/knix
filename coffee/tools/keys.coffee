###

000   000  00000000  000   000   0000000
000  000   000        000 000   000     
0000000    0000000     00000    0000000 
000  000   000          000          000
000   000  00000000     000     0000000 

###

class Keys

    @pressed     = []
    @register    = {}
    @shortcuts   = {}
    @interactive = false
    
    @init: =>
        document.onkeypress = @onKey
        document.onkeyup    = @onKeyUp
        
    @onKey: (e) =>
        mods = _.filter([ e.shiftKey and '⇧', e.ctrlKey and '^', e.altKey and '⌥', e.metaKey and '⌘' ]).join('')
        key = mods+e.key
        log key, @interactive
        if @interactive
            if key == 'Esc'
                @stopInteractive()
            else if key == 'Backspace'
                # log 'bs', @register
                if @register.widget?
                    info 'unregister keys', @register.widget.config?.keys, 'for', @register.elem.id
                    @unregisterWidget @register.widget
                    @register.widget.config?.keys = []
                    @stopInteractive()
            else if not _.isEmpty @register
                info 'register key', key, 'for', @register.elem.id
                warning  'register key', key, 'for', @register.elem.id
                error 'register key', key, 'for', @register.elem.id
                if @register.elem?
                    @registerKeyForWidget key, @register.widget
                    @register.elem.removeClassName 'register-key'
                @stopInteractive()
        else
            if @shortcuts[key]?
                pressed = false
                for wid in @shortcuts[key]
                    if _.isFunction wid
                        wid key
                    else
                        if key not in @pressed
                            e = new MouseEvent "mousedown",
                                                bubbles    : true,
                                                cancelable : true,
                                                view       : window
                            wid.elem.dispatchEvent e
                            pressed = true
                if pressed
                    @pressed.push key

    @onKeyUp: (e) =>
        mods = _.filter([ e.shiftKey and '⇧', e.ctrlKey and '^', e.altKey and '⌥', e.metaKey and '⌘' ]).join('')
        key = mods+e.key
        # log key
        i = @pressed.indexOf key
        @pressed.splice(i, 1) if i >= 0
        if not @interactive and i >= 0 
            if @shortcuts[key]?
                for wid in @shortcuts[key]
                    if not _.isFunction wid
                        e = new MouseEvent "mouseup",
                                            bubbles    : true,
                                            cancelable : true,
                                            view       : window
                        wid.elem.dispatchEvent e
                        e = new MouseEvent "click",
                                            bubbles    : true,
                                            cancelable : true,
                                            view       : window
                        wid.elem.dispatchEvent e

    @startInteractive: =>
        @interactive = true
        document.addEventListener 'mousemove', @onMove
        @updateAtPos Stage.mousePos
        
    @stopInteractive: =>
        @interactive = false
        document.removeEventListener 'mousemove', @onMove
        @register.elem?.removeClassName 'register-key'
        @register = {}

    @registerKeyForWidget: (key, wid) =>
        wid.config.keys.push key if key not in wid.config.keys
        @add key, wid

    @add: (key,funcOrWidget) => 
        @shortcuts[key] = [] unless @shortcuts[key]? 
        @shortcuts[key].push funcOrWidget if funcOrWidget not in @shortcuts[key]
        
    @del: (key,funcOrWidget) => @shortcuts[key]?.splice @shortcuts[key].indexOf funcOrWidget, 1

    @registerWidget: (w) =>
        if w.config?.keys?
            for key in w.config.keys
                @add key, w

    @unregisterWidget: (w) => 
        if w.config?.keys?
            for key in w.config.keys
                @del key, w
        if w.config?.children?
            for c in w.config.children
                cw = $(c.id)?.getWidget()
                @unregisterWidget cw if cw?

    @onMove: (event) => @updateAtPos Stage.absPos event
        
    @updateAtPos: (p) =>
        e = Stage.elementAtPos p
        if e?
            wid = e.getWidget().upWidgetWithConfigValue 'keys'
            if wid?
                e = wid.elem
                if e != @register.elem
                    @register.elem.removeClassName 'register-key' if @register.elem?
                    e.addClassName 'register-key'
                    @register = { elem: e, widget: wid }
                return
        if @register.elem?
            @register.elem.removeClassName 'register-key'
            delete @register.elem
