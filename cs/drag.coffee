pos = require './pos.coffee'
log = require './log.coffee'

class Drag

    @config =
        target:  null
        handle:  null
        minPos:  null
        maxPos:  null
        onStart: null
        onMove:  null
        onStop:  null
        active:  true

    constructor: (cfg) ->
        Object.extend(this, Drag.config)
        Object.extend(this, cfg)
        log "Drag this:", this
        @target = document.getElementById(@target) if typeof (@target) is "string"
        log "Drag target:", @target
        return unless @target?
        if @minPos? and @maxPos?
            tempPos = @minPos
            @minPos = @minPos.min(@maxPos)
            @maxPos = tempPos.max(@maxPos)
            log "Drag bounds:", @minPos, @maxPos
        @cursorStartPos  = null
        @elementStartPos = null
        @dragging  = false
        @listening = false
        @disposed  = false
        @handle = document.getElementById(@handle)  if typeof (@handle) is "string"
        @handle = @target unless @handle?
        log "Drag handle:", @handle
        #@handle.style.cursor = "move"
        @startListening() if @active
        log "Drag constructed!"
        return

    hookEvent: (element, eventName, callback) ->
        element = document.getElementById(element)  if typeof (element) is "string"
        return  unless element?
        log "Drag hookeEvent element:", element, "eventName:", eventName, "cb:", callback
        if element.addEventListener
              element.addEventListener eventName, callback, false
        else element.attachEvent "on" + eventName, callback  if element.attachEvent
        return

    unhookEvent: (element, eventName, callback) ->
        element = document.getElementById(element)  if typeof (element) is "string"
        return  unless element?
        if element.removeEventListener
            element.removeEventListener eventName, callback, false
        else element.detachEvent "on" + eventName, callback  if element.detachEvent
        return

    cancelEvent: (e) ->
        e = (if e then e else window.event)
        e.stopPropagation()  if e.stopPropagation
        e.preventDefault()  if e.preventDefault
        e.cancelBubble = true
        e.cancel = true
        e.returnValue = false
        false

    absoluteCursorPostion: (eventObj) ->
        eventObj = (if eventObj then eventObj else window.event)
        if isNaN(window.scrollX)
            new pos(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop)
        else
            new pos(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY)

    dragStart: (eventObj) ->
        log "dragStart", eventObj
        return  if @dragging or not @listening or @disposed
        @dragging = true
        @startCallback eventObj, @element if @startCallback?
        @cursorStartPos = @absoluteCursorPostion(eventObj)
        style = window.getComputedStyle(@target)
        @elementStartPos = new pos(parseInt(style.left), parseInt(style.top))
        @elementStartPos = @elementStartPos.check()
        dragObject = this
        $(document).on 'mousemove', (e) -> dragObject.dragMove(e)
        $(document).on 'mouseup', (e) -> dragObject.dragUp(e)
        @target.raise()
        @cancelEvent eventObj

    dragMove: (eventObj) ->
        return  if not @dragging or @disposed
        newPos = @absoluteCursorPostion(eventObj)
        newPos = newPos.add(@elementStartPos).sub(@cursorStartPos)
        newPos = newPos.bound(@minPos, @maxPos)
        newPos.apply @target
        @onMove newPos, @target  if @onMove?
        @cancelEvent eventObj

    dragUp: (eventObj) ->
        @dragStop()
        @cancelEvent eventObj

    dragStop: ->
        return  if not @dragging or @disposed
        dragObject = this
        $(document).on 'mousemove', null
        $(document).on 'mouseup', null
        @unhookEvent document, "mousemove", @dragGo
        @unhookEvent document, "mouseup", @dragStopHook
        @cursorStartPos = null
        @elementStartPos = null
        @endCallback @element  if @endCallback?
        @dragging = false
        return

    dispose: ->
        return if @disposed
        @StopListening true
        @element = null
        @attachElement = null
        @lowerBound = null
        @upperBound = null
        @startCallback = null
        @moveCallback = null
        @endCallback = null
        @disposed = true
        return

    startListening: ->
        log "Drag startListening target.id:", @target.id, "handle.id:", @handle.id
        return if @listening or @disposed
        @listening = true
        dragObject = this
        @handle.on 'mousedown', (e) -> dragObject.dragStart(e)
        log "Drag startListening done"
        return

    stopListening: (stopCurrentDragging) ->
        return  if not @listening or @disposed
        @unhookEvent @attachElement, "mousedown", @dragStart
        @listening = false
        @dragStop()  if stopCurrentDragging and @dragging
        return

    isDragging: ->
        @dragging

    isListening: ->
        @listening

    isDisposed: ->
        @disposed

    @create = (cfg) ->
        log "create cfg:", cfg
        new Drag(cfg)

module.exports = Drag
