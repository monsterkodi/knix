# pos = require './pos.coffee'
# log = require './log.coffee'

class Drag

    @config =
        target:  null
        handle:  null
        minPos:  null
        maxPos:  null
        cursor: "move"
        onStart: null
        onMove:  null
        onStop:  null
        doMove:  true
        active:  true

    @create: (cfg) -> new Drag(cfg)

    constructor: (cfg) ->
        Object.extend(this, Drag.config)
        Object.extend(this, cfg)
        @target = document.getElementById(@target) if typeof (@target) is "string"
        return unless @target?
        if @minPos? and @maxPos?
            tempPos = @minPos
            @minPos = @minPos.min(@maxPos)
            @maxPos = tempPos.max(@maxPos)
        @cursorStartPos  = null
        @targetStartPos = null
        @dragging  = false
        @listening = false
        @handle = document.getElementById(@handle) if typeof (@handle) is "string"
        @handle = @target unless @handle?
        @handle.style.cursor = @cursor
        @startListening() if @active
        return

    cancelEvent: (e) ->
        e = (if e then e else window.event)
        e.stopPropagation()  if e.stopPropagation
        e.preventDefault()  if e.preventDefault
        e.cancelBubble = true
        e.cancel = true
        e.returnValue = false
        false

    absPos: (event) ->
        event = (if event then event else window.event)
        if isNaN(window.scrollX)
            return pos(event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
                       event.clientY + document.documentElement.scrollTop + document.body.scrollTop)
        else
            return pos(event.clientX + window.scrollX, event.clientY + window.scrollY)

    dragStart: (event) ->
        return if @dragging or not @listening
        @dragging = true
        @onStart this, event if @onStart?
        @cursorStartPos = @absPos(event)
        style = window.getComputedStyle(@target)
        @targetStartPos = pos(parseInt(style.left), parseInt(style.top))
        @targetStartPos = @targetStartPos.check()
        @eventMove = $(document).on 'mousemove', @dragMove.bind(this)
        @eventUp   = $(document).on 'mouseup',   @dragUp.bind(this)
        @cancelEvent event

    dragMove: (event) ->
        return if not @dragging
        if @doMove
            newPos = @absPos(event)
            newPos = newPos.add(@targetStartPos).sub(@cursorStartPos)
            newPos = newPos.bound(@minPos, @maxPos)
            newPos.apply @target
        if @onMove?
            @onMove this, event
        @cancelEvent event

    dragUp: (event) ->
        @dragStop()
        @cancelEvent event

    dragStop: (event) ->
        return if not @dragging
        @eventMove.stop()
        @eventUp.stop()
        @cursorStartPos = null
        @targetStartPos = null
        @onStop this, event if @onStop?
        @dragging = false
        return

    startListening: ->
        return if @listening
        @listening = true
        @eventDown = @handle.on 'mousedown', @dragStart.bind(this)
        return

    stopListening: (stopCurrentDragging) ->
        return if not @listening
        @eventDown.stop()
        @listening = false
        @dragStop() if stopCurrentDragging and @dragging
        return

# module.exports = Drag

# str = require('./str.coffee')
# con = require('../widgets/console.coffee')

log = ->

    f = printStackTrace()[4].split('@')[1]
    f = f.substr('file:///Users/kodi/Projects/knix/'.length)
    f = f.substr(0,f.length-2)

    # s = ""
    # for arg in arguments
    #     s += str arg
    #     if i < arguments.length-1
    #       s += " "
    s = (str(arg) for arg in arguments).join(" ")

    # console.dir(console)
    # console.trace()
    console.log "%s %c%o", s, 'color:gray', "http:localhost:8888/"+f

    Console.log s

    return this

# module.exports = log

class Pos

    constructor: (@x, @y) ->

    add: (val) ->
        newPos = new Pos(@x, @y)
        if val?
            newPos.x += val.x  unless isNaN(val.x)
            newPos.y += val.y  unless isNaN(val.y)
        newPos

    sub: (val) ->
        newPos = new Pos(@x, @y)
        if val?
            newPos.x -= val.x  unless isNaN(val.x)
            newPos.y -= val.y  unless isNaN(val.y)
        newPos

    min: (val) ->
        newPos = new Pos(@x, @y)
        return newPos unless val?
        newPos.x = val.x  if not isNaN(val.x) and @x > val.x
        newPos.y = val.y  if not isNaN(val.y) and @y > val.y
        newPos

    max: (val) ->
        newPos = new Pos(@x, @y)
        return newPos unless val?
        newPos.x = val.x  if not isNaN(val.x) and @x < val.x
        newPos.y = val.y  if not isNaN(val.y) and @y < val.y
        newPos

    bound: (lower, upper) ->
        newPos = @max(lower)
        newPos.min upper

    check: ->
        newPos = new Pos(@x, @y)
        newPos.x = 0  if isNaN(newPos.x)
        newPos.y = 0  if isNaN(newPos.y)
        newPos

    apply: (element) ->
        element = document.getElementById(element)  if typeof (element) is "string"
        return  unless element?
        element.style.left = @x + "px"  unless isNaN(@x)
        element.style.top = @y + "px"  unless isNaN(@y)
        return

