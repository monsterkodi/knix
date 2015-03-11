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

        # log cfg
        
        cfg = _.def cfg,
            columns   : 0
            rows      : 32
            height    : 32*22+40
            width     : 32*22+40
            stepSecs  : 10
            title     :'tracker'
            
        children = []
        children.push
            type  : 'TrackColumn'
            rows  : cfg.rows
            cell  : 'IndicatorCell' 
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
                type     : 'toggle'
                class    : 'playpause'
                keys     : ['p']
                state    : 'pause'
                states   : ['pause', 'play']
                icon     : 'fa-play'
                icons    : ['fa-play', 'fa-pause']
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
                
        @content.config.noMove = true    
        @connect 'playpause:trigger', @playPause
        @connect 'stop:trigger',      @stop
        @connect 'record:trigger',    @record
        @content.connect 'mousedown', @startSelect
                    
        @columns = @getChild('columns').children()
        @columnSets = {}
        @rowColumns = ([] for [0..@config.rows])
        @releaseRowColumns = ([] for [0..@config.rows])

        @stepDeltaSecs = 1.0 / @config.stepSecs
        @numSteps      = @config.rows
        @step = 
            index : -1
            secs  :  0
            
        for cell in @columns[0].rows
            cell.connect 'mousedown', @onIndicatorDown
        @
        
    ###
     0000000   0000000   000      000   000  00     00  000   000
    000       000   000  000      000   000  000   000  0000  000
    000       000   000  000      000   000  000000000  000 0 000
    000       000   000  000      000   000  000 0 000  000  0000
     0000000   0000000   0000000   0000000   000   000  000   000
    ###
            
    columnFor: (target) =>
        winKey = target.getWindow().elem.id
        widKey = target.id
        if not @columnSets[winKey]?
            @columnSets[winKey] = {}
        cs = @columnSets[winKey]
        if not cs[widKey]?
            cellType = target.getWidget().constructor.name == 'Button' and 'TriggerCell' or 'ValueCell'
            log '._', target.getWindow().getChild(widKey)
            cs[widKey] = new TrackColumn
                        rows   : @config.rows
                        parent : @getChild 'columns'
                        index  : @columns.length
                        cell   : cellType
                        winID  : winKey
                        widID  : widKey
                        
            @columns.push cs[widKey]
        cs[widKey]

    ###
     0000000  00000000  000      000    
    000       000       000      000    
    000       0000000   000      000    
    000       000       000      000    
     0000000  00000000  0000000  0000000
    ###
    cell: (col, row, cb=null) =>
        if typeof col == 'number'
            col = @columns[col]
        cell = col.rows[row]    
        cell?.resolveSlot(cb)?()
        cell
    
    ###
     0000000  00000000  000      00000000   0000000  000000000
    000       000       000      000       000          000   
    0000000   0000000   000      0000000   000          000   
         000  000       000      000       000          000   
    0000000   00000000  0000000  00000000   0000000     000   
    ###
    
    startSelect: (event) =>
        Selectangle.start @content
        event.stop()
        # event.stopPropagation()    
    
    ###
    00000000   000       0000000   000   000
    000   000  000      000   000   000 000 
    00000000   000      000000000    00000  
    000        000      000   000     000   
    000        0000000  000   000     000   
    ###
        
    onIndicatorDown: (event) =>
        index = event.target.getWidget().config.index
        @gotoStep index        
                
    gotoStep: (index) =>
        if @step.index >= 0
            @cell 0, @step.index, 'off'
            @releaseRow @step.index
        @step.index = (@numSteps+index) % @numSteps
        @step.secs  = Math.max 0, @step.secs-@stepDeltaSecs
        @cell 0, @step.index, 'on'
        @triggerRow @step.index
                
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
        @getChild('playpause').setState 'pause'
        @playing    = false
        @step.index = -1
        @step.secs  =  0
        knix.deanimate @

    ###
    00000000   00000000   0000000   0000000   00000000   0000000  
    000   000  000       000       000   000  000   000  000   000
    0000000    0000000   000       000   000  0000000    000   000
    000   000  000       000       000   000  000   000  000   000
    000   000  00000000   0000000   0000000   000   000  0000000  
    ###
        
    record: =>
        if @recorder?
            @recorder.close()
            delete @recorder
        else if @elem?
            @recorder = new Recorder tracker: @elem.id
        
    close: =>        
        if @recorder?
            @recorder.close()
            delete @recorder
        @stop()
        super
                
    ###
     0000000   000   000  000  00     00
    000   000  0000  000  000  000   000
    000000000  000 0 000  000  000000000
    000   000  000  0000  000  000 0 000
    000   000  000   000  000  000   000
    ###
        
    anim: (step) =>
        @step.secs += step.dsecs
        if @step.secs > @stepDeltaSecs
            @nextStep()
        
    nextStep: => @gotoStep @step.index+1
        
    ###
    000000000  00000000   000   0000000    0000000   00000000  00000000 
       000     000   000  000  000        000        000       000   000
       000     0000000    000  000  0000  000  0000  0000000   0000000  
       000     000   000  000  000   000  000   000  000       000   000
       000     000   000  000   0000000    0000000   00000000  000   000
    ###
        
    addTrigger: (target) =>
        col = @columnFor target
        row = col.rows[@step.index]
        @setTrigger row
        row.on()

    addRelease: (target) =>
        col = @columnFor target
        row = col.rows[@step.index]
        @setRelease row
        row.on()
        
    setTrigger: (cell) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].push(colIndex) if colIndex not in @rowColumns[rowIndex]

    setRelease: (cell) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @releaseRowColumns[rowIndex].push(colIndex) if colIndex not in @releaseRowColumns[rowIndex]
        
    delTrigger: (cell) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].splice(@rowColumns[rowIndex].indexOf(colIndex),1) if colIndex in @rowColumns[rowIndex]
        
    triggerRow: (rowIndex) =>
        triggers = []
        for colIndex in @rowColumns[rowIndex]
            col = @columns[colIndex]
            row = col.rows[rowIndex]
            if row.isOn?()
                triggers.push col.rec
            else if row.hasValue?()
                col.rec.getWindow().config[col.rec.config.recKey] = row.value()
        for trigger in triggers
            trigger.trigger?()

    releaseRow: (rowIndex) =>
        releases = []
        for colIndex in @releaseRowColumns[rowIndex]
            col = @columns[colIndex]
            row = col.rows[rowIndex]
            if row.isOn?()
                releases.push col.rec
        for release in releases
            release.release?()

    ###
    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000     
     000 000   000000000  000      000   000  0000000 
       000     000   000  000      000   000  000     
        0      000   000  0000000   0000000   00000000
    ###
                
    addValue: (valueWidget) =>
        # log 'value', valueWidget.elem.id, valueWidget.config.value
        col = @columnFor valueWidget.elem
        row = col.rows[@step.index]
        @setValue row, valueWidget
        row.on()
        
    setValue: (cell, valueWidget) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].push(colIndex) if colIndex not in @rowColumns[rowIndex]   
        cell.clear()
        cell.insertChild valueWidget.config
                    
    layoutChildren : => @
    sizeWindow     : => @content.resize @contentWidth(), @contentHeight()
            
    @menu: =>

        @menuButton
            text   : 'tracker'
            icon   : 'fa-volume-up'
            keys   : ['t']
            action : -> new Tracker
                            center: true
