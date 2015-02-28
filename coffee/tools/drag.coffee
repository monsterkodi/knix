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

    absPos: (event) => Stage.absPos event
    relPos: (event) => Stage.relPos event

    dragStart: (event) =>
        return if @dragging or not @listening
        # log 'start', @target.id
        @dragging = true
        @onStart @, event if @onStart?
        @cursorStartPos = @absPos(event)
        if @doMove
            @targetStartPos = @target.relPos()
            @targetStartPos = @targetStartPos.check()

        document.addEventListener 'mousemove', @dragMove
        document.addEventListener 'mouseup',   @dragUp

    dragMove: (event) =>

        return if not @dragging
        # log 'move', @target.id, @onMove?
        
        if @doMove
            newPos = @absPos(event)
            newPos = @targetStartPos.add(newPos.sub(@cursorStartPos))
            newPos = newPos.clamp @minPos, @maxPos
            @target.getWidget().setPos newPos
            
        if @onMove?
            @onMove this, event

    constrain: (minX, minY, maxX, maxY) =>
        
        wp = @target.getWidget().relPos()

        @minPos = pos minX, minY
        @maxPos = pos maxX, maxY
        
        cp = wp.clamp @minPos, @maxPos

        if wp.notSame cp
            
            if @doMove
                @target.getWidget().setPos cp
                
            # if @onMove?
            #     @onMove this, {clientX: cp.x, clientY: cp.y}

    dragUp: (event) =>
        @dragStop event

    dragStop: (event) =>
        # log 'stop', @target.id
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
