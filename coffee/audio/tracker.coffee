###

000000000  00000000    0000000    0000000  000   000  00000000  00000000 
   000     000   000  000   000  000       000  000   000       000   000
   000     0000000    000000000  000       0000000    0000000   0000000  
   000     000   000  000   000  000       000  000   000       000   000
   000     000   000  000   000   0000000  000   000  00000000  000   000

###

class Tracker extends Window

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            columns   : 4
            rows      : 4
            title     :'tracker'

        children = []
        for c in [0...cfg.columns]
            children.push
                type: 'TrackColumn'
                rows: cfg.rows
            
        super cfg,
            type: 'Tracker'
            children: children
            
    @menu: =>

        @menuButton
            text   : 'tracker'
            icon   : 'fa-volume-up'
            action : -> new Tracker
                            center: true
