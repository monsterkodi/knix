###

000   000  000  0000000     0000000   00000000  000000000
000 0 000  000  000   000  000        000          000   
000000000  000  000   000  000  0000  0000000      000   
000   000  000  000   000  000   000  000          000   
00     00  000  0000000     0000000   00000000     000   

###

class Widget

    constructor: (config, defaults) -> @init config, defaults

    init: (config, defaults) =>

        cfg = _.def(config, defaults)

        #__________________________________________________ initialization

        if not cfg.type?
            console.warn "NO TYPE?"
            cfg.type = 'unknown'

        if not cfg.elem?
            cfg.elem = (cfg.attr?.href? or cfg.href? or null) and 'a'
            cfg.elem ?= 'div'                               # div is default element

        @elem = Widget.elem(cfg.elem, cfg.type)             # create element
        @elem.widget = @                                    # let this be the elements widget
        @config = cfg                                       # set config

        @elem.getWindow     = @getWindow
        @elem.getChild      = @getChild
        @elem.getParent     = @getParent
        @elem.toggleDisplay = @toggleDisplay
        @elem.relPos = -> o = @positionedOffset(); pos o.left, o.top

        @elem.writeAttribute('id', @config.id) if @config.id? # set element id

        for a,v of @config.attr                             # set element attributes
            @elem.writeAttribute(a, v)

        for k in ['href']
            @elem.writeAttribute(k, @config[k]) if @config[k]?

        if @config.class                                    # add class names
            for clss in @config.class.split(' ')
                @elem.addClassName clss

        #__________________________________________________ CSS setup

        if @config.style
            @elem.setStyle @config.style

        style = $H()
        for s in ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'] when @config[s]?
            style.set(s, @config[s]+'px')
        @elem.setStyle style.toObject() if style.keys().length

        #__________________________________________________ DOM setup

        @insertChildren()
        @elem.insert(@config.text) if @config.text?
        @addToParent(@config.parent) if @config.parent?

        #__________________________________________________ position and size

        if @config.pos?
            @config.x = @config.pos.x if @config.pos.x?
            @config.y = @config.pos.y if @config.pos.y?

        if @config.x? or @config.y?
            @elem.style.position = 'absolute'
            @moveTo @config.x, @config.y

        @resize @config.width, @config.height if @config.width? or @config.height?

        #__________________________________________________ event setup

        @addMovement()

        @initSlots()
        @initConnections()
        @initEvents()

        if @config.noDown
            @elem.on 'mousedown', (event,e) ->

                if e?.getWindow? and e.getWindow() not in knix.popups
                    log 'noDown close popups'
                    knix.closePopups()
                else
                    event.stopPropagation()
        @

    # ________________________________________________________________________________ event handling

    initEvents: =>
        @elem.on "click",      @config.onClick  if @config.onClick?
        @elem.on "mousedown",  @config.onDown   if @config.onDown?
        @elem.on "mouseup",    @config.onUp     if @config.onUp?
        @elem.on "mouseover",  @config.onOver   if @config.onOver?
        @elem.on "mousemove",  @config.onMove   if @config.onMove?
        @elem.on "mouseout",   @config.onOut    if @config.onOut?
        @elem.on "ondblclick", @config.onDouble if @config.onDouble?
        @

    # ____________________________________________________________________________ slots

    initSlots: =>
        slots = @config.slots
        return if not slots?
        for slot, func of slots
            @[slot] = func
        @

    # ____________________________________________________________________________ connections

    connector: (name) =>
        tag 'Connection'
        log name
        for t in ['slot', 'signal', 'in', 'out']
            for e in @elem.select('.'+t)
                if e.hasClassName 'connector'
                    # tag 'Connection'
                    # log 'found connector element', t, e.widget.config[t]
                    if e.widget.config[t] == name or e.widget.config[t]+':'+t == name
                        return e.widget
            # warn 'no elem with class', name
        error 'connector not found!', name
        undefined

    initConnections: =>
        connections = @config.connect
        return if not connections?
        for connection in connections
            @connect connection.signal, connection.slot
        @

    connect: (signal, slot) =>
        tag 'Connection'
        log @elem.id, signal, slot
        [signalSender, signalEvent] = @resolveSignal(signal)
        slotFunction = @resolveSlot(slot)
        if not signalSender?
            error "sender not found!"
        if not signalEvent?
            error "event not found!"
        if not slotFunction?
            error "slot not found!"
        handler:  signalSender.elem.on signalEvent, slotFunction
        sender:   signalSender
        event:    signalEvent
        receiver: slotFunction

    resolveSignal: (signal) =>
        [event, sender] = signal.split(':').reverse()
        if sender?
            sender = @getChild(sender)
            sender = @getWindow()?.getChild(sender) unless sender?
        sender = @ unless sender?
        [sender, event]

    resolveSlot: (slot) =>
        if typeof slot == 'function'
            return slot
        if typeof slot == 'string'
            [func, receiver] = slot.split(':').reverse()
            if receiver?
                receiver = @getChild(receiver)
                receiver = @getWindow()?.getChild(receiver) unless receiver?
            receiver = @ unless receiver?
            if receiver[func]?
                if typeof receiver[func] == 'function'
                    return receiver[func].bind(receiver)
                else
                    error 'not a function'
        error 'cant resolve slot:', slot, typeof slot
        null

    # ____________________________________________________________________________ signals

    emit: (signal, args) =>
        event = new CustomEvent signal,
            bubbles:    true,
            cancelable: true,
            detail:     args
        @elem.dispatchEvent event
        @

    emitSize: =>
        @emit 'size',
            width:  @getWidth()
            height: @getHeight()
        @

    emitMove: =>
        @emit 'move',
            pos: @absPos()
        @

    # ____________________________________________________________________________ elements

    @nextWidgetID  = 0

    @elem: (type, clss) => # create element of <type>, add class <clss> and assign 'unique' id
        e = new Element type
        e.id = "%s.%d".fmt(clss, @nextWidgetID)
        @nextWidgetID += 1
        e.addClassName clss
        e

    # ____________________________________________________________________________ hierarchy

    addToParent: (p) =>
        if not @elem?
            error 'no @elem?'
            return this
        if not p?
            error 'no p?'
            return this
        parentElement = $(p.content) if p.content?
        parentElement = p.elem unless parentElement
        parentElement = $(p) unless parentElement
        if not parentElement?
            error 'no element?', p
            return this
        parentElement.insert @elem
        @config.parent = parentElement.id
        @

    insertChild: (config, defaults) =>
        child = knix.create config, defaults
        child.addToParent @
        child

    insertChildren: =>
        if @config.child
            @insertChild(@config.child)
        if @config.children
            for cfg in @config.children
                @insertChild(cfg)
        @

    # returns first ancestor element that matches class or id of first argument
    # with no arument: the element with config.parent id or the parent element

    getParent: =>
        args = $A(arguments)
        if args.length
            anc = @elem.ancestors()
            for a in anc
                if a.match("#"+args[0]) or a.match("."+args[0])
                    return a.widget
            return
        return $(@config.parent).widget if @config.parent
        return $(@parentElement.id).wiget

    getWindow: => # returns this or first ancestor element with class 'window'
        if @elem.hasClassName('window')
            return this
        @getParent('window')

    getChild: (classOrID) => # returns first child element that matches class or element id
        c = @elem.select('#'+classOrID, '.'+classOrID)
        return c[0].widget if c.length
        undefined

    close: =>
        log 'close', @elem.id
        @emit 'close'
        # @elem.purge()
        @elem.remove()
        @elem = null
        @config = null
        undefined

    clear: =>
        while @elem.hasChildNodes()
            @elem.removeChild @elem.lastChild
        @

    toggleDisplay: =>
        if @elem.visible()
            @elem.hide()
        else
            @elem.show()

    # ____________________________________________________________________________ geometry

    setPos: (p) => @moveTo p.x, p.y

    moveTo: (x, y) =>
        @elem.style.left = "%dpx".fmt(x) if x?
        @elem.style.top  = "%dpx".fmt(y) if y?
        @emitMove()
        @

    moveBy: (dx, dy) =>
        p = @relPos()
        @elem.style.left = "%dpx".fmt(p.x+dx) if dx?
        @elem.style.top  = "%dpx".fmt(p.y+dy) if dy?
        @emitMove()
        @

    setWidth: (w) =>
        if w?
            ow = @elem.style.width
            @elem.style.width = "%dpx".fmt(w)

            diff = @getWidth() - w
            @elem.style.width = "%dpx".fmt(w - diff) if diff

            @emitSize() if ow != @elem.style.width
        @

    setHeight: (h) =>
        if h?
            oh = @elem.style.height
            @elem.style.height = "%dpx".fmt(h) if h?

            diff = @getHeight() - h
            @elem.style.height = "%dpx".fmt(h - diff) if diff

            @emitSize() if oh != @elem.style.height
        @

    resize: (w, h) =>
        @setWidth w
        @setHeight h
        @

    setSize: (s) => @resize s.width, s.height
    getSize: => return { width: @getWidth(), height: @getHeight() }
    getWidth: => @elem.getWidth()
    getHeight: => @elem.getHeight()

    percentage: (v) => # returns the percentage of value v in the [minValue,maxValue] range
        cfg = @config
        pct = 100 * (v - cfg.minValue) / (cfg.maxValue - cfg.minValue)
        Math.max(0,Math.min(pct,100))

    size2value: (s) => # returns the value in the [minValue,maxValue] range that lies at point s
        @config.minValue + (@config.maxValue - @config.minValue) * s / @innerWidth()

    innerWidth:  => @elem.getLayout().get("padding-box-width")
    innerHeight: => @elem.getLayout().get("padding-box-height")
    minWidth:    => w = parseInt @elem.getStyle('min-width' ); if w then w else 0
    minHeight:   => h = parseInt @elem.getStyle('min-height'); if h then h else 0
    maxWidth:    => w = parseInt @elem.getStyle('max-width' ); if w then w else Number.MAX_VALUE
    maxHeight:   => h = parseInt @elem.getStyle('max-height'); if h then h else Number.MAX_VALUE
    relPos:      => o = @elem.positionedOffset(); pos o.left, o.top
    absPos:      => o = @elem.cumulativeOffset(); s = @elem.cumulativeScrollOffset(); pos o.left - s.left, o.top - s.top
    absCenter:   => @absPos().add(pos(@elem.getWidth(),@elem.getHeight()).mul(0.5))

    # ____________________________________________________________________________ movement

    addMovement: =>
        if @config.isMovable
            Drag.create
                target: @elem
                minPos: pos(undefined,0)
                onMove: @emitMove
                onStart: StyleSwitch.togglePathFilter
                onStop:  StyleSwitch.togglePathFilter
                cursor: null

    # ____________________________________________________________________________ layout

    stretchWidth: =>
        tag 'layout'
        log @
        @elem.style.width = '50%'

    layoutChildren: =>
        e = @config.content? and $(@config.content) or @elem
        if not @config.width?
            if e.widget.config.resize?
                if e.widget.config.resize == 'horizontal' or e.widget.config.resize == true
                    e.widget.stretchWidth()
            else
                @setWidth e.getWidth()
        if not @config.height?
            @setHeight e.getHeight()
        if @config.resize
            e.style.minWidth  = "%dpx".fmt(e.getWidth()) if not @config.minWidth?
            e.style.minHeight = "%dpx".fmt(e.getHeight()) if not @config.minHeight?
            if @config.resize == 'horizontal'
                e.style.maxHeight = "%dpx".fmt(e.getHeight()) if not @config.maxHeight?
            if @config.resize == 'vertical'
                e.style.maxWidth = "%dpx".fmt(e.getWidth()) if not @config.maxWidth?
