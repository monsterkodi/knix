
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


log = ->

    # f = printStackTrace()[4].split('@')[1]
    # f = f.substr('file:///Users/kodi/Projects/knix/'.length)
    # f = f.substr(0,f.length-2)

    # s = ""
    # for arg in arguments
    #     s += str arg
    #     if i < arguments.length-1
    #       s += " "
    s = (str(arg) for arg in arguments).join(" ")

    # console.dir(console)
    # console.trace()
    console.log "%c%s", 'color:white', s

    Console.log s

    return this

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


class Stage

    @width:  -> @size().width
    @height: -> @size().height

    @size: ->
        s = window.getComputedStyle $('stage_content')
        width:  parseInt s.width
        height: parseInt s.height


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
