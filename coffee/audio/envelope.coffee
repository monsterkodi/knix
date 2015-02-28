
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
            valueFormat:  "%0.3f"

        super cfg,
            title: 'envelope'
            children: \
            [
                type:       'pad'
                id:         'envelope_pad'
                numHandles:  5
                vals:        [pos(0,0), pos(0.25,0.5), pos(0.5,1), pos(0.75,0.5), pos(1,0)]
                minHeight:   50
                minWidth:    150
            ,
                type:       'hbox'
                children:   \
                [
                    type:       'connector'
                    slot:       'envelope_in:setValue'
                ,
                    type:       'spin'
                    id:         'envelope_in'
                    valueStep:  0.001
                    minWidth:   100
                    maxWidth:   10000
                    onValue:    @setRel
                    format:     cfg.valueFormat
                    style:
                        width:  '50%'
                ,
                    type:       'spin'
                    id:         'envelope'
                    valueStep:  0.00001
                    minWidth:   100
                    maxWidth:   10000
                    format:     cfg.valueFormat
                    style:
                        width:  '50%'
                ,
                    type:       'connector'
                    signal:     'envelope:onValue'
                ]
            ]

        @pad = @getChild 'envelope_pad'
        @sizeWindow()
                                
    setRel: (rel) =>
        @config.reltime = _.value rel
        @config.value = @pad.valAtRel @config.reltime
        if @config.reltime == 0
            @pad.hideRuler()
        else
            @pad.showRuler @config.reltime, @config.value
        @getChild('envelope').setValue @config.value

    sizeWindow: =>
        pad = @getChild 'pad'
        if pad?
            content = @getChild 'content'
            content.setHeight @contentHeight()
            height = content.innerHeight() - 50
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
