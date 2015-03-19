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
            class     : 'EventGrid'
            noMove    : true
            rowHeight : 14
            style     :
                position: 'relative'
        
        @setHeight @config.rowHeight*Keyboard.numNotes()
        @timeline     = undefined
        @timeposx     = 0
        @activeCells  = []
        document.addEventListener 'keypress', @onKey
        @
            
    onWindowSize: => @setWidth @config.steps * @config.stepWidth
        
    ###
    00     00   0000000   000   000  00000000
    000   000  000   000  000   000  000     
    000000000  000   000   000 000   0000000 
    000 0 000  000   000     000     000     
    000   000   0000000       0      00000000
    ###
    
    onKey: (event, e) =>
        
        if event.key in ['Up', 'Down']
            dy = event.key == 'Up' and -@config.rowHeight or @config.rowHeight
            @moveCellsBy @selectedCells(), 0, dy
        if event.key in ['Left', 'Right']
            # dx = event.key == 'Left' and -@config.stepWidth or @config.stepWidth
            sw = 2
            dx = event.key == 'Left' and -sw or sw
            @moveCellsBy @selectedCells(), dx, 0
            
    moveCellsBy: (cells, dx, dy) =>
        
        [minpos, maxpos] = @cellMaxima cells
        dx = Math.max(dx, -minpos.x)
        dy = Math.max(dy, -minpos.y)
        dx = Math.min(dx, @getWidth()-maxpos.x)
        dy = Math.min(dy, Math.max(0, @getHeight()-maxpos.y))
            
        dy = @roundToNoteY dy

        numNotes = Keyboard.numNotes()
        for c in cells
            p = c.relPos()
            c.moveBy dx, dy
            @emit 'cellMovedBy', { cell: c, dx: dx, dy: dy }
            if dy != 0
                noteIndex = Keyboard.noteIndex c.config.noteName
                noteNames = Keyboard.allNoteNames()
                newNoteIndex = _.clamp(0, noteNames.length-1, noteIndex - dy/@config.rowHeight)
                # log noteIndex, newNoteIndex
                c.config.noteName = noteNames[newNoteIndex]
            
                
        @scrollToCells(cells).plus pos dx, dy

    ###
     0000000   0000000  00000000    0000000   000      000    
    000       000       000   000  000   000  000      000    
    0000000   000       0000000    000   000  000      000    
         000  000       000   000  000   000  000      000    
    0000000    0000000  000   000   0000000   0000000  0000000
    ###

    scrollToPos: (p) =>
        viewWidth = @elem.parentElement.widget.getWidth()
        left = Math.min p.x, @elem.parentElement.scrollLeft
        left = Math.max p.x - viewWidth, left
        left = Math.min @getWidth() - viewWidth, left
        @elem.parentElement.scrollLeft = left
        viewHeight = @elem.parentElement.widget.getHeight()
        top  = Math.min p.y, @elem.parentElement.scrollTop
        top  = Math.max p.y-viewHeight+@config.rowHeight, top
        top  = Math.min @getHeight() - viewHeight, top
        @elem.parentElement.scrollTop = top
        
    scrollToCells: (cells) =>
        [minpos, maxpos] = @cellMaxima cells
        oldTop = @elem.parentElement.scrollTop
        oldLeft = @elem.parentElement.scrollLeft
        @scrollToPos maxpos
        @scrollToPos minpos
        pos oldLeft-@elem.parentElement.scrollLeft, oldTop-@elem.parentElement.scrollTop        
        
    scrollToSelectedCells: => @scrollToCells @selectedCells()
                                        
    selectedCells: => (s.widget for s in @elem.select('.selected'))

    cellMaxima: (cells) =>
        minpos = pos Number.MAX_VALUE, Number.MAX_VALUE
        maxpos = pos 0,0
        for c in cells
            p = c.relPos()
            minpos = minpos.min(p)
            maxpos = maxpos.max(p.plus(pos c.getWidth(), @config.rowHeight))
        [minpos, maxpos]
                
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
        # log note
        c = new EventCell note,
            parent   : @
            height   : @config.rowHeight-2
            
        noteIndex = Keyboard.noteIndex c.config.noteName
        x = if not c.config.x? then @timeposx else c.config.x
        y = if not c.config.y? then @getHeight()-(noteIndex+1)*@config.rowHeight else @roundToNoteY c.config.y
        c.moveTo x, y
        @activeCells.push c
        @emit 'cellAdded', { cell: c }
        c

    noteRelease: (note) =>
        # log note
        for c in @activeCells
            if c.config.noteName == note.noteName
                c.setWidth Math.max(@timeposx - c.relPos().x, 1)
                @activeCells.splice(@activeCells.indexOf(c), 1)
                return c
        
    noteNameAtPos: (pos) =>
        noteIndex = _.clamp(0, Keyboard.maxNoteIndex(), @roundToNoteY(@getHeight()-pos.y)/@config.rowHeight)
        Keyboard.allNoteNames()[noteIndex]
            
    roundToNoteY: (y) => Math.floor(y/@config.rowHeight)*@config.rowHeight
                
    removeAllCells: =>
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
        
        
