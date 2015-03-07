###

000   000  00000000  000   000   0000000
000  000   000        000 000   000     
0000000    0000000     00000    0000000 
000  000   000          000          000
000   000  00000000     000     0000000 

###

class Keys

    @pressed = []
    @register = {}
    @shortcuts = {}
    
    @init: =>
        document.onkeypress = @onKey
        document.onkeyup    = @onKeyUp
        
    @onKey: (e) =>
        mods = _.filter([ e.shiftKey and '⇧', e.ctrlKey and '^', e.altKey and '⌥', e.metaKey and '⌘' ]).join('')
        key = mods+e.key
        
        if not _.isEmpty @register
            log 'register key [%s] for element %s'.fmt key, @register.elem.id
            if @register.elem?
                @registerKeyForWidget key, @register.widget
                @register.elem.removeClassName 'register-key'
            document.removeEventListener 'mousemove', @onMove
            @register = {}
        else
            if @shortcuts[key]?
                for wid in @shortcuts[key]
                    # if wid.trigger?
                    #     wid.trigger?()
                    # else 
                    if key not in @pressed
                        e = new MouseEvent "mousedown",
                                            bubbles    : true,
                                            cancelable : true,
                                            view       : window
                        wid.elem.dispatchEvent e
                        @pressed.push key

    @onKeyUp: (e) =>
        mods = _.filter([ e.shiftKey and '⇧', e.ctrlKey and '^', e.altKey and '⌥', e.metaKey and '⌘' ]).join('')
        key = mods+e.key
        i = @pressed.indexOf key
        @pressed.splice(i, 1) if i >= 0
        if _.isEmpty(@register) and i >= 0 
            if @shortcuts[key]?
                for wid in @shortcuts[key]
                    if not wid.trigger?
                        # log 'trigger'
                        e = new MouseEvent "mouseup",
                                            bubbles    : true,
                                            cancelable : true,
                                            view       : window
                        e = new MouseEvent "click",
                                            bubbles    : true,
                                            cancelable : true,
                                            view       : window
                        wid.elem.dispatchEvent e

    @interactiveKey: =>
        document.addEventListener 'mousemove', @onMove

    @registerKeyForWidget: (key, wid) =>
        # log key, wid.elem.id
        wid.config.keys.push key if key not in wid.config.keys
        @shortcuts[key] = [] unless @shortcuts[key]?
        @shortcuts[key].push wid unless wid in @shortcuts[key]

    @unregisterKeyForWidget: (key, wid) =>
        log key, wid.elem.id
        if @shortcuts[key]?
            i = @shortcuts[key].indexOf wid
            if i >= 0
                @shortcuts[key].splice i, 1

    @registerWidget: (w) =>
        if w.config.keys?
            for key in w.config.keys
                @registerKeyForWidget key, w

    @unregisterWidget: (w) =>
        if w.config.keys?
            for key in w.config.keys
                @unregisterKeyForWidget key, w
        if w.config.children?
            for c in w.config.children
                cw = $(c.id).getWidget()
                @unregisterWidget cw if cw?

    @onMove: (event) =>
        e = document.elementFromPoint event.clientX, event.clientY
        if e?
            wid = e.getWidget().upWidgetWithConfigValue 'keys'
            if wid?
                e = wid.elem
                if e != @register.elem
                    @register.elem.removeClassName 'register-key' if @register.elem?
                    e.addClassName 'register-key'
                    @register.elem = e
                    @register.widget = wid
                return
        if @register.elem?
            @register.elem.removeClassName 'register-key'
            @register.elem = undefined
