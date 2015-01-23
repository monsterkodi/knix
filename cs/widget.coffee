class Widget
  @defaultConfig =
    hasTitle: true
    hasClose: true
    hasShade: true
    isMovable: true
    isShaded: false
    parentID: "content"
    title: "widget"

  config = null
    @addTitleBar = ->
      title = newElement("div").addClassName("title")
      title.insert @config.title
      @insert title
      new dragObject(this, title)  if @config.isMovable
      return

    @addCloseButton = ->
      button = newElement("div").addClassName("close")
      @insert button
      widget = this
      button.on "click", ->
        widget.close()
        return

      return

    @close = ->
      @remove()
      return

    @addShadeButton = ->
      button = newElement("div").addClassName("shade")
      @insert button
      widget = this
      button.on "click", ->
        widget.shade()
        return

      return

    @shade = ->
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

    @addSizeButton = ->
      button = newElement("div").addClassName("size")
      @insert button
      drag = null
      button.on "mousedown", (event, sender) ->
        element = $(sender.id)
        widget = $(element.parentElement.id)
        drag.lowerBound = new Position(0, widget.headerSize())
        log drag
        return

      moveCallback = (newPos, element) ->
        log "move"
        widget = $(element.parentElement.id)
        layout = $(element.id).getLayout()
        widget.setWidth newPos.x + layout.get("border-box-width")
        widget.setHeight newPos.y + layout.get("border-box-height")
        return

      drag = new dragObject(button, null, new Position(0, @headerSize()), new Position(99999, 99999), null, moveCallback)
      log drag
      return

    @moveTo = (x, y) ->
      @style.left = "%dpx".fmt(x)
      @style.top = "%dpx".fmt(y)
      return

    @setWidth = (w) ->
      @style.width = "%dpx".fmt(w)  if w?
      return

    @setHeight = (h) ->
      @style.height = "%dpx".fmt(h)  if h?
      return

    @resize = (w, h) ->
      @setWidth w
      @setHeight h
      return

    @headerSize = ->
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
      
  widgetFunc = widgetFunctions()
    
  @closeAll = ->
    $$(".widget").each (widget) ->
      widget.close()
      return

    return

  @create = (cfg) ->
    widget = newElement("div").addClassName("widget") # create widget div
    Object.extend widget, widgetFunc # merge in widget functions
    widget.config = Object.clone(defaultConfig) # copy default config to widget
    widget.config = Object.extend(widget.config, cfg) # merge in argument config
    
    # log("Widget.new config", widget.config);
    widget.addCloseButton()  if widget.config.hasClose
    widget.addShadeButton()  if widget.config.hasShade
    widget.addTitleBar()  if widget.config.hasTitle
    if widget.config.hasSize
      widget.addSizeButton()
    else new dragObject(widget)  if widget.config.isMovable
    $(widget.config.parentID).insert widget  if widget.config.parentID
    widget.moveTo widget.config.x, widget.config.y  if widget.config.x? and widget.config.y?
    widget.resize widget.config.width, widget.config.height  if widget.config.width? or widget.config.height?
    widget

console.log(String(window))  
window.Widget = Widget
console.log(String(window.Widget))  
