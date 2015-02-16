###

     0000000   00000000   000  000   000
    000        000   000  000  0000  000
     0000000   00000000   000  000 0 000
          000  000        000  000  0000
     0000000   000        000  000   000

###

class Spin extends Value

    constructor: (cfg) ->

        super cfg,
            type:       'spin'
            horizontal: true
            child:
                elem:   'table'
                type:   'spin-table'
                onDown: (event,e) -> event.stopPropagation()
                child:
                    elem:   'tr'
                    type:   'spin-row'
                    children: \
                    [
                        elem: 'td'
                        type: 'spin-td'
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-left'
                            # onClick: (event,e) -> e.getParent('spin').incr '-'
                        onDown:  @startDecr
                        onUp:    @stopTimer
                    ,
                        elem: 'td'
                        type: 'spin-content'
                        child:
                            type:   'input'
                            class:  'spin-input'
                    ,
                        elem: 'td'
                        type: 'spin-td'
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-right'
                        onClick: (event,e) -> e.getParent('spin').incr '+'
                        onDown:  @startIncr
                        onUp:    @stopTimer
                    ]

        @input = @getChild('spin-input').elem

        @elem.on 'keypress', (event,e) ->
            if event.key in ['Up', 'Down']
                @widget.incr event.key == 'Up' and '+' or '-'
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
            @getParent('spin').setValue @getValue()

        @input.value = @config.value
        @setValue @config.value

    setValue: () =>
        super
        @input.value = @strip0 @format(@config.value)

    startIncr: => @timer = setInterval(@incr, 50)
    startDecr: => @timer = setInterval(@decr, 50)
    stopTimer: => clearInterval @timer

    format: (s) => return @config.format.fmt(s) if @config.format?; String(s)
    strip0: (s) => return s.replace(/(0+)$/,'').replace(/([\.]+)$/,'') if s.indexOf('.') > -1; String(s.strip())
