###

0000000    00000000    0000000    0000000 
000   000  000   000  000   000  000      
000   000  0000000    000000000  000  0000
000   000  000   000  000   000  000   000
0000000    000   000  000   000   0000000 

###

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
        @activate() if @active
        return

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
        # log 'drag start', @onStart?
        @onStart @, event if @onStart?
        @cursorStartPos = @absPos(event)
        if @doMove
            @targetStartPos = @target.relPos()
            @targetStartPos = @targetStartPos.check()
        @eventMove = $(document).on 'mousemove', @dragMove
        @eventUp   = $(document).on 'mouseup',   @dragUp

    dragMove: (event) =>
        return if not @dragging
        if @doMove
            newPos = @absPos(event)
            newPos = newPos.add(@targetStartPos).sub(@cursorStartPos)
            newPos.clamp @minPos, @maxPos
            newPos.apply @target
        if @onMove?
            @onMove this, event

    dragUp: (event) =>
        @dragStop event

    dragStop: (event) =>
        return if not @dragging
        @eventMove.stop()
        @eventUp.stop()
        @cursorStartPos = null
        @targetStartPos = null
        @onStop this, event if @onStop? and event?
        @dragging = false
        return

    activate: =>
        return if @listening
        @listening = true
        @eventDown = @handle.on 'mousedown', @dragStart
        return

    deactivate: (stopCurrentDragging) =>
        return if not @listening
        @eventDown.stop()
        @listening = false
        @dragStop() if stopCurrentDragging and @dragging
        return