pos = (x,y) -> new Pos x,y
# module.exports = (x,y) -> new Pos(x,y)


class Stage

    @width:  -> @size().width
    @height: -> @size().height

    @size: ->
        s = window.getComputedStyle $('stage_content')
        width:  parseInt s.width
        height: parseInt s.height

# module.exports = Stage


strIndent = "    "

str = (o,indent="",visited=[]) ->
    if o == null
        return "<null>"
    t = typeof o
    if t == 'string'
        return o
    else if t == 'object'
        if o in visited
            if o.id? and typeof o.id == 'string' and o.localName? then return "<" + o.localName + "#" + o.id + ">"
            return "<visited>"
        protoname = o.constructor.name
        if not protoname? or protoname == ""
            if o.id? and typeof o.id == 'string' and o.localName?
                protoname = o.localName + "#"+o.id
            else
                protoname = "object"
        s = "<" + protoname + ">\n"
        visited.push o
        s += (indent+strIndent+k + ": " + str(o[k],indent+strIndent,visited) for k in Object.getOwnPropertyNames(o)).join("\n")
        return s+"\n"
    else if t == 'function'
        return "->"
    else
        return String(o) # plain values
    return "<???>"

# module.exports = str


@newElement = (type) ->
    e = new Element type
    e.identify()
    e

String.prototype.fmt = ->
    vsprintf this, [].slice.call arguments

Element.addMethods
    raise: (element) ->
        if not (element = $(element))
            return
        element.parentElement.appendChild element
        return

# module.exports = this


#   ###   ###  ###  #######     ########  ########  #########
#   ### # ###  ###  ###   ###  ###        ###          ###
#   #########  ###  ###   ###  ###  ####  #######      ###
#   ###   ###  ###  ###   ###  ###   ###  ###          ###
#   ##     ##  ###  #######     #######   ########     ###

# pos  = require '../tools/pos.coffee'
# log  = require '../tools/log.coffee'
# tls  = require '../tools/tools.coffee'
# drag = require '../tools/drag.coffee'

