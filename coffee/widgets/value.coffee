###

    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000     
    000   000  000000000  000      000   000  0000000
     00   00   000   000  000      000   000  000     
       000     000   000  0000000   0000000   00000000

###

class Value extends Widget

    @create: (cfg) ->

        value = Widget.setup cfg,
            type:       'value'
            value:      0
            horizontal: true
            slots:      \
            {
                setValue: (arg) ->
                    v = @format(@round(@clamp(@slotArg(arg, 'value'))))
                    @input.value = @strip0 v
                    @emit 'onValue',
                        value: v
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
                            onClick: (event,e) -> @getParent('value').incr '-'
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
                        onClick: (event,e) -> @getParent('value').incr '+'
                    ]

        value.input = value.getChild 'value-input'

        value.incr = (d) ->
            if d in ['up', '+', '++'] then d = 1
            else if d in ['down', '-', '--'] then d = -1
            if @config.valueStep? then step = @config.valueStep else step = 1
            @setValue @input.getValue() + step*d

        value.on 'keypress', (event,e) ->
            if event.key in ['Up', 'Down']
                @incr event.key.toLowerCase()
                event.stop()
                return
            if event.key not in '0123456789-.'
                if event.key.length == 1
                    event.stop()
                    return
            if event.key in '-.'
                if @input.value.indexOf(event.key) > -1
                    event.stop()
                    return

        value.on 'change', (event, e) ->
            log 'value on change', e.id, e.getValue()
            @setValue e.getValue()

        value.setValue value.config.value # i don't want to know how many good-coding-style-rules are broken here :)
        value                             # but at least it is not value.value value.value.value                  :)
