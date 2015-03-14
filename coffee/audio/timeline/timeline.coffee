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
                class   : 'trash'
                align   : 'right'
                icon    : 'octicon-trashcan'                
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
        @connect 'trash:trigger',     @grid.removeAllCells
                    
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
        
    setTime: (time) =>
        @relTime = time
        @ruler.setTime @relTime
        @grid.setTime @relTime
        
    setStep: (index) =>
        ct = Audio.context.currentTime
        @startTime = ct - index * @config.stepSecs
        @setTime ct - @startTime
        @gotoStep index
        
    nextStep: => @gotoStep @step.index+1
                        
    gotoStep: (index) =>
        @step.index = (@numSteps+index) % @numSteps
        # log 'index', @step.index
        @step.secs  = Math.max 0, @step.secs-@config.stepSecs
        if @step.index == 0
            @startTime = Audio.context.currentTime + @step.secs
        if @playing
            @execStep @step.index
            
    execStep: (index) =>
        for c in @grid.children()
            p = c.relPos()
            ds = p.x - index * @config.stepWidth
            if  0 <= ds < @config.stepWidth
                c.trigger()
            de = p.x + c.getWidth() - index * @config.stepWidth
            if 0 <= de < @config.stepWidth
                c.release()
                
    play: =>
        @playing = true
        @startTime = Audio.context.currentTime - (@step.index+1) * @config.stepSecs
        @gotoStep @step.index
        knix.animate @
        
    pause: =>
        @playing = false
        @setTime (@step.index+1) * @config.stepSecs
        knix.deanimate @
        
    playPause: => if @playing then @pause() else @play()

    stop: =>
        @getChild('playpause').setState 'pause'
        @playing = false
        knix.deanimate @
        @setStep 0
        # @step.index = -1
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
            @content.elem.scrollLeft = @ruler.line.relPos().x - 100
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
