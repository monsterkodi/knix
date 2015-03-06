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
            columns  : 0
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
                class    : 'playpause'
                icon     : 'fa-play'
            ,
                class    : 'stop'
                icon     : 'fa-stop'
            ,
                type     : 'toggle'
                class    : 'record'
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
        @columnSets = {}

        @stepDeltaSecs = 1.0 / @config.stepSecs
        @numSteps      = @config.rows
        @step = 
            index : -1
            secs  :  0
            
        for cell in @columns[0].rows
            cell.connect 'mousedown', @onIndicatorDown
        @
    
    addValue: (event) =>    
        log 'value', event.target.id, _.value event   

    addButton: (event) =>
        log 'value', event.target.id
        col = @columnFor event.target
        row = col.rows[@step.index]
        # log row.elem.id
        row.on()
        
    columnFor: (target) =>
        winKey = target.getWindow().elem.id
        widKey = target.id
        if not @columnSets[winKey]?
            log 'new set', winKey
            @columnSets[winKey] = {}
        cs = @columnSets[winKey]
        if not cs[widKey]?
            log 'new col', widKey
            cs[widKey] = new TrackColumn
                        rows   : @config.rows
                        parent : @getChild 'columns'
            @columns.push cs[widKey]
        # log cs[widKey].elem.id            
        cs[widKey]
        
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