class Widget

    @create: (config, defaults) -> knix.create config, defaults

    @setup: (config, defaults) ->

        cfg = config
        cfg = Object.extend(defaults, config) if defaults?

        #__________________________________________________ initialization

        if not cfg.type?
            console.warn "NO TYPE?"
            cfg.type = 'unknown'

        w = @elem(cfg.elem or "div", cfg.type)              # create element
        w.config = Object.clone(cfg)                        # set config

        knix.mixin w

        w.writeAttribute('id', w.config.id) if w.config.id? # set element id

        for a,v of w.config.attr                            # set element attributes
            w.writeAttribute(a, v)

        if w.config.class                                   # add class names
            for clss in w.config.class.split(' ')
                w.addClassName clss

        #__________________________________________________ CSS setup

        if w.config.style
            w.setStyle w.config.style

        style = $H()
        style.set(s, w.config[s]+'px') for s in ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'] when w.config[s]?
        w.setStyle style.toObject() if style.keys().length

        #__________________________________________________ DOM setup

        w.insert(w.config.text) if w.config.text
        w.addToParent(w.config.parent)
        w.insertChildren()

        #__________________________________________________ position and size

        if w.config.x? or w.config.y?
            w.style.position = 'absolute'
            w.moveTo w.config.x, w.config.y

        w.resize w.config.width, w.config.height if w.config.width? or w.config.height?

        #__________________________________________________ event setup

        if w.config.isMovable
            Drag.create
                target: w
                minPos: pos(undefined,0)
                cursor: null

        @initSlots(w)
        @initConnections(w)
        @initEvents(w)

        if w.config.noDown
            w.on 'mousedown', (event,e) -> event.stopPropagation()

        return w

    # __________________________________________________________________________ elem and widget hierarchy

    @nextWidgetID  = 0

    @elem: (type, clss) -> # create element of <type>, add class <clss> and assign 'unique' id
        e = new Element type
        e.id = "knix_%d".fmt(@nextWidgetID)
        @nextWidgetID += 1
        e.addClassName clss
        e

    # ________________________________________________________________________________ event handling

    @initEvents: (w) ->
        w.on "click",      w.config.onClick  if w.config.onClick
        w.on "mousedown",  w.config.onDown   if w.config.onDown
        w.on "mouseup",    w.config.onUp     if w.config.onUp
        w.on "mouseover",  w.config.onOver   if w.config.onOver
        w.on "mousemove",  w.config.onMove   if w.config.onMove
        w.on "mouseout",   w.config.onOut    if w.config.onOut
        w.on "ondblclick", w.config.onDouble if w.config.onDouble
        this

    # ____________________________________________________________________________ slots

    @initSlots: (w) ->
        slots = w.config.slots
        return if not slots?
        for slot, func of slots
            # log "@initSlots", w.id, slot
            w[slot] = func

    # ____________________________________________________________________________ connections

    @initConnections: (w) ->
        connections = w.config.connect
        return if not connections?
        for connection in connections
            @connect w, connection.signal, connection.slot

    @connect: (w, signal, slot) ->
        # log "@connect", signal, slot
        [signalSender, signalEvent] = @resolveSignal(w, signal)
        slotFunction = @resolveSlot(w, slot)
        if not signalSender? then log "    sender not found!"; return
        if not signalEvent?  then log "    event not found!";  return
        if not slotFunction? then log "    slot not found!";   return
        handler:  signalSender.on signalEvent, slotFunction
        sender:   signalSender
        event:    signalEvent
        receiver: slotFunction

    @resolveSignal: (w, signal) ->
        [event, sender] =  signal.split(':').reverse()
        sender = w.getWindow().getChild(sender) if sender?
        sender = w unless sender?
        [sender, event]

    @resolveSlot: (w, slot) ->
        if typeof slot == 'function'
            return slot
        if typeof slot == 'string'
            [func, receiver] = slot.split(':').reverse()
            receiver = w.getWindow().getChild(receiver) if receiver?
            receiver = w unless receiver?
            return receiver[func].bind(receiver) if receiver[func]?
        null

    addToParent: (p) ->
        p = $(p)
        if p
            parentid = p.id
            p = $(p.content) if p.hasOwnProperty('content')
            if p
                p.insert this
                @config.parent = parentid if @config
        this

    insertChild: (config, defaults) ->
        cfg = config
        cfg = Object.extend defaults, config if defaults?
        cfg.parent = this
        child = knix.create cfg
        child.addToParent this
        child

    insertChildren: ->
        if @config.children
            for cfg in @config.children
                @insertChild(cfg)
        else if @config.child
            @insertChild(@config.child)
        this

    # ____________________________________________________________________________ signals

    emit: (signal, args) ->
        event = new CustomEvent signal,
            bubbles:    true,
            cancelable: true,
            detail:     args
        @dispatchEvent event

    emitSize: ->
        @emit "size",
            width:  @getWidth()
            height: @getHeight()

    # ____________________________________________________________________________ slots

    slotArg: (event, argname='value') ->
        if typeof event == 'object'
            if event.detail[argname]?
                return event.detail[argname]
            else
                return event.detail
        if argname == 'value'
            return parseFloat event
        event

    # ____________________________________________________________________________ hierarchy

    # returns first ancestor element that matches class or id of first argument
    # with no arument: the element with config.parent id or the parent element

    getParent: ->
        args = $A(arguments)
        if args.length
            for a in @ancestors()
                if a.match("#"+args[0]) or a.match("."+args[0])
                    return a
            return
        return $(@config.parent) if @config.parent
        return $(@parentElement.id)

    getWindow: -> # returns this or first ancestor element with class 'window'
        if @hasClassName('window')
            return this
        @getParent('window')

    getChild: (name) -> # returns first child element that matches class or id <name>
        c = Selector.findChildElements(this, ['#'+name, '.'+name])
        return c[0] if c.length
        return null

    close: -> @remove(); return

    clear: ->
        while @hasChildNodes()
            @removeChild @lastChild

    # ____________________________________________________________________________ geometry

    setPos: (p) -> @moveTo p.x, p.y
    setSize: (s) -> @resize s.width, s.height
    getSize: -> return { width: @getWidth(), height: @getHeight() }

    moveTo: (x, y) ->
        @style.left = "%dpx".fmt(x) if x?
        @style.top  = "%dpx".fmt(y) if y?
        return

    moveBy: (dx, dy) ->
        p = @relPos()
        @style.left = "%dpx".fmt(p.x+dx) if dx?
        @style.top  = "%dpx".fmt(p.y+dy) if dy?
        return

    setWidth: (w) ->
        ow = @style.width
        @style.width = "%dpx".fmt(w) if w?
        @emitSize() if ow != @style.width
        return

    setHeight: (h) ->
        oh = @style.height
        @style.height = "%dpx".fmt(h) if h?
        @emitSize() if oh != @style.height
        return

    resize: (w, h) ->
        @setWidth w if w?
        @setHeight h if h?
        return

    percentage: (v) -> # returns the percentage of value v in the [valueMin,valueMax] range
        cfg = @config
        if cfg.hasKnob
            knv = @size2value @getChild('slider-knob').getWidth()
            knp = 100 * (knv - cfg.valueMin) / (cfg.valueMax - cfg.valueMin)
            pct = 100 * (v - cfg.valueMin) / (cfg.valueMax - cfg.valueMin)
            Math.max(knp/2,Math.min(pct,100-knp/2))
        else
            pct = 100 * (v - cfg.valueMin) / (cfg.valueMax - cfg.valueMin)
            Math.max(0,Math.min(pct,100))

    size2value: (s) -> # returns the value in the [valueMin,valueMax] range that lies at point s
        @config.valueMin + (@config.valueMax - @config.valueMin) * s / @innerWidth()

    innerWidth:  -> @getLayout().get("padding-box-width")
    innerHeight: -> @getLayout().get("padding-box-height")
    minWidth:    -> w = parseInt @getStyle('min-width' ); if w then w else 0
    minHeight:   -> h = parseInt @getStyle('min-height'); if h then h else 0
    maxWidth:    -> w = parseInt @getStyle('max-width' ); if w then w else Number.MAX_VALUE
    maxHeight:   -> h = parseInt @getStyle('max-height'); if h then h else Number.MAX_VALUE
    relPos:      -> o = @positionedOffset(); pos o.left, o.top
    absPos:      -> o = @cumulativeOffset(); s = @cumulativeScrollOffset(); pos o.left - s.left, o.top - s.top

    # ____________________________________________________________________________ tools

    format: (s) -> return @config.format.fmt(s) if @config.format?; String(s)
    strip0: (s) -> return s.replace(/(0+)$/,'').replace(/([\.]+)$/,'') if s.indexOf('.') > -1; String(s)
    round: (v) -> # rounds v to multiples of valueStep
        r = v
        if @config.valueStep?
            d = v - Math.round(v/@config.valueStep)*@config.valueStep
            r -= d
        r
    clamp: (v) -> # clamps v to the [valueMin,valueMax] range
        c = v
        c = Math.min(c, @config.valueMax) if @config.valueMax?
        c = Math.max(c, @config.valueMin) if @config.valueMin?
        c

