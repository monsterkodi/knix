###

    000   000  000  0000000     00000000  00000000  000000000
    000 0 000  000  000   000  000        000          000
    000000000  000  000   000  000  0000  0000000      000
    000   000  000  000   000  000   000  000          000
    00     00  000  0000000     0000000   00000000     000

###

class Widget

    constructor: (config, defaults) ->
        @init config, defaults

    init: (config, defaults) ->

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

        @elem.getWindow = @getWindow.bind(@)
        @elem.getChild  = @getChild.bind(@)
        @elem.getParent = @getParent.bind(@)

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
        style.set(s, @config[s]+'px') for s in ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'] when @config[s]?
        @elem.setStyle style.toObject() if style.keys().length

        #__________________________________________________ DOM setup

        @elem.insert(@config.text) if @config.text?
        @insertChildren()
        @addToParent(@config.parent) if @config.parent?

        #__________________________________________________ position and size

        if @config.x? or @config.y?
            @elem.style.position = 'absolute'
            @moveTo @config.x, @config.y

        @resize @config.width, @config.height if @config.width? or @config.height?

        #__________________________________________________ event setup

        if @config.isMovable
            Drag.create
                target: @elem
                minPos: pos(undefined,0)
                cursor: null

        @initSlots()
        @initConnections()
        @initEvents()

        if @config.noDown
            @elem.on 'mousedown', (event,e) -> event.stopPropagation()

        return @

    # __________________________________________________________________________ elem and widget hierarchy

    @nextWidgetID  = 0

    @elem: (type, clss) -> # create element of <type>, add class <clss> and assign 'unique' id
        e = new Element type
        e.id = "%s.%s.%d".fmt(type, clss, @nextWidgetID)
        @nextWidgetID += 1
        e.addClassName clss
        e

    # ________________________________________________________________________________ event handling

    initEvents: ->
        @elem.on "click",      @config.onClick  if @config.onClick
        @elem.on "mousedown",  @config.onDown   if @config.onDown
        @elem.on "mouseup",    @config.onUp     if @config.onUp
        @elem.on "mouseover",  @config.onOver   if @config.onOver
        @elem.on "mousemove",  @config.onMove   if @config.onMove
        @elem.on "mouseout",   @config.onOut    if @config.onOut
        @elem.on "ondblclick", @config.onDouble if @config.onDouble
        @

    # ____________________________________________________________________________ slots

    initSlots: ->
        slots = @config.slots
        return if not slots?
        for slot, func of slots
            # log "@initSlots", @elem.id, slot
            @[slot] = func

    # ____________________________________________________________________________ connections

    initConnections: ->
        connections = @config.connect
        return if not connections?
        for connection in connections
            @connect connection.signal, connection.slot

    connect: (signal, slot) ->
        # log "connect", signal, slot
        [signalSender, signalEvent] = @resolveSignal(signal)
        slotFunction = @resolveSlot(slot)
        if not signalSender?
            log "    sender not found!"; return
        if not signalEvent?
            log "    event not found!";  return
        if not slotFunction?
            log "    slot not found!";   return
        handler:  signalSender.elem.on signalEvent, slotFunction
        sender:   signalSender
        event:    signalEvent
        receiver: slotFunction

    resolveSignal: (signal) ->
        [event, sender] = signal.split(':').reverse()
        sender = @getWindow().getChild(sender) if sender?
        sender = @ unless sender?
        [sender, event]

    resolveSlot: (slot) ->
        if typeof slot == 'function'
            return slot
        if typeof slot == 'string'
            [func, receiver] = slot.split(':').reverse()
            receiver = @getWindow().getChild(receiver) if receiver?
            receiver = @ unless receiver?
            return receiver[func].bind(receiver) if receiver[func]?
        null

    addToParent: (p) ->
        if not @elem?
            log 'no @elem?'
            return this
        if not p?
            log 'no p?'
            return this
        parentElement = $(p.content) if p.content?
        parentElement = p.elem unless parentElement
        parentElement = $(p) unless parentElement
        if not parentElement?
            log 'no element?', p
            return this
        parentElement.insert @elem
        @config.parent = parentElement.id
        this

    insertChild: (config, defaults) ->
        child = knix.create config, defaults
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
        @elem.dispatchEvent event

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
            anc = @elem.ancestors()
            for a in anc
                if a.match("#"+args[0]) or a.match("."+args[0])
                    return a.widget
            return
        return $(@config.parent).widget if @config.parent
        return $(@parentElement.id).wiget

    getWindow: -> # returns this or first ancestor element with class 'window'
        if @elem.hasClassName('window')
            return this
        @getParent('window')

    getChild: (classOrID) -> # returns first child element that matches class or element id
        c = @elem.select('#'+classOrID, '.'+classOrID)
        return c[0].widget if c.length
        return undefined

    close: -> @elem.remove(); return

    clear: ->
        while @elem.hasChildNodes()
            @elem.removeChild @elem.lastChild

    # ____________________________________________________________________________ geometry

    setPos: (p) -> @moveTo p.x, p.y

    moveTo: (x, y) ->
        @elem.style.left = "%dpx".fmt(x) if x?
        @elem.style.top  = "%dpx".fmt(y) if y?
        return

    moveBy: (dx, dy) ->
        p = @relPos()
        @elem.style.left = "%dpx".fmt(p.x+dx) if dx?
        @elem.style.top  = "%dpx".fmt(p.y+dy) if dy?
        return

    setWidth: (w) ->
        ow = @elem.style.width
        @elem.style.width = "%dpx".fmt(w) if w?

        @emitSize() if ow != @elem.style.width
        return

    setHeight: (h) ->
        oh = @elem.style.height
        @elem.style.height = "%dpx".fmt(h) if h?

        @emitSize() if oh != @elem.style.height
        return

    getWidth: -> @elem.getWidth()
    getHeight: -> @elem.getHeight()

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

    percentage: (v) -> # returns the percentage of value v in the [minValue,maxValue] range
        cfg = @config
        pct = 100 * (v - cfg.minValue) / (cfg.maxValue - cfg.minValue)
        Math.max(0,Math.min(pct,100))

    size2value: (s) -> # returns the value in the [minValue,maxValue] range that lies at point s
        @config.minValue + (@config.maxValue - @config.minValue) * s / @innerWidth()

    innerWidth:  -> @elem.getLayout().get("padding-box-width")
    innerHeight: -> @elem.getLayout().get("padding-box-height")
    minWidth:    -> w = parseInt @elem.getStyle('min-width' ); if w then w else 0
    minHeight:   -> h = parseInt @elem.getStyle('min-height'); if h then h else 0
    maxWidth:    -> w = parseInt @elem.getStyle('max-width' ); if w then w else Number.MAX_VALUE
    maxHeight:   -> h = parseInt @elem.getStyle('max-height'); if h then h else Number.MAX_VALUE
    relPos:      -> o = @elem.positionedOffset(); pos o.left, o.top
    absPos:      -> o = @elem.cumulativeOffset(); s = @elem.cumulativeScrollOffset(); pos o.left - s.left, o.top - s.top
    absCenter:   -> @absPos().add(pos(@elem.getWidth(),@elem.getHeight()).mul(0.5))

    # ____________________________________________________________________________ tools

    format: (s) -> return @config.format.fmt(s) if @config.format?; String(s)
    strip0: (s) -> return s.replace(/(0+)$/,'').replace(/([\.]+)$/,'') if s.indexOf('.') > -1; String(s)
    round: (v) -> # rounds v to multiples of valueStep
        r = v
        if @config.valueStep?
            d = v - Math.round(v/@config.valueStep)*@config.valueStep
            r -= d
        r
    clamp: (v) -> # clamps v to the [minValue,maxValue] range
        c = v
        c = Math.min(c, @config.maxValue) if @config.maxValue?
        c = Math.max(c, @config.minValue) if @config.minValue?
        c
