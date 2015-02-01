drag = require('./drag.coffee')
wdgt = require('./widget.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')
tls  = require('./tools.coffee')

class wid

    # ____________________________________________________________________________________________________________ class

    # ___________________________________________________________________________ element creation

    @create = (cfg) ->

        #__________________________________________________ initialization

        w = @elem(cfg.elem or "div", cfg.type or "widget")  # create element
        Object.extend w, wdgt.prototype                     # merge in widget functions
        w.config = Object.clone(cfg)                        # set config

        w.writeAttribute('id', w.config.id) if w.config.id? # set element id

        for a,v of w.config.attr                            # set element attributes
            log a, v
            w.writeAttribute(a, v)

        if w.config.class                                   # add class names
            for clss in w.config.class.split(' ')
                w.addClassName clss

        #__________________________________________________ CSS setup

        if w.config.style
            w.setStyle w.config.style

        style = $H()
        style.set(s, w.config[s]+'px') for s in ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'] when w.config[s]?
        w.setStyle style.toObject() if style.keys().length

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

    # __________________________________________________________________________ tools

    # takes values from config and overwrites those in defaults

    @def = (config,defaults) -> Object.extend(defaults,config)

    # __________________________________________________________________________ elem and widget hierarchy

    @nextWidgetID  = 0

    @elem = (type, clss) -> # create element of <type>, add class <clss> and assign 'unique' id
        e = new Element type
        e.id = "knix_%d".fmt(@nextWidgetID)
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

    # ________________________________________________________________________________ event handling

    @initEvents = (w) ->
        w.on "click",      w.config.onClick  if w.config.onClick
        w.on "mousedown",  w.config.onDown   if w.config.onDown
        w.on "mouseup",    w.config.onUp     if w.config.onUp
        w.on "mouseover",  w.config.onOver   if w.config.onOver
        w.on "mousemove",  w.config.onMove   if w.config.onMove
        w.on "mouseout",   w.config.onOut    if w.config.onOut
        w.on "ondblclick", w.config.onDouble if w.config.onDouble
        this

    # ____________________________________________________________________________ slots

    @initSlots = (w) ->
        slots = w.config.slots
        return if not slots?
        for slot, func of slots
            # log "@initSlots", w.id, slot
            w[slot] = func

    # ____________________________________________________________________________ connections

    @initConnections = (w) ->
        connections = w.config.connect
        return if not connections?
        for connection in connections
            @connect w, connection.signal, connection.slot

    @connect = (w, signal, slot) ->
        # log "@connect", signal, slot
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
        [event, sender] =  signal.split(':').reverse()
        sender = w.getWidget().getChild(sender) if sender?
        sender = w unless sender?
        [sender, event]

    @resolveSlot = (w, slot) ->
        if typeof slot == 'function'
            return slot
        if typeof slot == 'string'
            [func, receiver] = slot.split(':').reverse()
            receiver = w.getWidget().getChild(receiver) if receiver?
            receiver = w unless receiver?
            return receiver[func].bind(receiver) if receiver[func]?
        null

    # ________________________________________________________________________________ get

    # shortcut to call any of the type functions below (@widget, @button, @slider, ...)
    # uses @widget if no type is specified and sets the stage_content as default parent

    @get = (cfg) ->
        @[cfg.type or 'widget'](@def cfg, {parent: 'stage_content'})

    # ________________________________________________________________________________ widget

    @widget = (cfg) ->

        chd = cfg.children
        if cfg.child
            if not chd? then chd = []
            chd.push cfg.child
        cfg.children = null
        cfg.child = null

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
            type: 'content'
            parent: w
        w.content = c.id
        w.config.children = chd
        @insertChildren(w)
        w

    @closeAll = -> # close all widgets
        $$(".widget").each (widget) ->
            widget.close()
            return
        return

    # ________________________________________________________________________________ canvas

    @canvas = (cfg) ->
        cvs = @create @def cfg,
            elem: 'canvas'
        fbc = new fabric.StaticCanvas cvs.id
        fbc.setWidth(cfg.width) if cfg.width?
        fbc.setHeight(cfg.height) if cfg.height?
        cvs.fc = fbc
        cvs

    # ________________________________________________________________________________ svg

    @svg = (cfg) ->
        svg = @create @def cfg,
            elem: 'svg'
        svg.s = SVG('stage_svg')
        svg

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
                log @id, 'farz', arg.detail
                return
            v = @clamp(v)
            @config.value = v
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
                    v = @format(@round(@clamp(@slotArg(arg, 'value'))))
                    @input.value = @strip0 v
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
                            type: 'icon'
                            icon: 'octicon-triangle-left'
                            onClick: (event,e) -> @getParent('value').incr '-'
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
                            type: 'icon'
                            icon: 'octicon-triangle-right'
                        onClick: (event,e) -> @getParent('value').incr '+'
                    ]

        value.input = value.getChild 'value-input'

        value.incr = (d) ->
            if d in ['up', '+', '++'] then d = 1
            else if d in ['down', '-', '--'] then d = -1
            if @config.valueStep? then step = @config.valueStep else step = 1
            @setValue @input.getValue() + step*d

        value.on 'keypress', (event,e) ->
            if event.key in ['Up', 'Down']
                @incr event.key.toLowerCase()
                event.stop()
                return
            if event.key not in '0123456789-.'
                if event.key.length == 1
                    event.stop()
                    return
            if event.key in '-.'
                if @input.value.indexOf(event.key) > -1
                    event.stop()
                    return

        value.on 'change', (event, e) ->
            log 'value on change', e.id, e.getValue()
            @setValue e.getValue()

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

    # ________________________________________________________________________________ icon

    @icon = (cfg) ->
        @create @def cfg,
            child:
                elem:   'span'
                type:   'octicon'
                class:   cfg.icon


    # ________________________________________________________________________________ input

    @input = (cfg) ->
        inp = @create @def cfg,
            elem: 'input'
            type: 'input'

        inp.setAttribute "size", 6
        inp.setAttribute "type", "text"
        inp.setAttribute "inputmode", "numeric"
        inp.getValue = -> parseFloat(@value)
        inp

    @button = (cfg) ->
        @create @def cfg,
            type:     'button'
            noDown:   true
            minWidth: 50
            height:   20

module.exports = wid
