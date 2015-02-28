
###

00000000  000   000  000   000  00000000  000       0000000   00000000   00000000
000       0000  000  000   000  000       000      000   000  000   000  000     
0000000   000 0 000   000 000   0000000   000      000   000  00000000   0000000 
000       000  0000     000     000       000      000   000  000        000     
00000000  000   000      0      00000000  0000000   0000000   000        00000000

###

class Envelope extends Window

    init: (cfg, defs) =>        
    
        _.def cfg, defs

        cfg = _.def cfg,
            duration:     4.0
            minDuration:  0.01
            maxDuration:  10.0
            durationStep: 0.01
            valueFormat:  "%0.3f"

        super cfg,
            title: 'envelope'
            children: \
            [
                type:       'pad'
                id:         'envelope_pad'
                numHandles:  3
                vals:        [pos(0,0), pos(0.5,1), pos(1,0)]
                minHeight:   50
                minWidth:    150
            ,
                type:       'sliderspin'
                id:         'envelope_duration'
                onValue:    @setDuration
                value:      cfg.duration
                minValue:   cfg.minDuration
                maxValue:   cfg.maxDuration
                spinStep:   cfg.durationStep
            ,
                type:       'hbox'
                children:   \
                [
                    type:       'connector'
                    slot:       'envelope:trigger'
                ,
                    type:       'value-button'
                    text:       'trigger'
                    onDown:     @triggerDown
                ,
                    type:       'spin'
                    id:         'envelope'
                    valueStep:  0.00001
                    minWidth:   100
                    maxWidth:   10000
                    format:     cfg.valueFormat
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    signal:     'envelope:onValue'
                ]
            ]

        @pad = @getChild 'envelope_pad'
        @sizeWindow()

    setDuration: (v) => @config.duration = _.value v

    trigger: => log 'trigger'
    
    triggerDownX: => 
        if @config.reltime != 0
            clearInterval @timer if @timer
        @setRelTime 0
        @lastStep = Date.now()
        @timer = setInterval(@step, 1)
        @animSteps = 0

    triggerDown: => 
        if @config.reltime != 0
            knix.deanimate @
        @setRelTime 0
        knix.animate @
        @animSteps = 0
                
    step: =>
        thisStep = Date.now()
        dsecs = (thisStep - @lastStep) * 0.001
        @lastStep = thisStep
        @setRelTime @config.reltime + dsecs / @config.duration
        @pad.showRuler @config.reltime, @config.value
        @animSteps += 1
        if @config.reltime > 1.0
            @pad.hideRuler()
            clearInterval @timer
            @timer = null
            @setRelTime 0 
            log 'steps', @animSteps
            
    anim: (step) =>
        @setRelTime @config.reltime + step.dsecs / @config.duration
        @pad.showRuler @config.reltime, @config.value
        @animSteps += 1
        if @config.reltime > 1.0
            @pad.hideRuler()
            knix.deanimate @
            @setRelTime 0
            log 'anims', @animSteps

    setRelTime: (rel) =>
        @config.reltime = rel
        @config.value = @pad.valAtRel rel
        @getChild('envelope').setValue @config.value
        @emitValue @config.value

    sizeWindow: =>
        pad = @getChild 'pad'
        if pad?
            content = @getChild 'content'
            content.setHeight @contentHeight()
            height = content.innerHeight() - 80
            width  = content.innerWidth() - 20
            pad.setSize width, height

    @menu: =>

        knix.create
            type:   'button'
            id:     'new_envelope'
            icon:   'octicon-diff-modified'
            class:  'tool-button'
            parent: 'menu'
            onClick: -> new Envelope
                            center: true
