###

 0000000  000      000  0000000    00000000  00000000    0000000  00000000   000  000   000
000       000      000  000   000  000       000   000  000       000   000  000  0000  000
0000000   000      000  000   000  0000000   0000000    0000000   00000000   000  000 0 000
     000  000      000  000   000  000       000   000       000  000        000  000  0000
0000000   0000000  000  0000000    00000000  000   000  0000000   000        000  000   000

###

class Sliderspin extends Hbox

    constructor: (cfg, defs) ->

        cfg = _.def cfg, defs

        super cfg,
            children: \
            [
                type:       'connector'
                slot:       cfg.id+':setValue'
            ,
                type:       'slider'
                id:         cfg.id+'_slider'
                value:      cfg.value
                minValue:   cfg.minValue
                maxValue:   cfg.maxValue
                valueStep:  cfg.sliderStep
                hasKnob:    cfg.sliderKnob
                style:
                    width:  '90%'
            ,
                type:       'spin'
                id:         cfg.id
                value:      cfg.value
                minValue:   cfg.minValue
                maxValue:   cfg.maxValue
                onValue:    cfg.onValue
                valueStep:  cfg.spinStep
                minWidth:   80
                format:     "%3.2f"
                style:
                    width:  '10%'
            ,
                type:       'connector'
                signal:     cfg.id+':onValue'
            ]

        @connect cfg.id+'_slider:onValue', cfg.id+':setValue'
        @connect cfg.id+':onValue', cfg.id+'_slider:setValue'
