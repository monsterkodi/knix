pos = require './pos.coffee'
log = require './log.coffee'

class Drag

    @config =
        target:  null
        handle:  null
        minPos:  null
        maxPos:  null
        cursor:  "move"
        onStart: null
        onMove:  null
        onStop:  null
        doMove:  true
        active:  true

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

    absPos: (eventObj) ->
        eventObj = (if eventObj then eventObj else window.event)
        if isNaN(window.scrollX)
            return pos(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
                       eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop)
        else
            return pos(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY)

    dragStart: (eventObj) ->
        return if @dragging or not @listening
        @dragging = true
        @onStart this, eventObj if @onStart?
        @cursorStartPos = @absPos(eventObj)
        style = window.getComputedStyle(@target)
        @targetStartPos = pos(parseInt(style.left), parseInt(style.top))
        @targetStartPos = @targetStartPos.check()
        dragObject = this
        @eventMove = $(document).on 'mousemove', (e) -> dragObject.dragMove(e)
        @eventUp   = $(document).on 'mouseup', (e) -> dragObject.dragUp(e)
        @cancelEvent eventObj

    dragMove: (eventObj) ->
        return if not @dragging
        if @doMove
            newPos = @absPos(eventObj)
            newPos = newPos.add(@targetStartPos).sub(@cursorStartPos)
            newPos = newPos.bound(@minPos, @maxPos)
            newPos.apply @target
        @onMove this, eventObj if @onMove?
        @cancelEvent eventObj

    dragUp: (eventObj) ->
        @dragStop()
        @cancelEvent eventObj

    dragStop: ->
        return if not @dragging
        dragObject = this
        @eventMove.stop()
        @eventUp.stop()
        @cursorStartPos = null
        @targetStartPos = null
        @onStop this, eventObj if @onStop?
        @dragging = false
        return

    startListening: ->
        return if @listening
        @listening = true
        dragObject = this
        @eventDown = @handle.on 'mousedown', (e) -> dragObject.dragStart(e)
        return

    stopListening: (stopCurrentDragging) ->
        return if not @listening
        @eventDown.stop()
        @listening = false
        @dragStop() if stopCurrentDragging and @dragging
        return

    @create = (cfg) ->
        new Drag(cfg)

module.exports = Drag
