
Widget = require './widget.coffee'

#   ###   ###  ###  ###   ###  #######     #######   ###   ###
#   ### # ###  ###  ####  ###  ###   ###  ###   ###  ### # ###
#   #########  ###  ### # ###  ###   ###  ###   ###  #########
#   ###   ###  ###  ###  ####  ###   ###  ###   ###  ###   ###
#   ##     ##  ###  ###   ###  #######     #######   ##     ##

class Window extends Widget

    @create: (cfg) ->

        wid = require './wid.coffee'

        children = cfg.children
        if cfg.child
            if not children? then children = []
            children.push cfg.child
        cfg.children = null
        cfg.child = null

        w = wid.create wid.def cfg,
            type:     'window'
            hasClose:  true
            hasShade:  true
            hasSize:   true
            isMovable: true
            onDown:    (event,e) -> e.getWindow().raise()

        w.init()
        w.config.children = children
        w.insertChildren()
        w

    init: ->
        @addCloseButton()  if @config.hasClose
        @addShadeButton()  if @config.hasShade
        if @config.buttons?
            @insertChild(b) for b in @config.buttons
        @addTitleBar()     if @config.hasTitle or @config.title

        content = @create
            elem: 'div',
            type: 'content'
            parent: @

        @addSizeButton() if @config.hasSize

        if @config.content == 'scroll'

            @on "size", (event,e) ->
                content = $(@content)
                content.setWidth  @contentWidth()
                content.setHeight @contentHeight()

            content.setStyle
                position:   'relative'
                overflow:   'scroll'
                width:      '100%'
                height:     "%dpx".fmt(@contentHeight())

        @content = content.id
        this

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

        Drag = require './drag.coffee'

        Drag.create
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
        children = Selector.findChildElements(this, [ "*.title", "*.close", "*.shade" ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get(box)
            return height if height
            i++
        0

    contentWidth: ->
        @getLayout().get("padding-box-width")

    contentHeight: ->
        @getLayout().get("padding-box-height") - @headerSize()

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
