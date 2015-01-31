drag = require('./drag.coffee')
wdgt = require('./widget.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')
tls  = require('./tools.coffee')

class wid

    # ____________________________________________________________________________________________________________ class

    @nextWidgetID  = 0

    @closeAll = -> # close all widgets
        $$(".widget").each (widget) ->
            widget.close()
            return
        return

    @elem = (type, clss) -> # create element of <type>, add class <clss> and assign 'unique' id
        e = new Element type
        e.id = "widget_%d".fmt(@nextWidgetID)
        @nextWidgetID += 1
        e.addClassName clss
        e

    @insertWidget = (w, p) ->
        p = $(p)
        if p
            parentid = p.id
            p = $(p.content) if p.hasOwnProperty('content')
            if p
                p.insert w
                w.config.parent = parentid if w.config
        this

    @insertChild = (w, cfg) ->
        cfg.parent = w
        if wid[cfg.type] != undefined then child = wid[cfg.type](cfg)
        else child = wid.create(cfg)
        wid.insertWidget(child,w)

    @insertChildren = (w) ->
        if w.config.children
            for cfg in w.config.children
                @insertChild(w, cfg)
        else if w.config.child
            @insertChild(w, w.config.child)

    @initEvents = (w) ->
        w.on "click",      w.config.onClick  if w.config.onClick
        w.on "mousedown",  w.config.onDown   if w.config.onDown
        w.on "mouseup",    w.config.onUp     if w.config.onUp
        w.on "mouseover",  w.config.onOver   if w.config.onOver
        w.on "mousemove",  w.config.onMove   if w.config.onMove
        w.on "mouseout",   w.config.onOut    if w.config.onOut
        w.on "ondblclick", w.config.onDouble if w.config.onDouble
        this

    # ____________________________________________________________________________slots

    @initSlots = (w) ->
        slots = w.config.slots
        return if not slots?
        for slot, func of slots
            log "@initSlots", w.id, slot
            w[slot] = func

    # ____________________________________________________________________________connections

    @initConnections = (w) ->
        connections = w.config.connect
        return if not connections?
        for connection in connections
            @connect w, connection.signal, connection.slot

    @connect = (w, signal, slot) ->
        log "@connect", signal, slot
        [signalSender, signalEvent] = @resolveSignal(w, signal)
        slotFunction = @resolveSlot(w, slot)
        if not signalSender? then log "    sender not found!"; return
        if not signalEvent?  then log "    event not found!";  return
        if not slotFunction? then log "    slot not found!";   return
        handler:  signalSender.on signalEvent, slotFunction
        sender:   signalSender
        event:    signalEvent
        receiver: slotFunction

    @resolveSignal = (w, signal) ->
        #log "@resolveSignal", signal
        [event, sender] =  signal.split(':').reverse()
        #log sender, event
        sender = w.getWidget().getChild(sender) if sender?
        sender = w unless sender?
        [sender, event]

    @resolveSlot = (w, slot) ->
        #log "@resolveSlot", slot
        if typeof slot == 'function'
            log "function slot"
            return slot
        if typeof slot == 'string'
            [func, receiver] = slot.split(':').reverse()
            #log "rec", receiver, "fnc", func
            receiver = w.getWidget().getChild(receiver) if receiver?
            receiver = w unless receiver?
            return receiver[func].bind(receiver) if receiver[func]?
            log "@resolveSlot receiver", receiver.id, "has no", func
        log "@resolveSlot slot not found!", slot
        null

    # ____________________________________________________________________________element creation

    @create = (cfg) ->

        #__________________________________________________ initialization

        w = @elem(cfg.elem or "div", cfg.type or "widget")  # create element
        Object.extend w, wdgt.prototype                     # merge in widget functions
        w.config = Object.clone(cfg)                        # set config

        w.writeAttribute('id', w.config.id) if w.config.id  # set element id

        if w.config.class                                   # add class names
            for clss in w.config.class.split(' ')
                w.addClassName clss

        #__________________________________________________ CSS setup

        if w.config.style
            w.setStyle w.config.style

        style = {}
        style[s] = w.config[s]+'px' for s in ['minWidth', 'minHeight', 'maxWidth', 'maxHeight']
        w.setStyle style

        #__________________________________________________ DOM setup

        w.insert(w.config.text) if w.config.text
        @insertWidget(w, w.config.parent)
        @insertChildren(w)

        #__________________________________________________ position and size

        if w.config.x? or w.config.y?
            w.style.position = 'absolute'
            w.moveTo w.config.x, w.config.y

        w.resize w.config.width, w.config.height if w.config.width? or w.config.height?

        #__________________________________________________ event setup

        if w.config.isMovable
            drag.create
                target: w
                cursor: null

        @initSlots(w)
        @initConnections(w)
        @initEvents(w)

        if w.config.noDown
            w.on 'mousedown', (event,e) -> event.stopPropagation()

        return w

    @def = (cfg,defs) -> Object.extend(defs,cfg) # takes values from config and overwrites those in defs

    @get = (cfg) -> # shortcut to call either @widget or any of the other type functions (@button, @scroll, @slider, @etc)
        @[cfg.type or 'widget'](@def cfg, {parent: 'stage_content'} ) # also sets the stage as default parent

    # ________________________________________________________________________________ widget

    @widget = (cfg) ->
        chd = cfg.children
        cfg.children = null
        w = @create @def cfg,
            hasClose:  true
            hasShade:  true
            hasSize:   true
            isMovable: true
            onDown:    (event,e) -> e.getWidget().raise()
            class:     'frame'

        #__________________________________________________ header

        w.addTitleBar = ->
            wid.create
                type:    "title"
                text:    @config.title
                parent:  this

        w.addCloseButton = ->
            wid.create
                type:    "close"
                noDown:  true
                parent:  this
                onClick: (event,e) -> e.getWidget().close()

        w.addShadeButton = ->
            wid.create
                type:    "shade"
                noDown:  true
                parent:  this
                onClick: (event,e) -> e.getWidget().shade()

        w.addSizeButton = ->
            btn = wid.create
                type:    "size"
                parent:  this

            moveCallback = (drag, event) ->
                widget = drag.target.getWidget()
                sizer = drag.target

                wpos = widget.absPos()
                spos = sizer.absPos()

                wdt = spos.x-wpos.x+sizer.getWidth()
                wdt = Math.max(widget.headerSize()*2, wdt)
                wdt = Math.max(widget.minWidth(), wdt)
                wdt = Math.min(widget.maxWidth(), wdt)
                widget.setWidth(wdt)

                hgt = spos.y-wpos.y+sizer.getHeight()
                hgt = Math.max(widget.headerSize()+sizer.getHeight(), hgt)
                hgt = Math.max(widget.minHeight(), hgt)
                hgt = Math.min(widget.maxHeight(), hgt)
                widget.setHeight(hgt)

                sizer.moveTo(wdt-sizer.getWidth(), hgt-sizer.getHeight())

                return

            drag.create
                target: btn
                onMove: moveCallback
                cursor: "nwse-resize"

            btn

        w.addCloseButton()  if w.config.hasClose
        w.addShadeButton()  if w.config.hasShade
        w.addTitleBar()     if w.config.hasTitle or w.config.title
        w.addSizeButton()   if w.config.hasSize
        c = @create
            elem: 'div',
            type: 'widget_content'
            parent: w
        w.content = c.id
        w.config.children = chd
        @insertChildren(w)
        w

    # ________________________________________________________________________________ slider

    @slider = (cfg) ->

        sliderFunc = (drag, event) ->
            sld = drag.target
            sps = sld.absPos()
            wdt = event.clientX-sps.x
            v   = sld.size2value wdt
            sld.setValue(v)

        children = []
        if cfg.hasBar or !cfg.hasKnob
            children.push
                type:    'slider-bar'
        if cfg.hasKnob
            children.push
                type:      'slider-knob'

        slider = @create @def cfg,
            type:       'slider'
            value:      0
            valueMin:   0
            valueMax:   100
            horizontal: true
            children:   \
            [
                type:       'relative'
                children:   children
            ]

        slider.setValue = (arg) ->
            v = @slotArg(arg, 'value')
            if isNaN v
                log 'farz'
                return
            @config.value = @clamp(v)
            pct = @percentage v
            slb = @getChild('slider-bar')
            if slb
                slb.style.width = "%d%%".fmt(pct)

            knb = @getChild('slider-knob')
            if knb
                knb.style.left = "%d%%".fmt(pct)
                knb.style.marginLeft = "-%dpx".fmt knb.getWidth()/2
            @emit 'onValue', value:v
            return

        slider.setValue(slider.config.value)

        # this is only to fix a minor glitch in the knob display, might cost too much performance:
        sizeCB = (event,e) -> slider.setValue(slider.config.value)
        widget = slider.getWidget()
        widget.on "size", sizeCB if widget

        drag.create
            cursor:     'ew-resize'
            target:     slider
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

        slider

    # ________________________________________________________________________________ value

    @value = (cfg) ->

        value = @create @def cfg,
            type:       'value'
            value:      0
            horizontal: true
            slots:      \
            {
                setValue: (arg) ->
                    v = @format(@clamp(@slotArg(arg, 'value')))
                    @getChild('input').setAttribute("value", v)
                    @emit 'onValue',
                        value: v
            }
            child:
                elem:   'table'
                type:   'value-table'
                onDown: (event,e) -> event.stopPropagation()
                child:
                    elem:   'tr'
                    type:   'value-row'
                    children: \
                    [
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type:   'icon'
                            class:  'arrow-left'
                    ,
                        elem: 'td'
                        type: 'value-content'
                        child:
                            type:   'input'
                            class:  'value-input'
                    ,
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type:   'icon'
                            class:  'arrow-right'
                    ]

        value.setValue value.config.value # i don't want to know how many good-coding-style-rules are broken here :)
        value                             # but at least it is not value.value value.value.value                  :)

    # ________________________________________________________________________________ scroll

    @scroll = (cfg) ->

        scrollFunc = (drag, event) ->
            tgt = drag.target
            tgw = tgt.getWidth()
            prt = tgt.getParent()
            tps = prt.absPos()
            wdt = event.clientX-tps.x-tgw/2 # distance form left side of scroll minus half of handle width
            wdt = Math.min(Math.max(0,wdt),prt.innerWidth()-tgw)
            tgt.moveTo(wdt,0)
            return

        scroll = @create @def cfg,
            height:     20
            horizontal: true
            class:      'scroll'

        h = wid.create
            width:      16
            height:     16
            parent:     scroll
            class:      'scroll-handle'

        drag.create
            cursor:  'ew-resize'
            handle:  scroll
            target:  h
            doMove:  false
            minPos:  pos(0, 0)
            maxPos:  pos(scroll.config.width-20, 0)
            onMove:  scrollFunc
            onStart: scrollFunc

        scroll

    # ________________________________________________________________________________ icon & input

    @icon = (cfg) ->
        @create cfg

    @input = (cfg) ->
        inp = @create @def cfg,
            elem: 'input'
            type: 'input'

        inp.setAttribute "size", 6
        inp.setAttribute "type", "text"
        inp.setAttribute "inputmode", "numeric"
        inp

    @button = (cfg) ->
        @create @def cfg,
            type:     'button'
            noDown:   true
            minWidth: 50
            height:   20

module.exports = wid
