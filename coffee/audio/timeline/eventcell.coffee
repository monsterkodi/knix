
class EventCell extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type   : 'EventCell'
            width  : 10
            height : 10
            style  :
                backgroundColor : 'yellow'
                position        : 'absolute'
        
        @