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
            steps     : 64
            stepWidth : 23
            stepSecs  : 0.05
                        
        super cfg,
            type      : 'Timeline' 
            width     : Math.min(cfg.steps, 32) * cfg.stepWidth + 8
            height    : 300
            minWidth  : 200
            minHeight : 200
            content   : 'scroll'
            buttons   : \
            [
                type     : 'toggle'
                class    : 'playpause'
                keys     : ['p']
                states   : ['pause', 'play']
                icons    : ['fa-play', 'fa-pause']
            ,
                class    : 'stop'
                icon     : 'fa-stop'
            ,
                type     : 'toggle'
                class    : 'record'
                keys     : ['r']
                states   : ['off', 'on']
                icons    : ['fa-circle-o', 'fa-circle']
            ,
                type     : 'toggle'
                align    : 'right'
                class    : 'follow'
                states   : ['off', 'on']
                icons    : ['fa-unlink', 'fa-link']
            ]            
            children : \
            [
                type      : 'EventGrid'
                steps     : cfg.steps
                stepWidth : cfg.stepWidth
                stepSecs  : cfg.stepSecs
                height    : 200
            ,
                type      : 'TimeRuler' 
                steps     : cfg.steps
                stepWidth : cfg.stepWidth
                stepSecs  : cfg.stepSecs
            ]
        
        @grid = @getChild('EventGrid')
        @grid.timeline = @
        @ruler = @getChild('TimeRuler')
        @ruler.elem.setStyle
            top: '%dpx'.fmt @headerSize()
                
        @content.config.noMove = true    
        @connect 'playpause:trigger', @playPause
        @connect 'follow:onState',    @onFollowState
        @connect 'stop:trigger',      @stop
        @connect 'record:trigger',    @record
        @connect 'content:scroll',    @onScroll
                    
        @numSteps = @config.steps
        @step = 
            index : -1
            secs  :  0  
            
        @elem.style.maxWidth = '%dpx'.fmt(@config.steps * @config.stepWidth + 8)
            
        @sizeWindow()          
        @
            
    onScroll:      (event) => @ruler.moveTo -event.target.scrollLeft     
    onFollowState: (event) => @follow = (event.detail.state == 'on'); log @follow, event.detail.state

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
            @recorder = new Recorder timeline: @elem.id
        
    close: =>        
        if @recorder?
            @recorder.close()
            delete @recorder
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
        @ruler.setLine ct - @startTime
        @gotoStep index
                        
    gotoStep: (index) =>
        # log 'index', index
        # if @step.index >= 0
            # @releaseRow @step.index
        @step.index = (@numSteps+index) % @numSteps
        @step.secs  = Math.max 0, @step.secs-@config.stepSecs
        if @step.index == 0
            @startTime = Audio.context.currentTime + @step.secs
        # @triggerRow @step.index
                
    play: =>
        @playing = true
        @startTime = Audio.context.currentTime - (@step.index+1) * @config.stepSecs
        @nextStep()
        knix.animate @
        
    pause: =>
        @playing = false
        @ruler.setLine (@step.index+1) * @config.stepSecs
        knix.deanimate @
        
    playPause: => if @playing then @pause() else @play()

    stop: =>
        @getChild('playpause').setState 'pause'
        @playing    = false
        @ruler.setLine 0
        @step.index = -1
        @step.secs  =  0
        knix.deanimate @
                
    ###
     0000000   000   000  000  00     00
    000   000  0000  000  000  000   000
    000000000  000 0 000  000  000000000
    000   000  000  0000  000  000 0 000
    000   000  000   000  000  000   000
    ###
        
    anim: (step) =>
        @relTime = Audio.context.currentTime - @startTime
        @ruler.setLine @relTime
        @grid.setTime @relTime
        if @follow
            @content.elem.scrollLeft = @ruler.line.relPos().x - 100
        @step.secs += step.dsecs
        if @step.secs > @config.stepSecs
            @nextStep()
        
    nextStep: => @gotoStep @step.index+1
                    
    @menu: =>

        @menuButton
            text   : 'timeline'
            icon   : 'fa-sliders'
            keys   : ['t']
            action : -> new Timeline
                            center: true
