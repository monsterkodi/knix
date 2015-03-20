###

00000000  000   000  00000000  000   000  000000000   0000000  00000000  000      000    
000       000   000  000       0000  000     000     000       000       000      000    
0000000    000 000   0000000   000 0 000     000     000       0000000   000      000    
000          000     000       000  0000     000     000       000       000      000    
00000000      0      00000000  000   000     000      0000000  00000000  0000000  0000000

###

class EventCell extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type   : 'EventCell'
            resize : 'horizontal'
            style  :
                position     : 'absolute'
                borderRadius : '%dpx'.fmt cfg.height/2 

        new DragSize
            moveStart : @onMoveStart
            moveStop  : @onMoveStop
            onMove    : @onDragMove
            doMove    : false
            elem      : @elem
        
        @connect 'mousedown', @onDown
        @

    minWidth: => return 1    

    onMoveStart: (drag) => @elem.addClassName 'selected'; @getParent().clearDeltas()
    onMoveStop:  (drag) => @getParent().clearDeltas()
    onDragMove:  (drag) => @getParent().moveCellsBy @getParent().selectedCells(), drag.delta.x, drag.delta.y

    onDown: (event) =>
        if event.shiftKey
            if @elem.hasClassName 'selected'
                @elem.removeClassName 'selected'
                return
            @elem.addClassName 'selected'

    trigger: => log @config.note
    release: => log @config.note

    del: => @close()
