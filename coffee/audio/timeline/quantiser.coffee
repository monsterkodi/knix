###

 0000000   000   000   0000000   000   000  000000000  000   0000000  00000000  00000000 
000   000  000   000  000   000  0000  000     000     000  000       000       000   000
000 00 00  000   000  000000000  000 0 000     000     000  0000000   0000000   0000000  
000 0000   000   000  000   000  000  0000     000     000       000  000       000   000
 00000 00   0000000   000   000  000   000     000     000  0000000   00000000  000   000

###

class Quantiser

    constructor: (cfg, defs) -> @init cfg, defs 

    init: (cfg, defs) =>
        
        @config = _.def cfg, defs 
        
        @grid = @config.grid 
        delete @config.grid
        log @config
        @ 
        
    moveCellTo: (cell, p) =>
            
        c = cell.config
        oldPos = pos(c.x, c.y)
        d = p.minus oldPos
        p.add(c.delta) if c.delta?
        p.x = _.floor p.x, @config.state == 'on' and @grid.config.stepWidth * @config.steps or 2
        p.y = @grid.roundToNoteY p.y
        if p.x == c.x or p.y == c.y
            if not c.delta?           
                c.delta = pos(0,0)
                if p.x == c.x then c.delta.x = d.x
                if p.y == c.y then c.delta.y = d.y
            else
                if p.x == c.x then c.delta.x += d.x else c.delta.x = (oldPos.x+d.x+c.delta.x-p.x)
                if p.y == c.y then c.delta.y += d.y else c.delta.y = (oldPos.y+d.y+c.delta.y-p.y)
        
        cell.moveTo p.x, p.y
            
        noteIndex = Keyboard.noteIndex cell.config.noteName
        newNoteIndex = @grid.noteIndexAtPos p
        cell.config.noteName = Keyboard.allNoteNames()[newNoteIndex]
                
        @grid.scrollToCell cell
        
    moveCellsBy: (cells, dx, dy) =>
                
        [minpos, maxpos] = @grid.cellMaxima cells
        dx = Math.max(dx, -minpos.x)
        dy = Math.max(dy, -minpos.y)
        dx = Math.min(dx, @grid.getWidth()-maxpos.x)
        dy = Math.min(dy, @grid.getHeight()-maxpos.y)
        for c in cells
            @moveCellTo c, c.relPos().plus(pos(dx, dy))
        
    moveCellsInDirection: (cells, direction) =>
        if direction in ['Up', 'Down']
            @moveCellsBy cells, 0, direction == 'Up' and -@grid.config.rowHeight or @grid.config.rowHeight
        if direction in ['Left', 'Right']
            incr = @config.state == 'off' and 2 or @config.steps * @grid.config.stepWidth
            @moveCellsBy cells, direction == 'Left' and -incr or incr, 0
        
    cellAddedAt:   (cell, pos) => @moveCellTo cell, pos
    quantiseMode:      (state) => @config.mode      = state
    quantiseWhenMoved: (state) => @config.whenMoved = state
    quantiseWhenAdded: (state) => @config.whenAdded = state
    quantiseSteps:     (state) => @config.steps = state
    state:             (state) => @config.state = state
