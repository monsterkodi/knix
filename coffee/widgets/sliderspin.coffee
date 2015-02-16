###


###

class Sliderspin extends Hbox

    constructor: (cfg, defs) ->

        super cfg, defs

        @config.children =
            [
                type:       'connector'
                slot:       @config.id+':setValue'
            ,
                type:       'slider'
                id:         @config.id+'_slider'
                minValue:   @config.minValue
                maxValue:   @config.maxValue
                style:
                    width:  '90%'
            ,
                type:       'spin'
                id:         @config.id
                value:      @config.value
                minValue:   @config.minValue
                maxValue:   @config.maxValue
                onValue:    @config.onValue
                minWidth:   80
                format:     "%3.2f"
                style:
                    width:  '10%'
            ,
                type:       'connector'
                signal:     @config.id+':onValue'
            ]

        @insertChildren()

        @connect @config.id+'_slider:onValue', @config.id+':setValue'
        @connect @config.id+':onValue', @config.id+'_slider:setValue'
