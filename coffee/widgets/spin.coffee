###

 0000000  00000000   000  000   000
000       000   000  000  0000  000
0000000   00000000   000  000 0 000
     000  000        000  000  0000
0000000   000        000  000   000

###

class Spin extends Value
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs
        
        super cfg,
            type:       'spin'
            horizontal: true
            child:
                elem:   'table'
                type:   'spin-table'
                child:
                    elem:   'tr'
                    type:   'spin-row'
                    children: \
                    [
                        elem:   'td'
                        type:   'spin-td'
                        onDown:  @startDecr
                        onUp:    @stopTimer
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-left'
                    ,
                        elem:   'td'
                        type:   'spin-content'
                        child:
                            type:   'input'
                            class:  'spin-input'
                            onDown: (event) -> event.stopPropagation()
                    ,
                        elem:   'td'
                        type:   'spin-td'
                        onDown:  @startIncr
                        onUp:    @stopTimer
                        child:
                            type: 'icon'
                            icon: 'octicon-triangle-right'
                    ]

        if not @config.valueStep?
            @config.valueStep = @range() > 1 and 1 or @range()/100

        @elem.on 'keypress', @onKey

        @input = @getChild('spin-input').elem

        @input.addEventListener 'change', ->
            @getParent(@config.type).setValue @getValue()

        @input.value = @config.value
        @setValue @config.value

    onKey: (event, e) =>
        # log 'event', event.key
        if event.key in ['Up', 'Down']
            @incr event.key == 'Up' and '+' or '-'
            event.stop()
            return 
        if event.key in ['Return', 'Enter', 'Tab']
            @setValue parseFloat @input.value
            return
        if event.key not in '0123456789-.'
            if event.key.length == 1
                event.stop()
                return
        if event.key in '-.'
            if @input.value.indexOf(event.key) > -1
                event.stop()
                return

    setValue: (a) =>
        super a
        @input.value = @strip0 @format(@config.value) if @input?

    startIncr: => @incr(); @timer = setInterval(@incr, Math.max(80, 2000/@steps()))
    startDecr: => @decr(); @timer = setInterval(@decr, Math.max(80, 2000/@steps()))
    stopTimer: => clearInterval @timer

    format: (s) => return @config.format.fmt(s) if @config.format?; String(s)
    strip0: (s) => return s.replace(/(0+)$/,'').replace(/([\.]+)$/,'') if s.indexOf('.') > -1; String(s.strip())
