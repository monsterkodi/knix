###

000000000  00000000    0000000    0000000  000   000   0000000  00000000  000      000    
   000     000   000  000   000  000       000  000   000       000       000      000    
   000     0000000    000000000  000       0000000    000       0000000   000      000    
   000     000   000  000   000  000       000  000   000       000       000      000    
   000     000   000  000   000   0000000  000   000   0000000  00000000  0000000  0000000

###

class TrackCell extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            class: 'TrackCell'
        @    
                
    column:  => @getParent 'TrackColumn'
    tracker: => @getParent 'Tracker'
        
