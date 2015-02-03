###

    000   000  000  000   000  0000000     0000000   000   000
    000 0 000  000  0000  000  000   000  000   000  000 0 000
    000000000  000  000 0 000  000   000  000   000  000000000
    000   000  000  000  0000  000   000  000   000  000   000
    00     00  000  000   000  0000000     0000000   00     00

###

class Window extends Widget

    @create: (cfg) ->

        children = cfg.children
        if cfg.child
            if not children? then children = []
            children.push cfg.child
        cfg.children = null
        cfg.child = null

        w = Widget.setup cfg,
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

    #__________________________________________________ init

    init: ->

        @addCloseButton()  if @config.hasClose
        @addShadeButton()  if @config.hasShade
        if @config.buttons?
            @insertChild(b, { noDown:true }) for b in @config.buttons
        @addTitleBar()     if @config.hasTitle or @config.title

        content = knix.create
            elem:  'div',
            type:  'content'
            parent: @

        @addSizeButton() if @config.hasSize

        @content = content.id

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

        this

    #__________________________________________________ header

    addTitleBar: ->
        knix.create
            type:    "title"
            text:    @config.title
            parent:  this
            onDouble: (event,e) -> console.log 'maxi'; e.getWindow().maximize()

    addCloseButton: ->
        knix.create
            type:    "close"
            noDown:  true
            parent:  this
            # child:
            #     type: 'icon'
            #     icon: 'octicon-x'
            onClick: (event,e) -> e.getWindow().close()

    addShadeButton: ->
        knix.create
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
        btn = knix.create
            type:    "size"
            parent:  this

        dragStart = (drag, event) ->
            return

        dragMove = (drag, event) ->
            sizer = drag.target
            win   = sizer.getWindow()

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
            @config.pos = @absPos()
            @config.size = @getSize()
            @moveTo 0, 0
            @setSize Stage.size()
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