#module.exports = Widget


#    #######   #######   ###   ###    #######   #######   ###      ########
#   ###       ###   ###  ####  ###  ###        ###   ###  ###      ###
#   ###       ###   ###  ### # ###   #######   ###   ###  ###      #######
#   ###       ###   ###  ###  ####        ###  ###   ###  ###      ###
#    #######   #######   ###   ###   #######    #######   #######  ########

# Widget = require './widget.coffee'

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

        # stg = require '../tools/stage.coffee'

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

# module.exports = Console


#   ###   ###   #######   ###      ###   ###  ########
#   ###   ###  ###   ###  ###      ###   ###  ###
#   ###   ###  #########  ###      ###   ###  #######
#    ##   ##   ###   ###  ###      ###   ###  ###
#      ###     ###   ###  #######   #######   ########

# Widget = require './widget.coffee'

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

# module.exports = Value


#   ###   ###  ###  ###   ###  #######     #######   ###   ###
#   ### # ###  ###  ####  ###  ###   ###  ###   ###  ### # ###
#   #########  ###  ### # ###  ###   ###  ###   ###  #########
#   ###   ###  ###  ###  ####  ###   ###  ###   ###  ###   ###
#   ##     ##  ###  ###   ###  #######     #######   ##     ##

# Widget = require './widget.coffee'

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

# module.exports = Window


#   ###  ###  ###   ###  ###  ###   ###
#   ### ###   ####  ###  ###    #####
#   #####     ### # ###  ###     ###
#   ### ###   ###  ####  ###    #####
#   ###  ###  ###   ###  ###  ###   ###

