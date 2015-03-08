###

000   000   0000000   000      000   000  00000000   0000000  00000000  000      000    
000   000  000   000  000      000   000  000       000       000       000      000    
 000 000   000000000  000      000   000  0000000   000       0000000   000      000    
   000     000   000  000      000   000  000       000       000       000      000    
    0      000   000  0000000   0000000   00000000   0000000  00000000  0000000  0000000

###

class ValueCell extends TrackCell

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type: 'ValueCell'
            text: '<i class="fa fa-angle-right"></i>'
        @
            
    del: => @clear(); @setText '<i class="fa fa-angle-right"></i>'
            
    hasValue: => @elem.firstChild.widget?
    value: => @elem.firstChild.widget.config.value
