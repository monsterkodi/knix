drag = require('./drag.coffee')
pos  = require('./pos.coffee')
log  = require('./log.coffee')

class wid

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
            return event.detail[argname]
        event

    # ____________________________________________________________________________ hierarchy

    getParent: ->
        return $(@config.parent) if @config.parent
        return $(@parentElement.id)

    getWidget: ->
        if @hasClassName('widget')
            return this
        p = @getParent()
        w = p.getWidget() if p['getWidget']
        return w

    getChild: (name) ->
        c = Selector.findChildElements(this, ['.'+name, '#'+name])
        return c[0] if c.length
        return null

    close: -> @remove(); return

    # ____________________________________________________________________________ geometry

    moveTo: (x, y) ->
        @style.left = "%dpx".fmt(x)
        @style.top  = "%dpx".fmt(y)
        return

    moveBy: (dx, dy) ->
        p = @relPos()
        @style.left = "%dpx".fmt(p.x+dx)
        @style.top  = "%dpx".fmt(p.y+dy)
        return

    setWidth: (w) ->
        @style.width = "%dpx".fmt(w)  if w?
        @emitSize()
        return

    setHeight: (h) ->
        @style.height = "%dpx".fmt(h)  if h?
        @emitSize()
        return

    resize: (w, h) ->
        @setWidth w if w
        @setHeight h if h
        return

    headerSize: (box="border-box-height") ->
        children = Selector.findChildElements(this, [ "*.title", "*.close", "*.shade" ])
        i = 0
        while i < children.length
            height = children[i].getLayout().get(box)
            return height  if height
            i++
        0

    shade: ->
        size = @getChild 'size'
        if @config.isShaded
            @setHeight @config.height
            # adjust height for border size
            diff = @getHeight() - @config.height
            @setHeight @config.height - diff  if diff
            @config.isShaded = false
            size.show() if size
        else
            @config.height = @getHeight()
            @setHeight @headerSize("padding-box-height")
            @config.isShaded = true
            size.hide() if size
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

    format: (s) -> return @config.format.fmt(s) if @config.format?; s

    clamp: (v) -> # clamps v to the [valueMin,valueMax] range
        c = v
        c = Math.min(c, @config.valueMax) if @config.valueMax
        c = Math.max(c, @config.valueMin) if @config.valueMin
        c

module.exports = wid
