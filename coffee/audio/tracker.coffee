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
            index : 0
            
        for c in [0...cfg.columns]
            children.push
                type  : 'TrackColumn'
                rows  : cfg.rows
                index : children.length
            
        super cfg,
            type    : 'Tracker'
            content : 'scroll'
            buttons : \
            [
                class    : 'playpause'
                icon     : 'fa-play'
                keys     : ['p']
            ,
                class    : 'stop'
                icon     : 'fa-stop'
            ,
                type     : 'toggle'
                class    : 'record'
                keys     : ['r']
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
                    
        @connect 'playpause:trigger', @playPause
        @connect 'stop:trigger',      @stop
        @connect 'record:trigger',    @record
                    
        @columns = @getChild('columns').getChildren()
        @columnSets = {}
        @rowColumns = ([] for [0..@config.rows])

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

    addTrigger: (event) =>
        # log 'trigger', event.target.id
        col = @columnFor event.target
        row = col.rows[@step.index]
        @rowColumns[@step.index].push(col.config.index) if col.config.index not in @rowColumns[@step.index]
        row.on()
        
    columnFor: (target) =>
        winKey = target.getWindow().elem.id
        widKey = target.id
        if not @columnSets[winKey]?
            @columnSets[winKey] = {}
        cs = @columnSets[winKey]
        if not cs[widKey]?
            cs[widKey] = new TrackColumn
                        rows   : @config.rows
                        parent : @getChild 'columns'
                        index  : @columns.length
                        winID  : winKey
                        widID  : widKey
                        
            @columns.push cs[widKey]
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
        log 'record'
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
        @stop()
        super
        
    cell: (col, row, cb=null) =>
        if typeof col == 'number'
            col = @columns[col]
        cell = col.rows[row]    
        cell?.resolveSlot(cb)?()
        cell
        
    nextStep: => @gotoStep @step.index+1
        
    gotoStep: (index) =>
        @cell 0, @step.index, 'off' if @step.index >= 0
        @step.index = (@numSteps+index) % @numSteps
        @step.secs  = Math.max 0, @step.secs-@stepDeltaSecs
        @cell 0, @step.index, 'on'
        @triggerRow @step.index
        
    triggerRow: (rowIndex) =>
        # log 'rowIndex', rowIndex, @rowColumns[rowIndex] #, @rowColumns
        for colIndex in @rowColumns[rowIndex]
            # log 'trigger', colIndex, @columns[colIndex].elem.id, rowIndex
            # log 'trigger', @columns[colIndex].rec, @columns[colIndex].rec.trigger?
            @columns[colIndex].rec?.trigger()
        
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
