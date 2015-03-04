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
                type: 'TrackCell'
                
        super cfg,
            type: 'TrackColumn'
            elem: 'span'
            style:
                # float: 'left'
                display: 'table-cell'
            children: children
            
            
