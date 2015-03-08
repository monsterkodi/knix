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
        
        icon = @config.index % 4 and 'circle-o' or @config.index % 8 and 'dot-circle-o' or 'circle'
        @setText '<i class="fa fa-%s"></i>'.fmt icon
        @off()
        @
        
    on: =>
        @elem.removeClassName 'off'
        @elem.addClassName 'on'

    off: => 
        @elem.removeClassName 'on'
        @elem.addClassName 'off'
