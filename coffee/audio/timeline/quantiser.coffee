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
        @config = _.def @config,
            moveIncrX = 2
        
        @grid = @config.grid 
        delete @config.grid
        log @config
        @ 
        
    moveCellTo: (cell, pos) =>
        if not cell? or not cell.config?
            warn 'no cell?'
            return
            
        c = cell.config
        # log pos, c.noteName, c.x, c.y
                
        dx = pos.x - c.x
        dy = pos.y - c.y
                
        pos.y = @grid.roundToNoteY pos.y
        
        # log dx, dy, pos.y
        
        if @config.state == 'on'
            sw = @grid.config.stepWidth * @config.steps
        else
            sw = 2
            
        rh = @grid.config.rowHeight
        ox = c.deltaX or 0
        oy = c.deltaY or 0
        px = c.x+ox+dx
        py = c.y+oy+dy
        nx = _.floor px, sw
        ny = _.floor py, rh            
        if nx == c.x then c.deltaX += dx else c.deltaX = 0
        if ny == c.y then c.deltaY += dy else c.deltaY = 0
        log c.deltaX, c.deltaY, nx, ny
        
        cell.moveTo nx, ny
        # log cell.config
            
        p = cell.relPos()
        noteIndex = Keyboard.noteIndex cell.config.noteName
        newNoteIndex = @grid.noteIndexAtPos p
        # log noteIndex, newNoteIndex
        cell.config.noteName = Keyboard.allNoteNames()[newNoteIndex]
                
        @grid.scrollToCell cell
        
    moveCellsBy: (cells, dx, dy) =>
        
        [minpos, maxpos] = @grid.cellMaxima cells
        # log dx, dy, minpos, maxpos
        dx = Math.max(dx, -minpos.x)
        dy = Math.max(dy, -minpos.y)
        dx = Math.min(dx, @grid.getWidth()-maxpos.x)
        dy = Math.min(dy, @grid.getHeight()-maxpos.y)
        # log dx, dy
        for c in cells
            @moveCellTo c, c.relPos().plus(pos(dx, dy))
        
    moveCellsInDirection: (cells, direction) =>
        if direction in ['Up', 'Down']
            @moveCellsBy cells, 0, direction == 'Up' and -@grid.config.rowHeight or @grid.config.rowHeight
        if direction in ['Left', 'Right']
            log @config, @grid.stepWidth
            incr = @config.state == 'off' and 2 or @config.steps * @grid.config.stepWidth
            log incr
            @moveCellsBy cells, direction == 'Left' and -incr or incr, 0
        
    cellAddedAt: (cell, pos) => @moveCellTo cell, pos
        
    quantiseMode:      (state) => @config.mode      = state
    quantiseWhenMoved: (state) => @config.whenMoved = state
    quantiseWhenAdded: (state) => @config.whenAdded = state
    quantiseSteps:     (state) => @config.steps = state
    state:             (state) => @config.state = state
