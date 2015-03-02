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
            type       : 'spin'
            horizontal : true
            child      :
                elem   : 'table'
                type   : 'spin-table'
                child  :
                    elem     : 'tr'
                    type     : 'spin-row'
                    children : \
                    [
                        id    : 'decr'
                        type  : 'spin-td'
                        elem  : 'td'
                        keys  : []
                        child :
                            type  : 'icon'
                            icon  : 'octicon-triangle-left'
                    ,
                        elem  : 'td'
                        type  : 'spin-content'
                        child :
                            type  : 'input'
                            class : 'spin-input'
                    ,
                        id    : 'incr'
                        type  : 'spin-td'
                        elem  : 'td'
                        keys  : []
                        child :
                            type  : 'icon'
                            icon  : 'octicon-triangle-right'
                    ]

        @connect 'decr:mousedown', @startDecr
        @connect 'decr:mouseup',   @stopTimer
        
        @connect 'incr:mousedown', @startIncr
        @connect 'incr:mouseup',   @stopTimer

        @connect 'input:mousedown', (event) -> event.stopPropagation()

        if not @config.valueStep?
            @config.valueStep = @range() > 1 and 1 or @range()/100

        @elem.on 'keypress', @onKey

        @input = @getChild('spin-input').elem

        @input.addEventListener 'change', @onInputChange

        @input.value = @config.value
        @setValue @config.value
        @

    onInputChange: => @setValue @input.value

    onKey: (event, e) =>
        if event.key in ['Esc']
            @setValue @config.value
            return
        if event.key in ['Up', 'Down']
            @onInputChange()
            @incr event.key == 'Up' and '+' or '-'
            event.stop()
            return 
        if event.key in ['Left', 'Right', ' ', 'Tab']
            if event.key == ' '
                event.stop()
            @onInputChange()
            return
        # if event.key in ['Backspace']
        #     setTimeout @onInputChange, 1
        #     return
        if event.key not in '0123456789-.'
            if event.key.length == 1
                event.stop()
                return
        if event.key in '-.'
            if @input.value.indexOf(event.key) > -1
                event.stop()
                return

    setValue: (a) =>
        super _.value a
        [start, end] = [@input.selectionStart, @input.selectionEnd]
        @input.value = @format(@config.value) if @input?
        [@input.selectionStart, @input.selectionEnd] = [start, end]

    incr: (d=1) =>
        valueLength = @input.value.length
        [start, end] = [@input.selectionStart, @input.selectionEnd]
        [trats, dne] = [@input.selectionStart-valueLength, @input.selectionEnd-valueLength]
        
        dotindex = @input.value.indexOf '.'
        if dotindex >= 0 and start >= dotindex
            tempStep = 1.0 / (Math.pow 10, start - dotindex)
        else 
            if dotindex >= 0 
                valueLength = dotindex
            tempStep = Math.pow 10, valueLength - start - 1

        [saveStep, @config.valueStep] = [@config.valueStep, tempStep]
        super 
        @config.valueStep = saveStep
        
        valueLength = @input.value.length
        [@input.selectionStart, @input.selectionEnd] = [valueLength+trats, valueLength+dne]

    startIncr: => @incr(); @timer = setInterval(@incr, Math.max(80, 2000/@steps()))
    startDecr: => @decr(); @timer = setInterval(@decr, Math.max(80, 2000/@steps()))
    stopTimer: => clearInterval @timer

    format: (s) => return @config.format.fmt(s) if @config.format?; String(s)
    strip0: (s) => return s.replace(/(0+)$/,'').replace(/([\.]+)$/,'') if s.indexOf('.') > -1; String(s.strip())
