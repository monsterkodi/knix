
class Drag

    @create: (cfg) -> new Drag(cfg)

    constructor: (cfg) ->
        _.extend @, _.def cfg,
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

    cancelEvent: (e) =>
        e = (if e then e else window.event)
        e.stopPropagation()  if e.stopPropagation
        e.preventDefault()  if e.preventDefault
        e.cancelBubble = true
        e.cancel = true
        e.returnValue = false
        false

    absPos: (event) =>
        event = (if event then event else window.event)
        if isNaN(window.scrollX)
            return pos(event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
                       event.clientY + document.documentElement.scrollTop + document.body.scrollTop)
        else
            return pos(event.clientX + window.scrollX, event.clientY + window.scrollY)

    dragStart: (event) =>
        return if @dragging or not @listening
        @dragging = true
        @onStart this, event if @onStart?
        @cursorStartPos = @absPos(event)
        if @doMove
            @targetStartPos = @target.relPos()
            @targetStartPos = @targetStartPos.check()
        @eventMove = $(document).on 'mousemove', @dragMove
        @eventUp   = $(document).on 'mouseup',   @dragUp
        @cancelEvent event

    dragMove: (event) =>
        return if not @dragging
        if @doMove
            newPos = @absPos(event)
            newPos = newPos.add(@targetStartPos).sub(@cursorStartPos)
            newPos.clamp @minPos, @maxPos
            newPos.apply @target
        if @onMove?
            @onMove this, event
        @cancelEvent event

    dragUp: (event) =>
        @dragStop event
        @cancelEvent event

    dragStop: (event) =>
        return if not @dragging
        @eventMove.stop()
        @eventUp.stop()
        @cursorStartPos = null
        @targetStartPos = null
        @onStop this, event if @onStop? and event?
        @dragging = false
        return

    startListening: =>
        return if @listening
        @listening = true
        @eventDown = @handle.on 'mousedown', @dragStart
        return

    stopListening: (stopCurrentDragging) =>
        return if not @listening
        @eventDown.stop()
        @listening = false
        @dragStop() if stopCurrentDragging and @dragging
        return
