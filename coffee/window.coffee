###

    000   000  000  000   000  0000000     0000000   000   000
    000 0 000  000  0000  000  000   000  000   000  000 0 000
    000000000  000  000 0 000  000   000  000   000  000000000
    000   000  000  000  0000  000   000  000   000  000   000
    00     00  000  000   000  0000000     0000000   00     00

###

class Window extends Widget

    constructor: (config={}, defaults) ->
        super config, defaults

    #__________________________________________________ init

    init: (cfg, defs) ->

        cfg = _.def(cfg, defs)

        children = cfg.children
        if cfg.child
            if not children? then children = []
            children.push cfg.child
        cfg.children = null
        cfg.child = null

        connect = cfg.connect
        cfg.connect = null

        super cfg,
            type:     'window'
            parent:   'stage_content'
            hasClose:  true
            hasShade:  true
            hasSize:   true
            isMovable: true
            onDown:    (event,e) -> e.getWindow().raise()

        @initWindow()
        @config.children = children
        @insertChildren()
        @config.connect = connect
        @initConnections()

        if cfg.center
            @moveTo Math.max(0,Stage.size().width/2 - @getWidth()/2), Math.max(0,Stage.size().height/2 - @getHeight()/2)

        @

    #__________________________________________________ init window

    initWindow: ->

        @addCloseButton()  if @config.hasClose
        @addShadeButton()  if @config.hasShade
        if @config.buttons?
            @insertChild(b, { noDown:true }) for b in @config.buttons
        @addTitleBar()     if @config.hasTitle or @config.title

        content = knix.create
            elem:  'div',
            type:  'content'
            parent: @elem.id

        @addSizeButton() if @config.hasSize

        @content = content.elem.id

        if @config.content == 'scroll'

            @elem.on "size", (event,e) ->
                win = e.getWindow()
                content = $(win.content).widget
                content.setWidth  win.contentWidth()
                content.setHeight win.contentHeight()

            content.elem.setStyle
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
            drag.target.getWindow().config.isMaximized = false
            return

        dragMove = (drag, event) ->
            sizer = drag.target.widget
            windw = sizer.getWindow()

            wpos = windw.absPos()
            spos = sizer.absPos()

            hdr = windw.headerSize()

            wdt = spos.x-wpos.x+sizer.getWidth()
            wdt = Math.max(hdr*2, wdt)
            wdt = Math.max(windw.minWidth(), wdt)
            wdt = Math.min(windw.maxWidth(), wdt)

            hgt = spos.y-wpos.y+sizer.getHeight()
            hgt = Math.max(hdr+sizer.getHeight(), hgt)
            hgt = Math.max(windw.minHeight(), hgt)
            hgt = Math.min(windw.maxHeight(), hgt)

            windw.resize(wdt, hgt)

            return

        dragStop = (drag, event) ->
            sizer = drag.target
            sizer.setStyle
                bottom: '0px'
                right: '0px'
                left: ''
                top: ''

        Drag.create
            target:  btn.elem
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
            menuHeight = $('menu').getHeight()
            @moveTo 0, menuHeight+2
            @resize Stage.size().width, Stage.size().height-menuHeight-2
            @config.isMaximized = true

    raise: ->
        ct = $(@content)
        st = ct.scrollTop
        @elem.parentElement.appendChild this.elem
        ct.scrollTop = st

    headerSize: (box="border-box-height") ->
        children = Selector.findChildElements(@elem, [ "*.title", "*.close", "*.shade" ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get(box)
            return height if height
            i++
        0

    contentWidth: ->
        @elem.getLayout().get("padding-box-width")

    contentHeight: ->
        @elem.getLayout().get("padding-box-height") - @headerSize()

    shade: ->
        size = @getChild 'size'
        if @config.isShaded
            @elem.setStyle('min-height': @config.minHeight+'px')
            @setHeight @config.height
            @config.isShaded = false
            size.elem.show() if size
        else
            @config.height = @getHeight()
            @elem.setStyle('min-height': '0px')
            @setHeight @headerSize("padding-box-height")
            @config.isShaded = true
            size.elem.hide() if size
        return
