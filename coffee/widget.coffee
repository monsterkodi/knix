###

    000   000  000  0000000     00000000  00000000  000000000
    000 0 000  000  000   000  000        000          000
    000000000  000  000   000  000  0000  0000000      000
    000   000  000  000   000  000   000  000          000
    00     00  000  0000000     0000000   00000000     000

###

class Widget

    @create: (config, defaults) -> knix.create config, defaults

    @setup: (config, defaults) ->

        cfg = _.def(config, defaults)

        #__________________________________________________ initialization

        if not cfg.type?
            console.warn "NO TYPE?"
            cfg.type = 'unknown'

        if not cfg.elem?
            cfg.elem = (cfg.attr?.href? or cfg.href? or null) and 'a'
            cfg.elem ?= 'div'                               # div is default element

        w = @elem(cfg.elem, cfg.type)                       # create element
        w.config = cfg                                      # set config

        knix.mixin w

        w.writeAttribute('id', w.config.id) if w.config.id? # set element id

        for a,v of w.config.attr                            # set element attributes
            w.writeAttribute(a, v)

        for k in ['href']
            w.writeAttribute(k, w.config[k]) if w.config[k]?

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
        w.insertChildren()
        w.addToParent(w.config.parent)

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
        if not signalSender?
            log "    sender not found!"; return
        if not signalEvent?
            log "    event not found!";  return
        if not slotFunction?
            log "    slot not found!";   return
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
        cfg = _.def config, defaults
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
        if w?
            diff = @getWidth() - w
            @setWidth w - diff if diff
        if h?
            diff = @getHeight() - h
            @setHeight h - diff if diff
        return

    setSize: (s) -> @resize s.width, s.height
    getSize: -> return { width: @getWidth(), height: @getHeight() }

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
