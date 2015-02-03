
#    #######   #######   ###   ###    #######   #######   ###      ########
#   ###       ###   ###  ####  ###  ###        ###   ###  ###      ###
#   ###       ###   ###  ### # ###   #######   ###   ###  ###      #######
#   ###       ###   ###  ###  ####        ###  ###   ###  ###      ###
#    #######   #######   ###   ###   #######    #######   #######  ########

class Console extends Widget

    @log: (s) ->

        $$(".console").each (e) ->
            e.insert "<pre>"+s+"</pre>"
            e.getWindow().scrollToBottom()
        this

    @menu: ->

        Widget.create
            type:   'button'
            id:     'open_console'
            text:   'console'
            parent: 'menu'
            onClick: -> Console.create()

    @create: (cfg) ->

        w2 = Stage.size().width/2
        h2 = Stage.size().height/2

        con = knix.get
            title:    'console'
            class:    'console-window'
            x:        w2
            y:        0
            width:    w2-4
            height:   h2-4
            content:  'scroll'
            buttons:  \
            [
                type:    "window-button-right"
                child:
                    type: 'icon'
                    icon: 'octicon-trashcan'
                onClick: (event,e) ->
                    e.getWindow().getChild('console').clear()
            ,
                type:    "window-button-left"
                child:
                    type: 'icon'
                    icon: 'octicon-diff-added'
                onClick: (event,e) -> e.getWindow().maximize()
            ]
            child:
                class:  'console'
                text:   'knix 0.1.0'
                noDown: true


#   ###   ###   #######   ###      ###   ###  ########
#   ###   ###  ###   ###  ###      ###   ###  ###
#   ###   ###  #########  ###      ###   ###  #######
#    ##   ##   ###   ###  ###      ###   ###  ###
#      ###     ###   ###  #######   #######   ########

class Value extends Widget

    @create: (cfg) ->

        value = Widget.setup cfg,
            type:       'value'
            value:      0
            horizontal: true
            slots:      \
            {
                setValue: (arg) ->
                    v = @format(@round(@clamp(@slotArg(arg, 'value'))))
                    @input.value = @strip0 v
                    @emit 'onValue',
                        value: v
            }
            child:
                elem:   'table'
                type:   'value-table'
                onDown: (event,e) -> event.stopPropagation()
                child:
                    elem:   'tr'
                    type:   'value-row'
                    children: \
                    [
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-left'
                            onClick: (event,e) -> @getParent('value').incr '-'
                    ,
                        elem: 'td'
                        type: 'value-content'
                        child:
                            type:   'input'
                            class:  'value-input'
                    ,
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-right'
                        onClick: (event,e) -> @getParent('value').incr '+'
                    ]

        value.input = value.getChild 'value-input'

        value.incr = (d) ->
            if d in ['up', '+', '++'] then d = 1
            else if d in ['down', '-', '--'] then d = -1
            if @config.valueStep? then step = @config.valueStep else step = 1
            @setValue @input.getValue() + step*d

        value.on 'keypress', (event,e) ->
            if event.key in ['Up', 'Down']
                @incr event.key.toLowerCase()
                event.stop()
                return
            if event.key not in '0123456789-.'
                if event.key.length == 1
                    event.stop()
                    return
            if event.key in '-.'
                if @input.value.indexOf(event.key) > -1
                    event.stop()
                    return

        value.on 'change', (event, e) ->
            log 'value on change', e.id, e.getValue()
            @setValue e.getValue()

        value.setValue value.config.value # i don't want to know how many good-coding-style-rules are broken here :)
        value                             # but at least it is not value.value value.value.value                  :)


#   ###   ###  ###  ###   ###  #######     #######   ###   ###
#   ### # ###  ###  ####  ###  ###   ###  ###   ###  ### # ###
#   #########  ###  ### # ###  ###   ###  ###   ###  #########
#   ###   ###  ###  ###  ####  ###   ###  ###   ###  ###   ###
#   ##     ##  ###  ###   ###  #######     #######   ##     ##

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

        # Drag = require '../tools/drag.coffee'

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
            # stg = require('../tools/stage.coffee')
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