# pos     = require './tools/pos.coffee'
# log     = require './tools/log.coffee'
# tls     = require './tools/tools.coffee'
# drag    = require './tools/drag.coffee'

# Widget  = require './widgets/widget.coffee'
# Window  = require './widgets/window.coffee'
# Value   = require './widgets/value.coffee'
# Console = require './widgets/console.coffee'

class knix

    # ________________________________________________________________________________ element creation

    @init: -> log 'knix 0.1.1' #window.knix = Knix

    @create: (config, defaults) ->

        cfg = config
        cfg = Object.extend(defaults, config) if defaults?

        switch cfg.type
            when 'svg', 'canvas', 'slider', 'button', 'input', 'icon' then @[cfg.type] cfg
            when 'console' then Console.create cfg
            when 'value'   then Value.create   cfg
            when 'window'  then Window.create  cfg
            when 'widget'  then Widget.setup   cfg
            else
                console.log 'fallback to widget for type', cfg.type
                Widget.setup cfg, { type: 'widget' }

    @setup: (config, defaults) -> Widget.setup config, defaults

    # takes values from config and overwrites those in defaults

    @def: (config, defaults) -> Object.extend(defaults, config)

    @mixin: (w) -> # merge in object functions

        Object.extend w, switch w.config.type
            when 'console' then Console.prototype
            when 'value'   then Value.prototype
            when 'window'  then Window.prototype
            else Widget.prototype

    # ________________________________________________________________________________ get

    # shortcut to call any of the type functions below (@window, @button, @slider, ...)
    # uses @window if no type is specified and sets the stage_content as default parent

    @get: (cfg) ->
        @create cfg, { type:'window', parent: 'stage_content'}

    @closeAll: -> # close all windows
        $$(".window").each (win) ->
            win.close()
            return
        return

    # ________________________________________________________________________________ canvas

    @canvas: (cfg) ->
        cvs = @setup cfg,
            elem: 'canvas'
        fbc = new fabric.StaticCanvas cvs.id
        fbc.setWidth(cfg.width) if cfg.width?
        fbc.setHeight(cfg.height) if cfg.height?
        cvs.fc = fbc
        cvs

    # ________________________________________________________________________________ svg

    @svg: (cfg) ->
        svg = @setup cfg,
            elem: 'svg'
        svg.s = SVG('stage_svg')
        svg

    # ________________________________________________________________________________ slider

    @slider: (cfg) ->

        sliderFunc = (drag, event) ->
            sld = drag.target
            sps = sld.absPos()
            wdt = event.clientX-sps.x
            v   = sld.size2value wdt
            sld.setValue(v)

        children = []
        if cfg.hasBar or !cfg.hasKnob
            children.push
                type:    'slider-bar'
        if cfg.hasKnob
            children.push
                type:    'slider-knob'

        slider = @setup cfg,
            type:       'slider'
            value:      0
            valueMin:   0
            valueMax:   100
            horizontal: true
            children:   \
            [
                type:       'relative'
                children:   children
            ]

        slider.setValue = (arg) ->
            v = @slotArg(arg, 'value')
            if isNaN v
                log @id, 'farz', arg.detail
                return
            v = @clamp(v)
            @config.value = v
            pct = @percentage v
            slb = @getChild('slider-bar')
            if slb
                slb.style.width = "%d%%".fmt(pct)

            knb = @getChild('slider-knob')
            if knb
                knb.style.left = "%d%%".fmt(pct)
                knb.style.marginLeft = "-%dpx".fmt knb.getWidth()/2
            @emit 'onValue', value:v
            log @id, v
            return

        slider.setValue(slider.config.value)

        # this is only to fix a minor glitch in the knob display, might cost too much performance:
        sizeCB = (event,e) -> slider.setValue(slider.config.value)
        win = slider.getWindow()
        win.on "size", sizeCB if win

        Drag.create
            cursor:     'ew-resize'
            target:     slider
            doMove:     false
            onMove:     sliderFunc
            onStart:    sliderFunc

        slider

    # ________________________________________________________________________________ button

    @button: (cfg) ->
        @setup cfg,
            type:     'button'
            noDown:   true
            minWidth: 50

    # ________________________________________________________________________________ icon

    @icon: (cfg) ->
        @setup cfg,
            child:
                elem:   'span'
                type:   'octicon'
                class:   cfg.icon


    # ________________________________________________________________________________ input

    @input: (cfg) ->
        inp = @setup cfg,
            elem: 'input'
            type: 'input'

        inp.setAttribute "size", 6
        inp.setAttribute "type", "text"
        inp.setAttribute "inputmode", "numeric"
        inp.getValue = -> parseFloat(@value)
        inp

