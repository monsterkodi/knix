drag = require('./drag.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')

class Widget

    addTitleBar: ->
        title = Widget.elem "div", "title"
        title.insert @config.title
        @insert title
        if @config.isMovable
            drag.create
                target: this
                handle: title
        return

    addCloseButton: ->
        button = Widget.elem "div", "close"
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
        button = Widget.elem "div", "shade"
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
        button = Widget.elem "div", "size"
        @insert button
        @sizeDrag = null
        button.on "mousedown", (event, sender) ->
            element = $(sender.id)
            widget  = $(element.parentElement.id)
            sender.parentElement.sizeDrag.minPos = new pos(widget.headerSize()*2-element.getWidth()+2, widget.headerSize())
            return

        moveCallback = (newPos, element) ->
            widget = $(element.parentElement.id)
            layout = $(element.id).getLayout()
            widget.setWidth  newPos.x + layout.get("border-box-width")
            widget.setHeight newPos.y + layout.get("border-box-height")
            return

        @sizeDrag = drag.create
            target: button
            onMove: moveCallback
            cursor: "nwse-resize"
            minPos: new pos(@headerSize()*2, @headerSize())
            maxPos: new pos(99999, 99999)
        return

    moveTo: (x, y) ->
        @style.left = "%dpx".fmt(x)
        @style.top  = "%dpx".fmt(y)
        return

    setWidth: (w) ->
        @style.width = "%dpx".fmt(w)  if w?
        return

    setHeight: (h) ->
        @style.height = "%dpx".fmt(h)  if h?
        return

    resize: (w, h) ->
        @setWidth w
        @setHeight h
        return

    getParent: -> $(@config.parent)
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

    @input = (cfg) ->
        w = @elem("input", "input")
        Object.extend w, Widget.prototype                   # merge in widget functions
        w.config = Object.clone(cfg)
        if w.config.style
            for style in w.config.style.split(' ')
                w.addClassName style
        w.insert(w.config.text) if w.config.text
        $(w.config.parent).insert w if w.config.parent
        w.moveTo w.config.x, w.config.y  if w.config.x? or w.config.y?
        w.resize w.config.width, w.config.height  if w.config.width? or w.config.height?
        w.on "click", w.config.onClick if w.config.onClick
        return w

    @create = (cfg) ->
        w = @elem("div", "widget")                          # create widget div
        Object.extend w, Widget.prototype                   # merge in widget functions
        w.config = Object.clone(cfg)
        w.addCloseButton()  if w.config.hasClose
        w.addShadeButton()  if w.config.hasShade
        w.addTitleBar()     if w.config.hasTitle or w.config.title
        if w.config.hasSize
            w.addSizeButton()
        else if w.config.isMovable
            drag.create(w)

        if w.config.style
            for style in w.config.style.split(' ')
                w.addClassName style

        w.insert(w.config.text) if w.config.text
        $(w.config.parent).insert w if w.config.parent

        w.moveTo w.config.x, w.config.y  if w.config.x? or w.config.y?
        w.resize w.config.width, w.config.height  if w.config.width? or w.config.height?

        w.on "click", w.config.onClick if w.config.onClick

        w # return the widget

    @def = (cfg,defs) -> Object.extend(defs,cfg)            # takes values from config and overwrites those in defs

    @widget = (cfg) ->
        @create @def cfg,
            hasClose:  true
            hasShade:  true
            hasSize:   true
            isMovable: true
            parent:    'content'
            style:     'frame'

    @button = (cfg) ->
        @create @def cfg,
            width:    20
            height:   20
            style:    'button'

    @scroll = (cfg) ->
        s = @create @def cfg,
            width:      20
            height:     20
            horizontal: true
            style:      'scroll'

        h = Widget.create
            width:      16
            height:     16
            parent:     s.id
            style:      'scroll-handle'

        drag.create
            cursor: ew-resize
            target: h
            minPos: new pos 0, 0
            maxPos: new pos(s.config.width-20, 0)

        return s

    @slider = (cfg) ->
        s = @create @def cfg,
            width:      20
            height:     20
            horizontal: true
            style:     'slider'

        l = Widget.create
            parent:    s.id
            height:    20
            width:     s.config.value
            style:     'slider-handle'

        drag.create
            cursor: ew-resize
            target: l
            mode:   "width"
            minPos: new pos 0, 0
            maxPos: new pos(s.config.width, 0)

        # drag.create
        #     cursor: ew-resize
        #     target: l
        #     handle: s
        #     mode:   "width"
        #     minPos: new pos 0, 0
        #     maxPos: new pos(s.config.width, 0)

        return s

    @value = (cfg) ->

        v = @create @def cfg,
            width:      20
            height:     20
            horizontal: true
            style:     'value'

        l = Widget.icon
            parent: v.id
            style: 'arrow-left static-left'

        r = Widget.icon
            x:      v.config.width-20
            parent: v.id
            style: 'arrow-right static-right'

        t = Widget.input
            parent: v.id
            width:  v.config.width-40
            text:   String(v.config.value)
            style:  'value-input static-center'
        t.setAttribute("type", "text")
        t.setAttribute("value", 66)

        return v

    @icon = (cfg) ->
        @create cfg

module.exports = Widget
