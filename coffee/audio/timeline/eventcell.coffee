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
            onMove    : @onDragMove
            doMove    : false
            elem      : @elem
        
        @elem.addEventListener 'mousedown', @onDown        
        @

    minWidth: => return 1    

    onMoveStart: (drag) => @elem.addClassName 'selected'
    onDragMove:  (drag) => 
        delta = @getParent().moveCellsBy @getParent().selectedCells(), drag.deltaSum.x, drag.deltaSum.y
        drag.startPos.add delta

    onDown: (event) =>
        if event.shiftKey
            if @elem.hasClassName 'selected'
                @elem.removeClassName 'selected'
                return
            @elem.addClassName 'selected'

    trigger: => log @config.note
    release: => log @config.note

    del: => @close()
