pos  = require('./pos.coffee')
log  = require('./log.coffee')

class Widget

    # _________________________________________________________________________________________________________ instance

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

module.exports = Widget
