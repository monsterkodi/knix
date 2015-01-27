drag = require('./drag.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')

class wid

    addTitleBar: ->
        title = wid.elem "div", "title"
        title.insert @config.title
        @insert title
        if @config.isMovable
            drag.create
                target: this
                handle: title
        return

    addCloseButton: ->
        button = wid.elem "div", "close"
        @insert button
        widget = this
        button.on "click", ->
            widget.close()
            return
        return

    close: ->
        @remove()
        return

    addShadeButton: ->
        button = wid.elem "div", "shade"
        @insert button
        widget = this
        button.on "click", ->
            widget.shade()
            return
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

    addSizeButton: ->
        button = wid.create
            elem: "div"
            type: "size"
            parent: this

        moveCallback = (drag, event) ->
            widget = drag.target.getParent()
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
            target: button
            onMove: moveCallback
            cursor: "nwse-resize"
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

    @insertChildren = (w) ->
        if w.config.children
            for cfg in w.config.children
                if wid[cfg.type] != undefined then child = wid[cfg.type](cfg)
                else child = wid.create(cfg)
                wid.insertWidget(child,w)
        this

    @installEvents = (w) ->
        w.on "click",      w.config.onClick  if w.config.onClick
        w.on "mousedown",  w.config.onDown   if w.config.onDown
        w.on "mouseup",    w.config.onUp     if w.config.onUp
        w.on "mouseover",  w.config.onOver   if w.config.onOver
        w.on "mousemove",  w.config.onMove   if w.config.onMove
        w.on "mouseout",   w.config.onOut    if w.config.onOut
        w.on "ondblclick", w.config.onDouble if w.config.onDouble
        this

    @input = (cfg) ->
        # d = @elem("div", "value-input-div")

        w = @elem("input", "input")
        Object.extend w, wid.prototype                      # merge in widget functions
        w.config = Object.clone(cfg)
        if w.config.style
            for style in w.config.style.split(' ')
                w.addClassName style
        w.insert(w.config.text) if w.config.text

        @insertWidget(w, w.config.parent)

        # @insertWidget(d, w.config.parent)
        # d.insert(w)

        w.setAttribute("type", "text")
        w.setAttribute("inputmode", "numeric")
        w.setAttribute("size", 5)
        # w.moveTo w.config.x, w.config.y  if w.config.x? or w.config.y?
        #w.resize w.config.width, w.config.height  if w.config.width? or w.config.height?
        @installEvents(w)
        return w
        # return d

    @create = (cfg) ->
        w = @elem(cfg.elem or "div", cfg.type or "widget")  # create widget div
        Object.extend w, wid.prototype                      # merge in widget functions
        w.config = Object.clone(cfg)
        drag.create(w) if w.config.isMovable

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
        w # return the widget

    @def = (cfg,defs) -> Object.extend(defs,cfg)            # takes values from config and overwrites those in defs

    @get = (cfg) -> @[cfg.type or 'widget'](cfg)

    @widget = (cfg) ->
        chd = cfg.children
        cfg.children = null
        w = @create @def cfg,
            hasClose:  true
            hasShade:  true
            hasSize:   true
            isMovable: true
            parent:    'stage_content'
            style:     'frame'

        w.addCloseButton()  if w.config.hasClose
        w.addShadeButton()  if w.config.hasShade
        w.addTitleBar()     if w.config.hasTitle or w.config.title
        w.addSizeButton()   if w.config.hasSize
        c = @elem("div", "widget_content")
        w.insert c
        w.content = c.id
        w.config.children = chd
        @insertChildren(w)
        w

    @button = (cfg) ->
        @create @def cfg,
            width:    20
            height:   20
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
            tgt = drag.target
            tps = tgt.absPos()
            wdt = event.clientX-tps.x
            wdt = Math.min(Math.max(0,wdt),tgt.getParent().innerWidth())
            tgt.setWidth(wdt)
            return

        children = []
        if cfg.hasBar or !cfg.hasKnob
            children.push
                elem:    'div'
                type:    'slider-bar'
                height:  20
        if cfg.hasKnob
            children.push
                elem:      'div'
                type:      'slider-knob'
                width:      16
                height:     16

        slider = @create @def cfg,
            type:       'slider'
            height:     20
            horizontal: true
            style:      'static'
            children:   children

        sliderBar = slider.getChild('slider-bar')
        sliderBar.setWidth(slider.config.value)
        drag.create
            cursor:     'ew-resize'
            target:     sliderBar
            handle:     slider
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

        return slider

    @value = (cfg) ->
        v = @create @def cfg,
            width:      80
            height:     20
            value:      0
            horizontal: true
            style:      'value static'
            children: \
            [
                type:       'icon'
                style:      'arrow-left static-left'
            ,
                type:       'icon'
                style:      'arrow-right static-right'
            ,
                type:       'input'
                style:      'value-input static'
            ]

        log v.getChild('input')
        v.getChild('input').setAttribute("value", v.config.value)

        return v

    @icon = (cfg) ->
        @create cfg

module.exports = wid
