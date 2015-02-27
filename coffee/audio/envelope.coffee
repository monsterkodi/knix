
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
            duration:     1.0
            minDuration:  0.01
            maxDuration:  10.0
            durationStep: 0.01
            scale:        1.0
            minScale:     0.01
            maxScale:     10.0
            scaleStep:    0.01
            offset:       0.0
            minOffset:   -10.0
            maxOffset:    10.0
            offsetStep:   0.1
            id:           'envelope'
            valueFormat:  "%0.3f"

        super cfg,
            title: 'envelope'
            id:    cfg.id
            children: \
            [
                type:       'pad'
                id:         cfg.id+'_pad'
                numHandles:  7
                minHeight:   50
                minWidth:    150
            ,
                type:       'sliderspin'
                id:         cfg.id+'_duration'
                onValue:    @setDuration
                value:      cfg.duration
                minValue:   cfg.minDuration
                maxValue:   cfg.maxDuration
                valueStep:  cfg.durationStep
            ,
                type:       'sliderspin'
                id:         cfg.id+'_offset'
                onValue:    @setOffset
                value:      cfg.offset
                minValue:   cfg.minOffset
                maxValue:   cfg.maxOffset
                spinStep:   cfg.offsetStep
            ,
                type:       'sliderspin'
                id:         cfg.id+'_scale'
                onValue:    @setScale
                value:      cfg.scale
                minValue:   cfg.minScale
                maxValue:   cfg.maxScale
                spinStep:   cfg.scaleStep
            ,
                type:       'hbox'
                children:   \
                [
                    type:       'connector'
                    slot:       cfg.id+':trigger'
                ,
                    type:       'value-button'
                    text:       'trigger'
                    onDown:     @triggerDown
                ,
                    type:       'spin'
                    id:         cfg.id+'_value'
                    valueStep:  0.001
                    minValue:   -Number.MAX_VALUE/2
                    maxValue:   +Number.MAX_VALUE/2
                    minWidth:   100
                    maxWidth:   10000
                    format:     cfg.valueFormat
                    style:
                        width:  '100%'
                ,
                    type:       'connector'
                    signal:     cfg.id+':onValue'
                ]
            ]

        @pad = @getChild 'envelope_pad'
        @sizeWindow()

    setDuration: (v) => @config.duration = _.value v
    setOffset:   (v) => @config.offset   = _.value v
    setScale:    (v) => @config.scale    = _.value v

    trigger: => log 'trigger'
    triggerDown: => 
        if @config.reltime != 0
            knix.deanimate @
        @setRelTime 0
        knix.animate @
        
    setRelTime: (rel) =>
        @config.reltime = rel
        @config.relval = @pad.valAtRel rel
        @config.absval = @config.relval * @config.scale + @config.offset
        @getChild(@config.id+'_value').setValue @config.absval
        @emitValue @config.absval
        
    anim: (step) =>
        @setRelTime @config.reltime + step.dsecs / @config.duration
        @pad.showRuler @config.reltime, @config.relval
        if @config.reltime > 1.0
            @pad.hideRuler()
            knix.deanimate @
            @setRelTime 0

    sizeWindow: =>
        pad = @getChild 'pad'
        if pad?
            content = @getChild 'content'
            content.setHeight @contentHeight()
            height = content.innerHeight() - 150
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
