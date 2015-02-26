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
                id:         cfg.id+'_spin'
                value:      cfg.value
                minValue:   cfg.minValue
                maxValue:   cfg.maxValue
                onValue:    cfg.onValue
                valueStep:  cfg.spinStep
                minWidth:   100
                format:     cfg.spinFormat or "%3.2f"
                style:
                    width:  '10%'
            ,
                type:       'connector'
                signal:     cfg.id+':onValue'
            ]

        @connect cfg.id+'_slider:onValue', cfg.id+'_spin:setValue'
        @connect cfg.id+'_spin:onValue', cfg.id+'_slider:setValue'

    setValue: (v) =>
        @config.value = _.value v
        # log 'sliderspin value', @config.value
        @getChild(@config.id+'_slider').setValue @config.value
        
