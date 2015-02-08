###

    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000
    000   000  000000000  000      000   000  0000000
     00   00   000   000  000      000   000  000
       000     000   000  0000000   0000000   00000000

###

class Value extends Widget

    constructor: (cfg) ->

        super cfg,
            type:       'value'
            value:      0
            minValue:   0
            maxValue:   100
            horizontal: true
            slots:      \
            {
                setValue: (arg) ->
                    oldValue = @config.value
                    v = @round(@clamp(@slotArg(arg, 'value')))
                    @input.value = @strip0 @format(v)
                    if v != oldValue
                        @config.value = v
                        @emit 'onValue',
                            value: v
                    @
            }
            child:
                elem:   'table'
                type:   'value-table'
                onDown: (event,e) -> event.stopPropagation()
                child:
                    elem:   'tr'
                    type:   'value-row'
                    children: \
                    [
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-left'
                            onClick: (event,e) ->
                                value = e.getParent('value')
                                value.incr '-'
                    ,
                        elem: 'td'
                        type: 'value-content'
                        child:
                            type:   'input'
                            class:  'value-input'
                    ,
                        elem: 'td'
                        type: 'value-td'
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-right'
                        onClick: (event,e) -> e.getParent('value').incr '+'
                    ]

        @input = @getChild('value-input').elem

        @elem.on 'keypress', (event,e) ->
            if event.key in ['Up', 'Down']
                @widget.incr event.key.toLowerCase()
                event.stop()
                return
            if event.key not in '0123456789-.'
                if event.key.length == 1
                    event.stop()
                    return
            if event.key in '-.'
                if @widget.input.value.indexOf(event.key) > -1
                    event.stop()
                    return

        @input.on 'change', (event,e) ->
            @getParent('value').setValue @getValue()

        @input.value = @config.value
        @setValue @config.value

    incr: (d) ->
        if d in ['up', '+', '++'] then d = 1
        else if d in ['down', '-', '--'] then d = -1
        if @config.valueStep? then step = @config.valueStep else step = 1
        @setValue @input.getValue() + step*d
