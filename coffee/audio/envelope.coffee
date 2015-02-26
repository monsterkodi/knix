
###

00000000  000   000  000   000  00000000  000       0000000   00000000   00000000
000       0000  000  000   000  000       000      000   000  000   000  000     
0000000   000 0 000   000 000   0000000   000      000   000  00000000   0000000 
000       000  0000     000     000       000      000   000  000        000     
00000000  000   000      0      00000000  0000000   0000000   000        00000000

###

class Envelope extends Window

    constructor: (cfg, defs) ->

        cfg = _.def cfg, defs
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

        super cfg,
            title: 'envelope'
            children: \
            [
                type:       'pad'
                id:         'envelope_pad'
                numHandles:  5
            ,
                type:       'sliderspin'
                id:         'duration'
                onValue:    @setDuration
                value:      cfg.duration
                minValue:   cfg.minDuration
                maxValue:   cfg.maxDuration
                valueStep:  cfg.durationStep
            ,
                type:       'sliderspin'
                id:         'offset'
                onValue:    @setOffset
                value:      cfg.offset
                minValue:   cfg.minOffset
                maxValue:   cfg.maxOffset
                spinStep:   cfg.offsetStep
            ,
                type:       'sliderspin'
                id:         'scale'
                onValue:    @setScale
                value:      cfg.scale
                minValue:   cfg.minScale
                maxValue:   cfg.maxScale
                spinStep:   cfg.scaleStep
            ]

        @sizeWindow()

    setDuration: (v) => @config.duration = _.value v
    setOffset:   (v) => @config.Offset   = _.value v
    setScale:    (v) => @config.scale    = _.value v

    sizeWindow: =>
        pad = @getChild 'pad'
        if pad?
            content = @getChild 'content'
            content.setHeight @contentHeight()
            height = content.innerHeight() - 100
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
