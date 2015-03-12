

class EventRow extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type: 'EventRow'
        
        @