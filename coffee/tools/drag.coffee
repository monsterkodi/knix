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

        if typeof @target is "string"
            t = document.getElementById @target
            if not t?
                error 'cant find drag target with id', @target
                return
            @target = t
        if not @target?
            error 'cant find drag target', @target
            return
        if @minPos? and @maxPos?
            [@minPos, @maxPos] = [@minPos.min(@maxPos), @minPos.max(@maxPos)]
        @cursorStartPos = null
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
        log 'start', @target.id
        @dragging = true
        @onStart @, event if @onStart?
        @cursorStartPos = @absPos(event)
        if @doMove
            @targetStartPos = @target.relPos()
            @targetStartPos = @targetStartPos.check()

        document.addEventListener 'mousemove', @dragMove
        document.addEventListener 'mouseup',   @dragUp

    dragMove: (event) =>
        # log 'move', @target.id, @onMove?
        return if not @dragging
        if @doMove
            newPos = @absPos(event)
            newPos = newPos.add(@targetStartPos).sub(@cursorStartPos)
            newPos.clamp @minPos, @maxPos
            @target.getWidget().setPos newPos
        if @onMove?
            @onMove this, event

    dragUp: (event) =>
        @dragStop event

    dragStop: (event) =>
        log 'stop', @target.id
        return if not @dragging
        document.removeEventListener 'mousemove', @dragMove
        document.removeEventListener 'mouseup',   @dragUp
        @cursorStartPos = null
        @targetStartPos = null
        @onStop this, event if @onStop? and event?
        @dragging = false
        return

    activate: =>
        return if @listening
        @listening = true
        @handle.addEventListener 'mousedown', @dragStart
        return

    deactivate: =>
        # log 'deactivate', @target.id
        return if not @listening
        @handle.removeEventListener 'mousedown', @dragStart
        @listening = false
        @dragStop() if @dragging
        return
