###

000  000   000  0000000    000   0000000   0000000   000000000   0000000   00000000 
000  0000  000  000   000  000  000       000   000     000     000   000  000   000
000  000 0 000  000   000  000  000       000000000     000     000   000  0000000  
000  000  0000  000   000  000  000       000   000     000     000   000  000   000
000  000   000  0000000    000   0000000  000   000     000      0000000   000   000

###

class IndicatorCell extends TrackCell

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type:  'IndicatorCell'
            class: 'TrackCell off'
            text:  '<i class="fa fa-circle-thin"></i>'
        @
        
    on: =>
        @elem.removeClassName 'off'
        @elem.addClassName 'on'
        @setText '<i class="fa fa-circle"></i>'

    off: => 
        @elem.removeClassName 'on'
        @elem.addClassName 'off'
        @setText '<i class="fa fa-circle-thin"></i>'
