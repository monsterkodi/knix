
Widget = require './widget.coffee'
drag   = require './drag.coffee'

class Window extends Widget

    # init: ->
    #     @addCloseButton()  if @config.hasClose
    #     @addShadeButton()  if @config.hasShade
    #     if @config.buttons?
    #         @insertChild(w, b) for b in w.config.buttons
    #     @addTitleBar()     if w.config.hasTitle or w.config.title
    #
    #     c = @create
    #         elem: 'div',
    #         type: 'content'
    #         parent: w
    #
    #     w.addSizeButton()   if w.config.hasSize
    #
    #     if w.config.content == 'scroll'
    #
    #         w.on "size", (event,e) ->
    #             content = $(@content)
    #             content.setWidth  @getWidth()
    #             content.setHeight @getHeight()-@headerSize()
    #
    #         c.setStyle
    #             position:   'relative'
    #             overflow:   'scroll'
    #             width:      '100%'
    #             height:     "%dpx".fmt(w.getHeight()-w.headerSize()-4)
    #
    #     w.content = c.id
    #     w.config.children = chd
    #     @insertChildren(w)
    #     this

    #__________________________________________________ header

    addTitleBar: ->
        @create
            type:    "title"
            text:    @config.title
            parent:  this

    addCloseButton: ->
        @create
            type:    "close"
            noDown:  true
            parent:  this
            # child:
            #     type: 'icon'
            #     icon: 'octicon-x'
            onClick: (event,e) -> e.getWindow().close()

    addShadeButton: ->
        @create
            type:    "shade"
            noDown:  true
            parent:  this
            # child:
            #     type: 'icon'
            #     icon: 'octicon-dash'
            onClick: (event,e) -> e.getWindow().shade()

    scrollToBottom: ->
        content = $(@content)
        content.scrollTop = content.scrollHeight

    addSizeButton: ->
        btn = @create
            type:    "size"
            parent:  this

        dragStart = (drag, event) ->
            return

        dragMove = (drag, event) ->
            sizer = drag.target
            win = sizer.getWindow()

            wpos = win.absPos()
            spos = sizer.absPos()

            hdr = win.headerSize()

            wdt = spos.x-wpos.x+sizer.getWidth()
            wdt = Math.max(hdr*2, wdt)
            wdt = Math.max(win.minWidth(), wdt)
            wdt = Math.min(win.maxWidth(), wdt)

            hgt = spos.y-wpos.y+sizer.getHeight()
            hgt = Math.max(hdr+sizer.getHeight(), hgt)
            hgt = Math.max(win.minHeight(), hgt)
            hgt = Math.min(win.maxHeight(), hgt)

            win.resize(wdt, hgt)

            return

        dragStop = (drag, event) ->
            sizer = drag.target
            sizer.setStyle
                bottom: '0px'
                right: '0px'
                left: ''
                top: ''

        drag.create
            target:  btn
            onStart: dragStart
            onMove:  dragMove
            onStop:  dragStop
            cursor:  "nwse-resize"

        btn

    maximize: ->
        if @config.isMaximized
            @setPos @config.pos
            @setSize @config.size
            @config.isMaximized = false
        else
            stg = require('./stage.coffee')
            @config.pos = @absPos()
            @config.size = @getSize()
            @moveTo 0, 0
            @setSize stg.size()
            @config.isMaximized = true

    raise: ->
        ct = $(@content)
        st = ct.scrollTop
        @parentElement.appendChild this
        ct.scrollTop = st

    headerSize: (box="border-box-height") ->
        console.log 'headersize'
        children = Selector.findChildElements(this, [ "*.title", "*.close", "*.shade" ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get(box)
            return height if height
            i++
        0

    shade: ->
        size = @getChild 'size'
        if @config.isShaded
            @setStyle('min-height': @config.minHeight+'px')
            @setHeight @config.height
            # adjust height for border size
            diff = @getHeight() - @config.height
            @setHeight @config.height - diff  if diff
            @config.isShaded = false
            size.show() if size
        else
            @config.height = @getHeight()
            @setStyle('min-height': '0px')
            @setHeight @headerSize("padding-box-height")
            @config.isShaded = true
            size.hide() if size
        return

module.exports = Window
