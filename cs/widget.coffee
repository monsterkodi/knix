drag = require('./drag.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')

class Widget

    @nextWidgetID  = 0
    @defaultConfig =
        hasTitle:  true
        hasClose:  true
        hasShade:  true
        hasSize:   true
        isMovable: true
        isShaded:  false
        parent:    "content"
        title:     "widget"

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
        log @id
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
        if @config.isShaded
            @setHeight @config.height
            # adjust height for border size
            diff = @getHeight() - @config.height
            @setHeight @config.height - diff  if diff
            @config.isShaded = false
        else
            @config.height = @getHeight()
            @setHeight @headerSize()
            @config.isShaded = true
        return

    addSizeButton: ->
        button = Widget.elem "div", "size"
        @insert button
        @sizeDrag = null
        button.on "mousedown", (event, sender) ->
            element = $(sender.id)
            widget  = $(element.parentElement.id)
            sender.parentElement.sizeDrag.minPos = new pos(0, widget.headerSize())
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
            minPos: new pos(0, @headerSize())
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

    headerSize: ->
        children = Selector.findChildElements(this, [
          "*.title"
          "*.close"
          "*.shade"
        ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get("padding-box-height")
            return height  if height
            i++
        0

    # ______________________________________________________ static functions

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

    @create = (cfg) ->
        w = @elem("div", "widget")                          # create widget div
        Object.extend w, Widget.prototype                   # merge in widget functions
        w.config = @def cfg, Object.clone(@defaultConfig)   # copy default and merge in cfg
        w.addCloseButton()  if w.config.hasClose
        w.addShadeButton()  if w.config.hasShade
        w.addTitleBar()     if w.config.hasTitle
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
        w # return the widget

    @def = (cfg,defs) -> Object.extend(defs,cfg)            # takes values from config and overwrites those in defs

    @widget = (cfg) ->
        @create @def cfg,
            style:    'frame'

    @button = (cfg) ->
        @create @def cfg,
            text:     null
            width:    20
            height:   20
            hasTitle: false
            hasClose: false
            hasShade: false
            hasSize:  false
            style:    'button'

module.exports = Widget
