###

000000000  000  00     00  00000000  000      000  000   000  00000000
   000     000  000   000  000       000      000  0000  000  000     
   000     000  000000000  0000000   000      000  000 0 000  0000000 
   000     000  000 0 000  000       000      000  000  0000  000     
   000     000  000   000  00000000  0000000  000  000   000  00000000

###

class Timeline extends Window

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg = _.def cfg,
            title     : 'timeline'
            steps     : 32
            stepWidth : 23
            stepSecs  : 0.15
                        
        super cfg,
            type      : 'Timeline' 
            width     : Math.min(cfg.steps, 32) * cfg.stepWidth + 38
            height    : 300
            minHeight : 200
            buttons   : Timeline.toolButtons
            children : \
            [
                type: 'hbox'
                children : \
                [
                    type  : 'connector'
                    slot  : 'noteIn'
                ,
                    type      : 'sliderspin'
                    class     : 'speed'
                    value     : cfg.stepSecs
                    sliderStep : 0.001
                    spinStep   : 0.001
                    spinFormat: "%1.3f"
                    minValue  : 0.01
                    maxValue  : 0.5
                    style     :
                        width : '100%'
                ,
                    type   : 'connector'
                    signal : 'noteOut'
                ]
            ,
                type      : 'TimeRuler' 
                steps     : cfg.steps
                stepWidth : cfg.stepWidth
            ,
                type    : 'EventGridBox'
                style   : 
                    position : 'relative'
                    overflow : 'scroll'
                    left     : '0px'
                    right    : '0px'
                    marginBottom: '0px'
                children : \
                [
                    type      : 'EventGrid'
                    steps     : cfg.steps
                    stepWidth : cfg.stepWidth
                    stepSecs  : cfg.stepSecs
                ,
                    type      : 'EventLine'
                    width     : 1
                    style     :
                        position : 'absolute'
                        top      : '0px'
                ]
            ]
        
        @grid  = @getChild('EventGrid')
        @ruler = @getChild('TimeRuler')
        @line  = @getChild('EventLine')
        @box   = @getChild('EventGridBox')
        @scrollElem = @box.elem
        
        @grid.timeline = @
        @grid.connect 'mousedown', @onGridMouseDown
        @box.connect  'mousedown', @onGridMouseDown        
        @box.config.noMove = true    
        
        @connect 'playpause:trigger',   @playPause
        @connect 'follow:onState',      @onFollowState
        @connect 'stop:trigger',        @stop
        @connect 'record:onState',      @record
        @connect 'EventGridBox:scroll', @onScroll
        @connect 'trash:trigger',       @trash
        @connect 'EventGrid:size',      @onGridSize
        @connect 'speed:onValue',       @setSpeed
        @connect 'speed:onValue',       'grid:setSpeed'
                    
        @numSteps = @config.steps
        @step = 
            index : -1
            secs  :  0  
            
        @elem.style.maxWidth = '%dpx'.fmt(@config.steps * @config.stepWidth + 38)            
        
        @getChild('quantise').setState 'on'    
        
        @
    
    ###
    0000000    000   000  000000000  000000000   0000000   000   000   0000000
    000   000  000   000     000        000     000   000  0000  000  000     
    0000000    000   000     000        000     000   000  000 0 000  0000000 
    000   000  000   000     000        000     000   000  000  0000       000
    0000000     0000000      000        000      0000000   000   000  0000000 
    ###
    
    @toolButtons = \
        [
            type      : 'toggle'
            class     : 'playpause'
            keys      : ['p']
            states    : ['pause', 'play']
            icons     : ['fa-play', 'fa-pause']
        ,
            class     : 'stop'
            icon      : 'fa-stop'
        ,
            type      : 'toggle'
            class     : 'record'
            keys      : ['r']
            states    : ['off', 'on']
            icons     : ['fa-circle-o', 'fa-circle']                
        ,
            type      : 'toggle'
            class     : 'follow'
            states    : ['off', 'on']
            icons     : ['fa-unlink', 'fa-link']
        ,
            type      : 'toggle'
            class     : 'editMode'
            configKey : 'editMode'
            keys      : ['e']
            state     : 'single'
            states    : ['multi', 'single']
            icons     : ['fa-th', 'fa-pencil']
        , # ------------------------------------
            align     : 'right'
            type      : 'toggle'
            class     : 'quantise'
            configKey : 'grid.quantiser.state'
            keys      : ['q']
            states    : ['off', 'on']
            icons     : ['fa-square-o', 'fa-check-square']
        ,
            type      : 'toggle'
            class     : 'quantiseSteps'
            configKey : 'grid.quantiser.quantiseSteps'
            state     : 2
            states    : [1, 2, 4, 8]
            icons     : ['fa-circle-o', 'fa-dot-circle-o', 'fa-bullseye', 'fa-circle']
        ,
            type      : 'toggle'
            class     : 'quantiseMode'
            configKey : 'grid.quantiser.quantiseMode'
            state     : 'start length'
            states    : ['length', 'start', 'start length']
            icons     : ['fa-minus-square', 'fa-plus-square', 'fa-h-square']
        ,
            class     : 'trash'
            icon      : 'fa-trash-o' 
        ] 
        
    ###
    00000000  000   000  00000000  000   000  000000000   0000000
    000       000   000  000       0000  000     000     000     
    0000000    000 000   0000000   000 0 000     000     0000000 
    000          000     000       000  0000     000          000
    00000000      0      00000000  000   000     000     0000000 
    ###
        
    setSpeed:        (v) => @config.stepSecs = _.value v
            
    onScroll:        (event) => @ruler.moveTo -event.target.scrollLeft
    onFollowState:   (event) => @follow = (event.detail.state == 'on')
    onGridSize:      (event) => @line.setHeight @grid.getHeight()
    editMode:        (state) => 
        @config.editMode = state
        @grid.elem.setStyle
            cursor : ((state == 'multi') and 'crosshair' or 'pointer')
    onGridMouseDown: (event) => 
        # log @config.editMode
        if @config.editMode == 'multi'
            Selectangle.start @grid
        else
            selected = false
            for wid in @grid.allChildren()
                if wid.elem.hasClassName 'selected'
                    wid.elem.removeClassName 'selected'
                    selected = true
            if not selected
                relPos = Stage.absPos(event).minus(@box.absPos())
                c = @grid.addNote
                    event    : 'trigger'
                    noteName : @grid.noteNameAtPos relPos
                    width    : @config.stepWidth
                    x        : relPos.x
                    y        : relPos.y
                @grid.activeCells.splice @grid.activeCells.indexOf(c), 1
        event.stop()
                        
    trash: => 
        @stopCells()
        @grid.removeAllCells()
        @onGridSize()
    
    sizeWindow: =>
        super
        @content.setWidth  @contentWidth()
        @content.setHeight @contentHeight()
        @getChild('hbox').setWidth @contentWidth()-10
        height = @content.innerHeight() - 96
        width  = @content.innerWidth() - 40
        @box.resize width, height
        @onGridSize()
        
    ###
    000000000  000  00     00  00000000
       000     000  000   000  000     
       000     000  000000000  0000000 
       000     000  000 0 000  000     
       000     000  000   000  00000000
    ###

    timeToX: (time) => time * @config.stepWidth / @config.stepSecs
    xToTime:    (x) => x/@config.stepWidth * @config.stepSecs 

    cellsAtTime: (time) => 
        cells = []
        x = @timeToX time
        for c in @grid.children()
            p = c.relPos()
            cells.push(c) if p.x < x < p.x+c.getWidth()
        cells

    setTime: (time) =>
        @relTime = time
        @grid.setTime @relTime
        @line.moveTo @timeToX @relTime
        
    ###
    00000000   00000000   0000000   0000000   00000000   0000000  
    000   000  000       000       000   000  000   000  000   000
    0000000    0000000   000       000   000  0000000    000   000
    000   000  000       000       000   000  000   000  000   000
    000   000  00000000   0000000   0000000   000   000  0000000  
    ###
    
    noteIn: (event) => 
        # log event.detail
        if @config.recording == 'on'
            @grid.scrollToCells [@grid.addNote event.detail]
        @emit 'noteOut', event.detail
        
    record: (event) => 
        @config.recording = event.detail.state
        
    close: =>
        @stop()
        super
    
    ###
    00000000   000       0000000   000   000
    000   000  000      000   000   000 000 
    00000000   000      000000000    00000  
    000        000      000   000     000   
    000        0000000  000   000     000   
    ###
                    
    setStep: (index) =>
        ct = Audio.context.currentTime
        @startTime = ct - index * @config.stepSecs
        @setTime ct - @startTime
        @gotoStep index
        
    nextStep: => @gotoStep @step.index+1
                        
    gotoStep: (index) =>
        @step.index = (@numSteps+index) % @numSteps
        @step.secs  = Math.max 0, @step.secs-@config.stepSecs
        if @step.index == 0
            @startTime = Audio.context.currentTime + @step.secs
        if @playing
            @execStep @step.index
        
    triggerCell: (c) => @emit 'noteOut', { noteName: c.config.noteName, event: 'trigger' }    
    releaseCell: (c) => @emit 'noteOut', { noteName: c.config.noteName, event: 'release' }    
    
    execStep: (index) =>
        for c in @grid.children()
            p = c.relPos()
            ds = p.x - index * @config.stepWidth
            if  0 <= ds < @config.stepWidth
                @triggerCell c
            de = p.x + c.getWidth() - index * @config.stepWidth
            if 0 <= de < @config.stepWidth
                if c not in @grid.activeCells
                    @releaseCell c
                
    play: =>
        @playing = true
        @startTime = Audio.context.currentTime - (@step.index+1) * @config.stepSecs
        @gotoStep @step.index
        knix.animate @
        
    pause: =>
        @stopCells()
        @playing = false
        @setTime (@step.index+1) * @config.stepSecs
        knix.deanimate @
        
    playPause: => if @playing then @pause() else @play()

    stopCells: => 
        if @playing
            for c in @cellsAtTime @relTime
                @releaseCell c
        
    stop: =>
        @stopCells()
        @getChild('record').setState 'off'
        @getChild('playpause').setState 'pause'
        @playing = false
        knix.deanimate @
        @setStep 0
        if @follow
            @content.elem.scrollLeft = 0
                
    ###
     0000000   000   000  000  00     00
    000   000  0000  000  000  000   000
    000000000  000 0 000  000  000000000
    000   000  000  0000  000  000 0 000
    000   000  000   000  000  000   000
    ###
        
    anim: (step) =>
        @setTime Audio.context.currentTime - @startTime
        if @follow
            @box.elem.scrollLeft = @line.relPos().x - 100
        @step.secs += step.dsecs
        if @step.secs > @config.stepSecs
            @nextStep()
                            
    @menu: =>

        @menuButton
            text   : 'timeline'
            icon   : 'fa-sliders'
            keys   : ['t']
            action : -> new Timeline
                            center: true
