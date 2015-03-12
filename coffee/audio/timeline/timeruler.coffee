
class TimeRuler extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
                
        children = []
        for r in [0...cfg.steps]
            children.push
                type  : cfg.cell
                index : r
                                
        super cfg,
            type     : 'TimeRuler'
            noMove   : true
            noSelect : true
            children : children
        @

    onIndicatorDown: (event) =>
        index = event.target.getWidget().config.index
        @gotoStep index        
