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

        @rowHeight    = 14
        @setHeight @rowHeight
        @minNoteIndex = 108
        @maxNoteIndex = 0
        @noteRange    = 1
        @timeline     = undefined
        @timeposx     = 0
        @activeCells  = []
        @connect 'mousedown', @startSelect    
        document.addEventListener 'keypress', @onKey
        @
            
    onWindowSize: => 
        @setWidth @config.steps * @config.stepWidth
        newHeight = Math.max(@getParent().getHeight(), @rowHeight * (@maxNoteIndex - @minNoteIndex + 3))
        @setHeight newHeight
        
    ###
    00     00   0000000   000   000  00000000
    000   000  000   000  000   000  000     
    000000000  000   000   000 000   0000000 
    000 0 000  000   000     000     000     
    000   000   0000000       0      00000000
    ###
    
    onKey: (event, e) =>
        if event.key in ['Up', 'Down']
            dy = event.key == 'Up' and -@rowHeight or @rowHeight
            @moveSelectedCellsBy 0, dy
        if event.key in ['Left', 'Right']
            dx = event.key == 'Left' and -@config.stepWidth or @config.stepWidth
            @moveSelectedCellsBy dx, 0

    selectedCellMaxima: =>
        minpos = pos Number.MAX_VALUE, Number.MAX_VALUE
        maxpos = pos 0,0
        for c in @selectedCells()
            p = c.relPos()
            minpos = minpos.min(p)
            maxpos = maxpos.max(p.plus(c.sizePos()))
        [minpos, maxpos]
            
    moveSelectedCellsBy: (dx, dy) =>
        
        [minpos, maxpos] = @selectedCellMaxima()
        dx = Math.max(dx, -minpos.x)

        if @maxNoteIndex == Keyboard.numNotes()-1
            dy = Math.max(dy, -minpos.y)
            
        dx = Math.min(dx, @getWidth()-maxpos.x)
        
        if @minNoteIndex == 0
            dy = Math.min(dy, @getHeight()-maxpos.y)
            
        dy = Math.round(dy/@rowHeight)*@rowHeight

        numNotes = Keyboard.numNotes()
        for c in @selectedCells()
            p = c.relPos()
            x = _.clamp(0, @getWidth()-c.getWidth(), p.x+dx) 
            y = _.clamp(0, @rowHeight*numNotes, p.y+dy)
            c.moveTo x, y
            if dy != 0
                noteIndex = Keyboard.noteIndex c.config.noteName
                noteNames = Keyboard.allNoteNames()
                newNoteIndex = _.clamp(0, noteNames.length-1, noteIndex - dy/@rowHeight)
                # log 'old', noteIndex, 'new', newNoteIndex
                c.config.noteName = noteNames[newNoteIndex]
                @adjustRange newNoteIndex
        @scrollToSelectedCells()
        
    scrollToSelectedCells: =>
        [minpos, maxpos] = @selectedCellMaxima()
        @elem.parentElement.scrollTop = Math.min(minpos.y, @elem.parentElement.scrollTop)
        @elem.parentElement.scrollTop = Math.max(maxpos.y-@elem.parentElement.widget.getHeight()+@rowHeight, @elem.parentElement.scrollTop)
        @elem.parentElement.scrollLeft = Math.min(minpos.x, @elem.parentElement.scrollLeft)
        @elem.parentElement.scrollLeft = Math.max(maxpos.x-@elem.parentElement.widget.getWidth(), @elem.parentElement.scrollLeft)
        
    adjustRange: (noteIndex) =>    
        oldMaxIndex   = @maxNoteIndex
        oldMinIndex   = @minNoteIndex
        oldRange      = @noteRange
        @minNoteIndex = Math.min(@minNoteIndex, noteIndex)
        @maxNoteIndex = Math.max(@maxNoteIndex, noteIndex)
        @noteRange    = @maxNoteIndex-@minNoteIndex+1

        if oldMaxIndex and @maxNoteIndex > oldMaxIndex
            for c in @children()
                c.moveBy 0, (@maxNoteIndex-oldMaxIndex)*@rowHeight
                
        if oldRange != @noteRange
            @setHeight @noteRange*@rowHeight
            
        @noteRange
                        
    selectedCells: => (s.widget for s in @elem.select('.selected'))
                
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
        @adjustRange noteIndex
        relIndex = noteIndex - @minNoteIndex
        y = (@noteRange-relIndex-1) * @rowHeight
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
        