# module.exports = Knix

# log = require './tools/log.coffee'
# wid = require './knix.coffee'

document.observe "dom:loaded", ->

    # _________________________________________________________________________ svg test

    wid = knix

    wid.init()

    svg = wid.get
        id:    'stage_svg'
        type:  'svg'

    set = svg.s.set()
    p = svg.s.path()
    p   .M  100, 100
        .Q  200, 100, 200, 200
        .Q  200, 300, 300, 300
    set.add p
    set.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
    set.stroke(color: "rgba(255,150,0,0.2)", width: 16).fill('none')

    # _________________________________________________________________________ canvas test

    # sc = wid.get
    #     id:      'stage_canvas'
    #     type:    'canvas'
    #     width:   parseInt window.innerWidth
    #     height:  parseInt window.innerHeight
    #
    # p = new fabric.Path('M 0 0 L 200 100 L 170 200')
    # p.set
    #     left: 20, top: 120, fill: '',
    #     stroke: 'black', strokeWidth: 20, strokeLineCap: 'round', strokeLineJoin: 'round'
    #     opacity: 0.5
    # sc.fc.add(p)
    #
    # resizeStageCanvas = (x,y) -> sc.fc.setWidth x; sc.fc.setHeight y
    #
    # window.onresize = (event) ->
    #     resizeStageCanvas parseInt(window.innerWidth), parseInt(window.innerHeight)

    # _________________________________________________________________________ widget test

    wid.get
        type:   'button'
        id:     'hello'
        text:   'hello'
        parent: 'menu'
        onClick: ->
            log 'hello!'
            wid.get
                y:         30
                title:     'hello'
                hasSize:   true
                width:     130
                minWidth:  130
                minHeight: 150
                maxHeight: 150
                children: \
                [
                    id:         'slider_1'
                    type:       'slider'
                    value:      50.0
                    valueStep:  10
                ,
                    id:         'slider_2'
                    type:       'slider'
                    hasKnob:    true
                    hasBar:     true
                    value:      70.0
                    valueMin:   0.0
                    valueMax:   100.0
                    valueStep:  1
                ,
                    type:       'value'
                    value:      50
                    valueMin:   -20
                    valueMax:   80
                    valueStep:  1
                    format:     "%3.2f"
                    connect: \
                    [
                        signal: 'slider_2:onValue'
                        slot:   'setValue'
                    ,
                        signal: 'onValue'
                        slot:   'slider_1:setValue'
                    # ,
                    #     signal: 'slider_1:onValue'
                    #     slot:   (event) ->
                    #         log "---", event.detail.value
                    ]
                ,
                    type:       'relative'
                    children:   \
                    [
                        type:       'button'
                        text:       'ok'
                        class:      'top-left'
                        onClick:    -> @getWindow().getChild('no').close()
                    ,
                        type:       'button'
                        id:         'no'
                        text:       'no'
                        class:      'top-right'
                        onClick:    -> @getWindow().close()
                    ]
                ]

    @stageButtons = () ->

        wid.get
            id:         'slider_3'
            type:       'slider'
            hasKnob:    false
            hasBar:     false
            width:      200
            x:          150
            y:          30
            valueMin:   0
            valueMax:   255
            connect: \
            [
                signal: 'onValue'
                slot:   (v) ->
                    v = @slotArg(v)
                    c = 'rgba(%d,0,0,0.2)'.fmt(v)
                    # sc = $('stage_canvas').fc
                    # sc.setBackgroundColor(c, sc.renderAll.bind(sc))
            ]

        wid.get
            type:       'slider'
            hasKnob:    true
            hasBar:     true
            width:      200
            x:          150
            y:          60

        wid.get
            type:       'slider'
            hasKnob:    true
            hasBar:     false
            width:      200
            x:          150
            y:          90

        wid.get
            type:       'value'
            width:      200
            x:          150
            y:          120

        wid.get
            type:       'button'
            text:       'del'
            width:      200
            x:          150
            y:          150
            onClick:    wid.closeAll

    wid.get
        type:   'button'
        text:   'del'
        parent: 'footer'
        onClick: -> wid.closeAll()

    $('hello').click()

    # Console = require './widgets/console.coffee'
    Console.menu()
    Console.create()

    document.stageButtons()

    return
