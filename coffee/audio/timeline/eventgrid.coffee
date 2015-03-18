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
        document.addEventListener 'keypress', @onKey
        @
            
    onWindowSize: =>
        @setWidth @config.steps * @config.stepWidth
        @setHeight @rowHeight * @noteRange
        
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
            maxpos = maxpos.max(p.plus(pos c.getWidth(), @rowHeight))
        [minpos, maxpos]
            
    moveSelectedCellsBy: (dx, dy) =>
        
        [minpos, maxpos] = @selectedCellMaxima()
        dx = Math.max(dx, -minpos.x)

        if @maxNoteIndex == Keyboard.maxNoteIndex()
            dy = Math.max(dy, -minpos.y)
            
        dx = Math.min(dx, @getWidth()-maxpos.x)
        
        if @minNoteIndex == 0
            dy = Math.min(dy, Math.max(0, @getHeight()-maxpos.y))
            
        dy = @roundToNoteY dy

        numNotes = Keyboard.numNotes()
        for c in @selectedCells()
            p = c.relPos()
            c.moveBy dx, dy
            if dy != 0
                noteIndex = Keyboard.noteIndex c.config.noteName
                noteNames = Keyboard.allNoteNames()
                newNoteIndex = _.clamp(0, noteNames.length-1, noteIndex - dy/@rowHeight)
                # log noteIndex, newNoteIndex
                c.config.noteName = noteNames[newNoteIndex]
                @adjustRange newNoteIndex
        @scrollToSelectedCells().plus pos dx, dy
        
    scrollToSelectedCells: =>
        [minpos, maxpos] = @selectedCellMaxima()
        oldTop = @elem.parentElement.scrollTop
        oldLeft = @elem.parentElement.scrollLeft
        @scrollToPos maxpos
        @scrollToPos minpos
        pos oldLeft-@elem.parentElement.scrollLeft, oldTop-@elem.parentElement.scrollTop
        
    scrollToPos: (p) =>
        viewWidth = @elem.parentElement.widget.getWidth()
        left = Math.min p.x, @elem.parentElement.scrollLeft
        left = Math.max p.x - viewWidth, left
        left = Math.min @getWidth() - viewWidth, left
        @elem.parentElement.scrollLeft = left
        viewHeight = @elem.parentElement.widget.getHeight()
        top  = Math.min p.y, @elem.parentElement.scrollTop
        top  = Math.max p.y-viewHeight+@rowHeight, top
        top  = Math.min @getHeight() - viewHeight, top
        @elem.parentElement.scrollTop = top
        
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
        if note.event == 'trigger'
            @noteTrigger note
        else
            @noteRelease note
        
    noteTrigger: (note) =>
        
        c = new EventCell note,
            parent   : @
            height   : @rowHeight-2
            
        noteIndex = Keyboard.noteIndex c.config.noteName
        @adjustRange noteIndex
        relIndex = @maxNoteIndex - noteIndex
        x = if not c.config.x? then @timeposx else c.config.x
        y = if not c.config.y? then relIndex * @rowHeight else @roundToNoteY c.config.y
        c.moveTo x, y
        @activeCells.push c

    noteRelease: (note) =>
        for c in @activeCells
            if c.config.noteName == note.noteName
                c.setWidth Math.max(@timeposx - c.relPos().x, 1)
                @activeCells.splice(@activeCells.indexOf(c), 1)
                return
        
    noteNameAtPos: (pos) =>
        if @maxNoteIndex > 0
            relIndex  = _.clamp(0, Keyboard.maxNoteIndex(), @roundToNoteY(pos.y)/@rowHeight)
            noteIndex = Math.max(0, @maxNoteIndex - relIndex)
        else
            noteIndex = 48
        Keyboard.allNoteNames()[noteIndex]
            
    roundToNoteY: (y) => Math.min(@maxNoteIndex, Math.floor(y/@rowHeight))*@rowHeight
                
    removeAllCells: =>
        @minNoteIndex = 9*12
        @maxNoteIndex = 0
        @noteRange = 1
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
        
        
