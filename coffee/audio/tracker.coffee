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
            columns : 10
            rows    : 4
            title   :'tracker'

        children = []
        for c in [0...cfg.columns]
            children.push
                type  : 'TrackColumn'
                rows  : cfg.rows
                style : 
                    display : 'table-cell'
            
        super cfg,
            type    : 'Tracker'
            content : 'scroll'
            child   :
                children : children
                style    :
                    display : 'table-row'
        
    layoutChildren: =>
        log 'layout', @config.content
        @

    sizeWindow: =>
        @content.resize @contentWidth(), @contentHeight()
            
    @menu: =>

        @menuButton
            text   : 'tracker'
            icon   : 'fa-volume-up'
            action : -> new Tracker
                            center: true
