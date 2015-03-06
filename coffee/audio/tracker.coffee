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
            columns  : 16
            rows     : 32
            height   : 32*22+40
            width    : 32*22+40
            
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
                type     : 'button'
                class    : 'playpause window-button-left'
                icon     : 'fa-play'
            ,
                type     : 'button'
                class    : 'stop window-button-left'
                icon     : 'fa-stop'
            ,
                type     : 'toggle'
                class    : 'record window-button-left'
                state    : 'off'
                states   : ['off', 'on']
                icon     : 'fa-circle-o'
                icons    : ['fa-circle-o', 'fa-circle']
            ]            
            child   :
                class    : 'columns'
                children : children
                style    :
                    display : 'table-row'
                    
        @connect 'playpause:click', @playPause
        @connect 'stop:click',      @stop
        @connect 'record:click',    @record
                    
        @columns = @getChild('columns').getChildren()

        @stepDeltaSecs = 1.0 / @config.stepSecs
        @numSteps      = @config.rows
        @step = 
            index : -1
            secs  :  0
            
        for cell in @columns[0].rows
            cell.connect 'mousedown', @onIndicatorDown
        @
        
    onIndicatorDown: (event) =>
        index = event.target.getWidget().config.index
        @gotoStep index        
                
    play: =>
        @playing = true
        @nextStep()
        knix.animate @
        
    pause: =>
        @playing = false
        knix.deanimate @
        
    playPause: => if @playing then @pause() else @play()

    stop: =>
        @cell 0, @step.index, 'off'
        @playing    = false
        @step.index = -1
        @step.secs  =  0
        knix.deanimate @
        
    record: =>
        if @recorder?
            @recorder.close()
            delete @recorder
        else
            @recorder = new Recorder 
                tracker: @elem.id
        
    close: =>        
        if @recorder?
            @recorder.close()
            delete @recorder
        super
        
    cell: (col, row, cb=null) =>
        c = @columns[col].rows[row]
        c?.resolveSlot(cb)?()
        c
        
    nextStep: => @gotoStep @step.index+1
        
    gotoStep: (index) =>
        @cell 0, @step.index, 'off' if @step.index >= 0
        @step.index = (@numSteps+index) % @numSteps
        @step.secs  = Math.max 0, @step.secs-@stepDeltaSecs
        @cell 0, @step.index, 'on'
        
    anim: (step) =>
        @step.secs += step.dsecs
        if @step.secs > @stepDeltaSecs
            @nextStep()
            
    layoutChildren : => @
    sizeWindow     : => @content.resize @contentWidth(), @contentHeight()
            
    @menu: =>

        @menuButton
            text   : 'tracker'
            icon   : 'fa-volume-up'
            keys   : ['t']
            action : -> new Tracker
                            center: true
