drag = require('./drag.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')

class wid

    addTitleBar: ->
        wid.create
            type:    "title"
            text:    @config.title
            parent:  this

    addCloseButton: ->
        wid.create
            type:    "close"
            noDown:  true
            parent:  this
            onClick: (event,e) -> e.getWidget().close()

    addShadeButton: ->
        wid.create
            type:    "shade"
            noDown:  true
            parent:  this
            onClick: (event,e) -> e.getWidget().shade()

    addSizeButton: ->
        btn = wid.create
            type:    "size"
            parent:  this

        moveCallback = (drag, event) ->
            widget = drag.target.getWidget()
            sizer = drag.target

            wpos = widget.absPos()
            spos = sizer.absPos()

            wdt = spos.x-wpos.x+sizer.getWidth()
            wdt = Math.max(widget.headerSize()*2+2, wdt)
            widget.setWidth(wdt)

            hgt = spos.y-wpos.y+sizer.getHeight()
            hgt = Math.max(widget.headerSize()+sizer.getHeight()+1, hgt)
            widget.setHeight(hgt)

            sizer.moveTo(wdt-sizer.getWidth(), hgt-sizer.getHeight())
            return

        drag.create
            target: btn
            onMove: moveCallback
            cursor: "nwse-resize"

        btn

    close: ->
        @remove()
        return

    shade: ->
        size = @getChild 'size'
        if @config.isShaded
            @setHeight @config.height
            # adjust height for border size
            diff = @getHeight() - @config.height
            @setHeight @config.height - diff  if diff
            @config.isShaded = false
            size.show() if size
        else
            @config.height = @getHeight()
            @setHeight @headerSize()
            @config.isShaded = true
            size.hide() if size
        return

    moveTo: (x, y) ->
        @style.left = "%dpx".fmt(x)
        @style.top  = "%dpx".fmt(y)
        return

    moveBy: (dx, dy) ->
        p = @relPos()
        @style.left = "%dpx".fmt(p.x+dx)
        @style.top  = "%dpx".fmt(p.y+dy)
        return

    innerWidth:  -> @getLayout().get("padding-box-width")
    innerHeight: -> @getLayout().get("padding-box-height")

    setWidth: (w) ->
        @style.width = "%dpx".fmt(w)  if w?
        return

    setHeight: (h) ->
        @style.height = "%dpx".fmt(h)  if h?
        return

    resize: (w, h) ->
        @setWidth w if w
        @setHeight h if h
        return

    relPos: ->
        o = @positionedOffset()
        pos o.left, o.top

    absPos: ->
        o = @cumulativeOffset()
        s = @cumulativeScrollOffset()
        pos o.left - s.left, o.top - s.top

    getParent: ->
        return $(@config.parent) if @config.parent
        return $(@parentElement.id)

    getWidget: ->
        if @hasClassName('widget')
            return this
        p = @getParent()
        w = p.getWidget()
        return w

    getChild: (name) -> Selector.findChildElements(this, ['.'+name])[0]

    headerSize: ->
        children = Selector.findChildElements(this, [ "*.title", "*.close", "*.shade" ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get("padding-box-height")
            return height  if height
            i++
        0

    # ______________________________________________________ static functions

    @nextWidgetID  = 0

    @closeAll = ->                                          # close all widgets
        $$(".widget").each (widget) ->
            widget.close()
            return
        return

    @elem = (type, style) ->                                # create element of <type>, add class <style> and assign 'unique' id
        e = new Element type
        e.id = "widget_%d".fmt(@nextWidgetID)
        @nextWidgetID += 1
        e.addClassName style
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
        if wid[cfg.type] != undefined then child = wid[cfg.type](cfg)
        else child = wid.create(cfg)
        wid.insertWidget(child,w)

    @insertChildren = (w) ->
        if w.config.children
            for cfg in w.config.children
                @insertChild(w, cfg)
        else if w.config.child
            @insertChild(w, w.config.child)

    @installEvents = (w) ->
        w.on "click",      w.config.onClick  if w.config.onClick
        w.on "mousedown",  w.config.onDown   if w.config.onDown
        w.on "mouseup",    w.config.onUp     if w.config.onUp
        w.on "mouseover",  w.config.onOver   if w.config.onOver
        w.on "mousemove",  w.config.onMove   if w.config.onMove
        w.on "mouseout",   w.config.onOut    if w.config.onOut
        w.on "ondblclick", w.config.onDouble if w.config.onDouble
        this

    @create = (cfg) ->
        w = @elem(cfg.elem or "div", cfg.type or "widget")  # create widget div
        Object.extend w, wid.prototype                      # merge in widget functions
        w.config = Object.clone(cfg)

        if w.config.isMovable
            drag.create
                target: w
                cursor: null

        if w.config.style
            for style in w.config.style.split(' ')
                w.addClassName style

        w.insert(w.config.text) if w.config.text

        @insertWidget(w, w.config.parent)
        @insertChildren(w)

        if w.config.x? or w.config.y?
            w.style.position = 'absolute'
            w.moveTo w.config.x, w.config.y

        w.resize w.config.width, w.config.height  if w.config.width? or w.config.height?

        @installEvents(w)

        if w.config.noDown
            w.on 'mousedown', (event,e) -> event.stop()

        return w

    @def = (cfg,defs) -> Object.extend(defs,cfg) # takes values from config and overwrites those in defs

    @get = (cfg) -> # shortcut to call either @widget or any of the other type functions (@button, @scroll, @slider, @etc)
        @[cfg.type or 'widget'](@def cfg, {parent: 'stage_content'} ) # also sets the stage as default parent

    @percentage = (w, v) -> # returns the percentage of value v in the [valueMin,valueMax] range of w
        cfg = w.config
        if cfg.hasKnob
            knv = @size2value w, w.getChild('slider-knob').getWidth()
            knp = 100 * (knv - cfg.valueMin) / (cfg.valueMax - cfg.valueMin)
            pct = 100 * (v - cfg.valueMin) / (cfg.valueMax - cfg.valueMin)
            Math.max(knp/2,Math.min(pct,100-knp/2))
        else
            pct = 100 * (v - cfg.valueMin) / (cfg.valueMax - cfg.valueMin)
            Math.max(0,Math.min(pct,100))

    @size2value = (w, s) -> # returns the value in the [valueMin,valueMax] range of w that lies at point s
        w.config.valueMin + (w.config.valueMax - w.config.valueMin) * s / w.innerWidth()

    @clampValue = (w, v) -> # clamps v to the [valueMin,valueMax] range of w
        Math.max(w.config.valueMin,Math.min(v, w.config.valueMax))

    @widget = (cfg) ->
        chd = cfg.children
        cfg.children = null
        w = @create @def cfg,
            hasClose:  true
            hasShade:  true
            hasSize:   true
            isMovable: true
            onDown:    (event,e) -> e.getWidget().raise()
            style:     'frame'

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
            width:    20
            height:   20
            noDown:   true
            style:    'button static'

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
            style:      'scroll static'

        h = wid.create
            width:      16
            height:     16
            parent:     scroll
            style:      'scroll-handle'

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

    @slider = (cfg) ->

        sliderFunc = (drag, event) ->
            sld = drag.target
            sps = sld.absPos()
            wdt = event.clientX-sps.x
            v   = wid.size2value(sld,wdt)
            sld.setValue(v)

        children = []
        if cfg.hasBar or !cfg.hasKnob
            children.push
                type:    'slider-bar'
                height:  20
        if cfg.hasKnob
            children.push
                type:      'slider-knob'
                width:      16
                height:     16

        slider = @create @def cfg,
            type:       'slider'
            height:     20
            horizontal: true
            style:      'static'
            children: \
            [
                type:       'relative'
                children:   children
            ]

        slider.setValue = (v) ->
            v = wid.clampValue(this, v)
            log v
            @config.value = v
            pct = wid.percentage this, v
            slb = @getChild('slider-bar')
            if slb
                slb.style.width = "%d%".fmt(pct)

            knb = @getChild('slider-knob')
            if knb
                knb.style.left = "%d%".fmt(pct)
                knb.style.marginLeft = "-%dpx".fmt knb.getWidth()/2
            return

        slider.setValue(slider.config.value)

        drag.create
            cursor:     'ew-resize'
            target:     slider
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

        slider

    @value = (cfg) ->

        v = @create @def cfg,
            type:       'value'
            height:     20
            value:      0
            horizontal: true
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
                            style:  'arrow-left'
                    ,
                        elem: 'td'
                        type: 'value-content'
                        child:
                            type:   'input'
                            style:  'value-input'
                    ,
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type:   'icon'
                            style:  'arrow-right'
                    ]

        v.getChild('input').setAttribute("value", v.config.value)
        v

    @icon = (cfg) ->
        @create cfg

module.exports = wid
