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
            title     :'Timeline'
            steps     : 32
            stepSecs  : 10
                        
        super cfg,
            type    : 'Timeline'
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
            child :
                class    : 'hbox'
                children : \
                [
                    type : 'EventList'
                ,
                    type : 'timescroll'
                    children : \
                    [
                        type : 'TimeRuler'
                    ,
                        type : 'eventscroll'
                        child : 'EventGrid'
                    ] 
                ]
                    
                
        @content.config.noMove = true    
        @connect 'playpause:trigger', @playPause
        @connect 'stop:trigger',      @stop
        @connect 'record:trigger',    @record
        @content.connect 'mousedown', @startSelect
                    
        @stepDeltaSecs = 1.0 / @config.stepSecs
        @numSteps      = @config.steps
        @step = 
            index : -1
            secs  :  0            
        @
            
    ###
    00000000   000       0000000   000   000
    000   000  000      000   000   000 000 
    00000000   000      000000000    00000  
    000        000      000   000     000   
    000        0000000  000   000     000   
    ###
                        
    gotoStep: (index) =>
        log 'index', index
        # if @step.index >= 0
        #     @cell 0, @step.index, 'off'
        #     @releaseRow @step.index
        # @step.index = (@numSteps+index) % @numSteps
        # @step.secs  = Math.max 0, @step.secs-@stepDeltaSecs
        # @cell 0, @step.index, 'on'
        # @triggerRow @step.index
                
    play: =>
        @playing = true
        @nextStep()
        knix.animate @
        
    pause: =>
        @playing = false
        knix.deanimate @
        
    playPause: => if @playing then @pause() else @play()

    stop: =>
        # @ruler @step.index, 'off'
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
        
    layoutChildren : => @
    sizeWindow     : => @content.resize @contentWidth(), @contentHeight()
            
    @menu: =>

        @menuButton
            text   : 'timeline'
            icon   : 'fa-sliders'
            keys   : ['t']
            action : -> new Timeline
                            center: true
