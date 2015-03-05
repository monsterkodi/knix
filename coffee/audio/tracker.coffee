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
            columns  : 10
            rows     : 64
            height   : 300
            width    : 600
            stepSecs : 10
            title    :'tracker'
            
        children = []
        children.push
            type  : 'TrackColumn'
            rows  : cfg.rows
            cell  : 'TrackCellIndicator' 
            
        for c in [0...cfg.columns]
            children.push
                type  : 'TrackColumn'
                rows  : cfg.rows
            
        super cfg,
            type    : 'Tracker'
            content : 'scroll'
            buttons : \
            [
                type     : 'window-button-left'
                class    : 'playpause'
                child    :
                    type : 'icon'
                    icon : 'fa-play'
            ,
                type     : 'window-button-left'
                class    : 'stop'
                child    :
                    type : 'icon'
                    icon : 'fa-stop'
            ]            
            child   :
                class    : 'columns'
                children : children
                style    :
                    display : 'table-row'
                    
        @connect 'playpause:click', @playPause
        @connect 'stop:click',      @stop
                    
        @columns = @getChild('columns').getChildren()

        @stepDeltaSecs = 1.0 / @config.stepSecs
        @numSteps      = @config.rows
        @step = 
            index : -1
            secs  :  0
            
        log @columns.length
        
        @
                
    play: =>
        # log 'play'
        @playing = true
        @nextStep()
        knix.animate @
        
    pause: =>
        # log 'pause'
        @playing = false
        knix.deanimate @
        
    playPause: => if @playing then @pause() else @play()

    stop: =>
        log 'stop'
        @cell 0, @step.index, 'off'
        @playing    = false
        @step.index = -1
        @step.secs  =  0
        knix.deanimate @
        
    cell: (col, row, cb=null) =>
        c = @columns[col].rows[row]
        c?.resolveSlot(cb)?()
        c
        
    nextStep: =>
        @cell 0, @step.index, 'off'
        @step.index = (@step.index+1) % @numSteps
        @step.secs  = Math.max 0, @step.secs-@stepDeltaSecs
        @cell 0, @step.index, 'on'
        
    anim: (step) =>
        @step.secs += step.dsecs
        if @step.secs > @stepDeltaSecs
            @nextStep()
            
    layoutChildren: =>
        # log 'layout', @config.content
        @

    sizeWindow: =>
        @content.resize @contentWidth(), @contentHeight()
            
    @menu: =>

        @menuButton
            text   : 'tracker'
            icon   : 'fa-volume-up'
            action : -> new Tracker
                            center: true
