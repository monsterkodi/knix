###

000  000   000  0000000    000   0000000   0000000   000000000   0000000   00000000 
000  0000  000  000   000  000  000       000   000     000     000   000  000   000
000  000 0 000  000   000  000  000       000000000     000     000   000  0000000  
000  000  0000  000   000  000  000       000   000     000     000   000  000   000
000  000   000  0000000    000   0000000  000   000     000      0000000   000   000

###

class TrackCellIndicator extends TrackCell

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type:  'TrackCellIndicator'
            text:  '.'
            class: 'TrackCell off'
            
        @
    
    on: =>
        @elem.removeClassName 'off'
        @elem.addClassName 'on'

    off: => 
        @elem.removeClassName 'on'
        @elem.addClassName 'off'
