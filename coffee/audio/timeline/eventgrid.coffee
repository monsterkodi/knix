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
            moveIncrX : 1
            style     :
                position : 'relative'
                cursor   : 'pointer'
        
        @quantiser = new Quantiser 
            grid      : @
            steps     : 1
            mode      : 'start'
            whenAdded : 'on'
            whenMoved : 'on'

        @setHeight @config.rowHeight*Keyboard.numNotes()
        @timeline    = undefined
        @timeposx    = 0
        @activeCells = []
        document.addEventListener 'keypress', @onKey
        @
            
    onWindowSize:                => @setWidth @config.steps * @config.stepWidth
    onKey:       (event, e)      => @quantiser.moveCellsInDirection @selectedCells(), event.key
    moveCellsBy: (cells, dx, dy) => @quantiser.moveCellsBy cells, dx, dy

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
        
    scrollToCell: (cell) => @scrollToPos cell.relPos()
        
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
        
    setSpeed: (speed) => 
        @config.stepSecs = _.value speed
        log @config.stepSecs 
        
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
        y = if not c.config.y? then @getHeight()-(noteIndex+1)*@config.rowHeight else c.config.y
        
        @quantiser.cellAddedAt c, pos x, y 
        @activeCells.push c
        c

    noteRelease: (note) =>
        # log note
        for c in @activeCells
            if c.config.noteName == note.noteName
                c.setWidth Math.max(@timeposx - c.relPos().x, 1)
                @activeCells.splice(@activeCells.indexOf(c), 1)
                return c
        
    noteIndexAtPos: (pos) => _.clamp(0, Keyboard.maxNoteIndex(), @roundToNoteY(@getHeight()-pos.y)/@config.rowHeight)
    noteNameAtPos:  (pos) => Keyboard.allNoteNames()[@noteIndexAtPos pos]
            
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
        
        
