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
        
        cfg = _.def cfg,    
            cell : 'TrackCell'
        
        children = []
        for r in [0...cfg.rows]
            children.push
                type  : cfg.cell
                index : r
                                
        super cfg,
            type     : 'TrackColumn'
            noMove   : true
            children : children
            style    :
                display : 'table-cell'
        
        @rows = @getChildren()
        
        if @config.winID? and @config.widID?
            @rec = @getWindow(@config.winID).getChild @config.widID
            log '@rec', @rec.elem.id
        
        @
            
