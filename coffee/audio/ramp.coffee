###

00000000    0000000   00     00  00000000 
000   000  000   000  000   000  000   000
0000000    000000000  000000000  00000000 
000   000  000   000  000 0 000  000      
000   000  000   000  000   000  000      

###

class Ramp extends Window

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        cfg = _.def cfg,
            duration     : 2.0
            minDuration  : 0.01
            maxDuration  : 10.0
            durationStep : 0.01
            valueFormat  : "%1.3f"
            resize       : 'horizontal'

        super cfg,
            type     : 'ramp'
            title    : 'ramp'
            children : \
            [
                type     : 'sliderspin'
                id       : 'ramp'
                minValue : 0.0
                maxValue : 1.0
            ,
                type     : 'sliderspin'
                id       : 'ramp_duration'
                value    : cfg.duration
                minValue : cfg.minDuration
                maxValue : cfg.maxDuration
                spinStep : cfg.durationStep
            ,
                type     : 'button'
                text     : 'trigger'
                id       : 'ramp_trigger'
            ]
    
        @connect 'ramp_duration:onValue', @setDuration
        @connect 'button:mousedown',      @triggerDown
        @

    setDuration: (v) => @config.duration = _.value v

    triggerDown: =>
        if @config.reltime != 0
            knix.deanimate @
        Audio.sendParamValuesFromConnector { duration: @config.duration }, @connector 'ramp:onValue'
        @setRelTime 0
        knix.animate @
                            
    anim: (step) =>
        @setRelTime @config.reltime + step.dsecs / @config.duration
        if @config.reltime > 1.0
            knix.deanimate @
            @setRelTime 0

    setRelTime: (rel) =>
        @config.reltime = rel
        @config.value = @config.reltime
        @getChild('ramp').setValue @config.value

    @menu: =>

        @menuButton
            text   : 'ramp'
            icon   : 'fa-external-link-square'
            action : -> new Ramp
                            center: true
