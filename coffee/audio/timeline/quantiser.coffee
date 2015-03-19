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
        @grid.connect 'cellMoved', @onCellMoved
        @grid.connect 'cellAdded', @onCellAdded
        @ 
        
    quantiseCell: (cell, dx=0, dy=0) =>
        c = cell.config
        ox = c.deltaX or 0
        oy = c.deltaY or 0
        # dbg ox, oy
        nx = _.round c.x+ox+dx, @grid.config.stepWidth * @config.steps
        ny = _.round c.y+oy+dy, @grid.config.rowHeight
        if nx == c.x then c.deltaX += dx else c.deltaX = c.x+ox+dx-nx
        if ny == c.y then c.deltaY += dy else c.deltaY = c.y+oy+dy-ny
        # dbg c.x, c.y, dx, dy, ox, oy, nx, ny
        cell.moveTo nx, ny
        # dbg c.x, c.y, c.deltaX, c.deltaY
        
    onCellAdded: (event) => 
        if @config.whenAdded == 'on'
            @quantiseCell event.detail.cell

    onCellMoved: (event) => 
        if @config.whenMoved == 'on'
            @quantiseCell event.detail.cell, event.detail.dx, event.detail.dy
        
    close: => 
        @grid.disconnect 'cellMoved', @onCellMoved
        @grid.disconnect 'cellAdded', @onCellAdded
        log 'close'
