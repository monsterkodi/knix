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
        
    quantiseCell: (cell) =>
        c = cell.config
        dbg c.x, c.y, c.width, c.height
        
    onCellAdded: (event) => 
        if @config.whenAdded = 'on'
            @quantiseCell event.detail.cell

    onCellMoved: (event) => 
        if @config.whenMoved = 'on'
            @quantiseCell event.detail.cell
        
    close: => 
        @grid.disconnect 'cellMoved', @onCellMoved
        @grid.disconnect 'cellAdded', @onCellAdded
        log 'close'
