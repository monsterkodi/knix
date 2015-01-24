elem = require('./tools.coffee').elem
drag = require('./drag.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')

class Widget
    @defaultConfig =
        hasTitle:  true
        hasClose:  true
        hasShade:  true
        hasSize:   true
        isMovable: true
        isShaded:  false
        parentID:  "content"
        title:     "widget"

    constructor: (@name) ->
        @config = Widget::defaultConfig
        @sizeDrag = null

    addTitleBar: ->
        title = elem("div").addClassName("title")
        title.insert @config.title
        @insert title
        if @config.isMovable
            drag.create
                target: this
                handle: title
        return

    addCloseButton: ->
        button = elem("div").addClassName("close")
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
        button = elem("div").addClassName("shade")
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
        button = elem("div").addClassName("size")
        @insert button
        @sizeDrag = null
        button.on "mousedown", (event, sender) ->
            element = $(sender.id)
            widget  = $(element.parentElement.id)
            @sizeDrag.lowerBound = new pos(0, widget.headerSize())
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

    # static functions

    @closeAll = ->
        $$(".widget").each (widget) ->
            widget.close()
            return
        return

    @create = (cfg) ->
        widget = elem("div").addClassName("widget") # create widget div
        Object.extend widget, Widget.prototype # merge in widget functions
        widget.config = Object.clone(@defaultConfig) # copy default config to widget
        widget.config = Object.extend(widget.config, cfg) # merge in argument config

        widget.addCloseButton()  if widget.config.hasClose
        widget.addShadeButton()  if widget.config.hasShade
        widget.addTitleBar()     if widget.config.hasTitle
        if widget.config.hasSize
            widget.addSizeButton()
        else if widget.config.isMovable
            drag.create(widget)
        $(widget.config.parentID).insert widget if widget.config.parentID
        widget.moveTo widget.config.x, widget.config.y  if widget.config.x? or widget.config.y?
        widget.resize widget.config.width, widget.config.height  if widget.config.width? or widget.config.height?
        widget # return the widget

module.exports = Widget
