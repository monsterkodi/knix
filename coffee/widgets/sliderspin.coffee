###

 0000000  000      000  0000000    00000000  00000000    0000000  00000000   000  000   000
000       000      000  000   000  000       000   000  000       000   000  000  0000  000
0000000   000      000  000   000  0000000   0000000    0000000   00000000   000  000 0 000
     000  000      000  000   000  000       000   000       000  000        000  000  0000
0000000   0000000  000  0000000    00000000  000   000  0000000   000        000  000   000

###

class Sliderspin extends Hbox
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs

        super cfg,
            children : \
            [
                type      : 'connector'
                slot      : cfg.class+':setValue'
            ,
                type      : 'slider'
                value     : cfg.value
                minValue  : cfg.minValue
                maxValue  : cfg.maxValue
                valueStep : cfg.sliderStep
                hasKnob   : cfg.sliderKnob
                style     :
                    width : '90%'
            ,
                type      : 'spin'
                value     : cfg.value
                recKey    : cfg.recKey
                minValue  : cfg.minValue
                maxValue  : cfg.maxValue
                valueStep : cfg.spinStep
                minWidth  : 100
                format    : cfg.spinFormat or "%3.2f"
                style     :
                    width : '10%'
            ,
                type      : 'connector'
                signal    : cfg.class+':onValue'
            ]

        @connect 'slider:onValue', 'spin:setValue'
        @connect 'spin:onValue', 'slider:setValue'
        @connect 'spin:onValue', @onSpinValue
        @

    onSpinValue: (v) => @emitValue _.value v
    
    setValue: (v) =>
        @config.value = _.value v
        @getChild('slider').setValue @config.value
        
