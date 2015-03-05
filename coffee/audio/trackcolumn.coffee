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
            cell: 'TrackCell'
        
        children = []
        for r in [0...cfg.rows]
            children.push
                type: cfg.cell
                                
        super cfg,
            type: 'TrackColumn'
            # elem: 'span'
            style:
                display: 'table-cell'
            children: children
            
        @rows = @getChildren()
        # for row in [0...@rows.length]
        #     @rows[row].setText '%d'.fmt row
        # log @rows
        # log @
        @
            
