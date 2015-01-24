pos = require './pos.coffee'
log = require './log.coffee'

class Drag

    constructor: (@element, @attachElement, minBound, maxBound, @startCallback, @moveCallback, @endCallback, @attachLater) ->
        @element = document.getElementById(@element) if typeof (@element) is "string"
        log "Drag element", @element
        return unless @element?
        @lowerBound = null
        @upperBound = null
        if minBound? and maxBound?
            @lowerBound = minBound.min(maxBound)
            @upperBound = minBound.max(maxBound)
            log "Drag bounds", @lowerBound, @upperBound
        @cursorStartPos = null
        @elementStartPos = null
        @dragging = false
        @listening = false
        @disposed = false
        @attachElement = document.getElementById(@attachElement)  if typeof (@attachElement) is "string"
        @attachElement = @element unless @attachElement?
        log "Drag attachElement", @attachElement
        #@attachElement.style.cursor = "move"
        @startListening() unless @attachLater
        log "Drag constructed"
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
        style = window.getComputedStyle(@element)
        @elementStartPos = new pos(parseInt(style.left), parseInt(style.top))
        @elementStartPos = @elementStartPos.check()
        @hookEvent document, "mousemove", @dragGo
        @hookEvent document, "mouseup", @dragStopHook
        @element.raise()
        @cancelEvent eventObj

    dragGo: (eventObj) ->
      return  if not dragging or disposed
      newPos = @absoluteCursorPostion(eventObj)
      newPos = newPos.add(@elementStartPos).sub(cursorStartPos)
      newPos = newPos.bound(drag.lowerBound, drag.upperBound)
      newPos.Apply element
      @moveCallback newPos, element  if @moveCallback?
      @cancelEvent eventObj

    dragStopHook: (eventObj) ->
      dragStop()
      cancelEvent eventObj

    dragStop: ->
      return  if not @dragging or @disposed
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
        log "Drag startListening", this
        return if @listening or @disposed
        @listening = true
        # @hookEvent @attachElement, "mousedown", @dragStart
        $(@attachElement.id).on 'mousedown', @dragStart
        log "Drag startListening hooked"
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

    @create = ->
        new Drag(arguments)

module.exports = Drag
