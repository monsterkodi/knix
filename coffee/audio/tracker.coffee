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
            buttons : \
            [
                type     : "window-button-left"
                onClick  : @start
                child    :
                    type : 'icon'
                    icon : 'fa-play'
            ,
                type     : "window-button-left"
                onClick  : @pause
                child    :
                    type : 'icon'
                    icon : 'fa-pause'
            ,
                type     : "window-button-left"
                onClick  : @stop
                child    :
                    type : 'icon'
                    icon : 'fa-stop'
            ]            
            child   :
                children : children
                style    :
                    display : 'table-row'
        
    layoutChildren: =>
        log 'layout', @config.content
        @

    sizeWindow: =>
        @content.resize @contentWidth(), @contentHeight()
        
    start: =>
        log 'start'
        knix.animate @
        
    pause: =>
        log 'pause'
        knix.deanimate @

    stop: =>
        log 'stop'
        knix.deanimate @
        
    anim: (step) =>
        log 'step', step
            
    @menu: =>

        @menuButton
            text   : 'tracker'
            icon   : 'fa-volume-up'
            action : -> new Tracker
                            center: true
