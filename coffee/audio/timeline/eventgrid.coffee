###

00000000  000   000  00000000  000   000  000000000   0000000   00000000   000  0000000  
000       000   000  000       0000  000     000     000        000   000  000  000   000
0000000    000 000   0000000   000 0 000     000     000  0000  0000000    000  000   000
000          000     000       000  0000     000     000   000  000   000  000  000   000
00000000      0      00000000  000   000     000      0000000   000   000  000  0000000  

###

class EventGrid extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            class: 'EventGrid'
            noMove: true
            style:
                position: 'relative'

        @rowHeight   = 14
        @minNoteIndex = 9*12
        @maxNoteIndex = 0
        @timeline    = undefined
        @timeposx    = 0
        @activeCells = []
        @connect 'mousedown', @startSelect            
        @
            
    onWindowSize: => 
        @setWidth @config.steps * @config.stepWidth
        newHeight = Math.max(@getParent().getHeight(), @rowHeight * (@maxNoteIndex - @minNoteIndex + 3))
        @setHeight newHeight
                
    ###
    000000000  00000000   000   0000000    0000000   00000000  00000000 
       000     000   000  000  000        000        000       000   000
       000     0000000    000  000  0000  000  0000  0000000   0000000  
       000     000   000  000  000   000  000   000  000       000   000
       000     000   000  000   0000000    0000000   00000000  000   000
    ###
        
    setTime: (time) =>
        @timeposx = time * @config.stepWidth / @config.stepSecs
        for c in @activeCells
            c.setWidth @timeposx - c.relPos().x
        
    addNote: (note) =>
        if note.type == 'trigger'
            @noteTrigger note.note
        else
            @noteRelease note.note
        
    noteTrigger: (noteName) =>
        
        c = new EventCell
            parent   : @
            height   : @rowHeight-2
            noteName : noteName 
            
        noteIndex    = Keyboard.noteIndex noteName
        oldMaxIndex  = @maxNoteIndex
        oldRange     = @maxNoteIndex-@minNoteIndex
        @minNoteIndex = Math.min(@minNoteIndex, noteIndex)
        @maxNoteIndex = Math.max(@maxNoteIndex, noteIndex)
        newRange     = @maxNoteIndex-@minNoteIndex
        if oldMaxIndex < @maxNoteIndex
            for c in @children()
                c.moveBy 0, (@maxNoteIndex-oldMaxIndex)*@rowHeight
        if oldRange != newRange
            @setHeight (newRange+3)*@rowHeight
        relIndex = noteIndex - @minNoteIndex
        y = (newRange-relIndex+1) * @rowHeight
        c.moveTo @timeposx, y
        @activeCells.push c
        # log (c.config.noteName for c in @activeCells)

    noteRelease: (noteName) =>
        for c in @activeCells
            if c.config.noteName == noteName
                c.setWidth Math.max(@timeposx - c.relPos().x, 1)
                @activeCells.splice(@activeCells.indexOf(c), 1)
                # log c.config.noteName, (c.config.noteName for c in @activeCells)
                return
                
    removeAllCells: =>
        @minNoteIndex = 9*12
        @maxNoteIndex = 0
        @activeCells = []
        for c in @children()
            c.close()
        @onWindowSize()
        
    prepareState: => @config.children = ( c.config for c in @children() )
        
    ###
    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000     
     000 000   000000000  000      000   000  0000000 
       000     000   000  000      000   000  000     
        0      000   000  0000000   0000000   00000000
    ###
                
    addValue: (valueWidget) =>
        log 'value', valueWidget.elem.id, valueWidget.config.value
        # col = @columnFor valueWidget.elem
        # row = col.rows[@step.index]
        # @setValue row, valueWidget
        # row.on()
        
    setValue: (cell, valueWidget) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].push(colIndex) if colIndex not in @rowColumns[rowIndex]   
        cell.clear()
        cell.insertChild valueWidget.config
        
    ###
     0000000  00000000  000      00000000   0000000  000000000
    000       000       000      000       000          000   
    0000000   0000000   000      0000000   000          000   
         000  000       000      000       000          000   
    0000000   00000000  0000000  00000000   0000000     000   
    ###
    
    startSelect: (event) =>
        Selectangle.start @
        event.stop()
        
