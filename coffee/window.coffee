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

    init: (cfg, defs) =>

        cfg = _.def cfg, defs

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
            resize:    true
            isMovable: true
            isShaded:  false
            onDown:    @raise

        @initWindow()
        @config.children = children
        @insertChildren()
        @config.connect = connect
        @initConnections()
        @layoutChildren()

        if cfg.popup
            knix.addPopup @

        if cfg.center
            @moveTo Math.max(0,Stage.size().width/2 - @getWidth()/2), Math.max(0,Stage.size().height/2 - @getHeight()/2)
        @

    #__________________________________________________ init window

    initWindow: =>

        @addCloseButton()  if @config.hasClose
        @addShadeButton()  if @config.hasShade
        if @config.buttons?
            @insertChild(b, { noDown:true }) for b in @config.buttons
        @addTitleBar()     if @config.hasTitle or @config.title

        content = knix.create
            elem:  'div',
            type:  'content'
            parent: @elem.id

        @addSizeButton() if @config.resize

        @content = content.elem.id

        if @config.content == 'scroll'

            content.elem.setStyle
                position:   'relative'
                overflow:   'scroll'
                width:      '100%'
                height:     "%dpx".fmt(@contentHeight())

        @elem.on 'size', @sizeWindow
        @

    #__________________________________________________ header

    addTitleBar: =>
        log 'add title'
        t = knix.create
            type:       'title'
            text:       @config.title
            parent:     this
        t.elem.ondblclick = @maximize

    addCloseButton: =>
        knix.create
            type:    'close'
            noDown:  true
            parent:  this
            child:
                type: 'icon'
                icon: 'octicon-x'
            onClick: (event,e) -> e.getWindow().close()

    addShadeButton: =>
        knix.create
            type:    "shade"
            noDown:  true
            parent:  this
            child:
                type: 'icon'
                icon: 'octicon-dash'
            onClick: (event,e) -> e.getWindow().shade()

    scrollToBottom: =>
        content = $(@content)
        content.scrollTop = content.scrollHeight

    # ____________________________________________________________________________ layout

    stretchWidth: =>
        tag 'layout', 'todo'
        log 'add horizontal stretching handles and get rid of addSize crap!'

    sizeWindow: =>

        if @config.content == 'scroll'
            content = $(@content).widget
            content.setWidth  @contentWidth()
            content.setHeight @contentHeight()

        for e in @elem.descendants()
            e.widget?.onWindowSize?()

    # ____________________________________________________________________________ size

    addSizeButton: =>
        btn = knix.create
            type:    'size'
            parent:  this

        Drag.create
            target:  btn.elem
            onStart: @sizeStart
            onMove:  @sizeMove
            onStop:  @sizeStop
            cursor:  'nwse-resize'
        btn

    sizeStart: (drag, event) =>
        @config.isMaximized = false
        drag.target.style.opacity = '0.0'

    sizeMove: (drag, event) =>
        sizer = drag.target.widget

        wpos = @absPos()
        spos = sizer.absPos()

        hdr = @headerSize()

        wdt = spos.x-wpos.x+sizer.getWidth()
        wdt = Math.max(hdr*2, wdt)
        wdt = Math.max(@minWidth(), wdt)
        wdt = Math.min(@maxWidth(), wdt)

        hgt = spos.y-wpos.y+sizer.getHeight()
        hgt = Math.max(hdr+sizer.getHeight(), hgt)
        hgt = Math.max(@minHeight(), hgt)
        hgt = Math.min(@maxHeight(), hgt)

        @resize(wdt, hgt)

        return

    sizeStop: (drag, event) =>
        sizer = drag.target
        sizer.setStyle
            bottom: '0px'
            right: '0px'
            left: ''
            top: ''
            opacity: '1.0'

    maximize: =>
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

    raise: (event,e) =>
        if e?.getWindow? and e.getWindow() not in knix.popups
            knix.closePopups()
        scrolltop = $(@content).scrollTop
        @elem.parentElement.appendChild this.elem
        $(@content).scrollTop = scrolltop

    headerSize: (box="border-box-height") =>
        children = Selector.findChildElements(@elem, [ '*.title', '*.close', '*.shade' ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get(box)
            return height if height
            i++
        0

    contentWidth:  => @elem.getLayout().get('padding-box-width')
    contentHeight: => @elem.getLayout().get('padding-box-height') - @headerSize()

    shade: =>
        size = @getChild 'size'
        if @config.isShaded
            @elem.setStyle('min-height': @config.minHeight+'px')
            @setHeight @config.height
            @config.isShaded = false
            size.elem.show() if size
            $(@content).show()
        else
            @config.height = @getHeight()
            @elem.setStyle('min-height': '0px')
            @setHeight @headerSize()
            @config.isShaded = true
            size.elem.hide() if size
            $(@content).hide()

        @emit 'shade',
            shaded: @config.isShaded

        return

    close: =>
        log 'close'
        if @config.popup?
            knix.delPopup @
        super
