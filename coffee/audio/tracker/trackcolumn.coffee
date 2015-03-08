###

000000000  00000000    0000000    0000000  000   000   0000000   0000000   000      000   000  00     00  000   000
   000     000   000  000   000  000       000  000   000       000   000  000      000   000  000   000  0000  000
   000     0000000    000000000  000       0000000    000       000   000  000      000   000  000000000  000 0 000
   000     000   000  000   000  000       000  000   000       000   000  000      000   000  000 0 000  000  0000
   000     000   000  000   000   0000000  000   000   0000000   0000000   0000000   0000000   000   000  000   000

###

class TrackColumn extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
                
        children = []
        for r in [0...cfg.rows]
            children.push
                type  : cfg.cell
                index : r
                                
        super cfg,
            type     : 'TrackColumn'
            noMove   : true
            noSelect : true
            children : children
            style    :
                display : 'table-cell'
        
        @rows = @children()
        
        if @config.winID? and @config.widID?
            log 'rec', @getWindow(@config.winID)?, @getWindow(@config.winID)?.getChild?(@config.widID)
            @rec = @getWindow(@config.winID).getChild @config.widID
            log '@rec', @rec?.elem.id, @config.winID, @config.widID        
        @
            
