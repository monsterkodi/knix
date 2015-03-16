
###

00000000  000   000  000   000  00000000  000       0000000   00000000   00000000
000       0000  000  000   000  000       000      000   000  000   000  000     
0000000   000 0 000   000 000   0000000   000      000   000  00000000   0000000 
000       000  0000     000     000       000      000   000  000        000     
00000000  000   000      0      00000000  0000000   0000000   000        00000000

###

class Envelope extends Window

    init: (cfg, defs) =>        
    
        cfg = _.def cfg, defs

        cfg = _.def cfg,
            type        : 'envelope'
            valueFormat : "%0.3f"
            numHandles  : 7
            height: 220

        super cfg,
            title    : 'envelope'
            children : \
            [
                type       : 'pad'
                class      : 'envelope_pad'
                numHandles : cfg.numHandles
                vals       : cfg.vals
                minHeight  : 50
                minWidth   : 150
            ,
                type       : 'hbox'
                children   : \
                [
                    type      : 'connector'
                    slot      : 'envelope_in:setValue'
                ,
                    type      : 'spin'
                    class     : 'envelope_in'
                    tooltip   : 'input'
                    valueStep : 0.001
                    minWidth  : 100
                    maxWidth  : 10000
                    format    : cfg.valueFormat
                    style     :
                        width : '50%'
                ,
                    type      : 'spin'
                    class     : 'envelope'
                    tooltip   : 'output'
                    valueStep : 0.00001
                    minWidth  : 100
                    maxWidth  : 10000
                    format    : cfg.valueFormat
                    style     :
                        width : '50%'
                ,
                    type      : 'connector'
                    signal    : 'envelope:onValue'
                ]
            ]

        @connect 'envelope_in:onValue', @setRel

        @pad = @getChild 'envelope_pad'
        @sizeWindow()
        @
            
    paramValuesAtConnector: (paramValues, connector) =>
        if paramValues.duration? 
            paramValues.values = [] 
            for v in @pad.config.vals
                paramValues.values.push
                    time:  v.x * paramValues.duration
                    value: v.y
            Audio.sendParamValuesFromConnector paramValues, @connector "envelope:onValue"
                                
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
            height = content.innerHeight() - 60
            width  = content.innerWidth() - 20
            pad.setSize width, height

    @menu: =>

        @menuButton
            text   : 'envelope'
            icon   : 'octicon-pulse'
            action : -> new Envelope
                            center: true
