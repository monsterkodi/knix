###

    000000000   0000000    0000000    0000000   000        00000000
       000     000   000  000        000        000        000
       000     000   000  000  0000  000  0000  000        0000000
       000     000   000  000   000  000   000  000        000
       000      0000000    0000000    0000000   000000000  00000000

###

class Toggle extends Button

    constructor: (cfg, defs) ->

        super cfg, _.def defs,
            class:      'button'
            icon:       'octicon-x'
            iconon:     'octicon-check'
            onClick:    @onClick
            state:      'off'

        @elem.on 'onState', @config.onState if @config.onState?
        @setState cfg.state

    getState: => ((not @config.state) or @config.state == 'off') and 'off' or 'on'

    setState: (state) =>

        @elem.removeClassName @getState()

        e = @getChild('octicon').elem
        if not state? or not state or state == 'off'
            e.removeClassName @config.iconon
            e.addClassName @config.icon
            @config.state = 'off'
        else
            e.removeClassName @config.icon
            e.addClassName @config.iconon
            @config.state = 'on'

        @elem.addClassName @config.state

        @emit 'onState',
            state: @config.state

    toggle: => @setState(@getState() == 'on' and 'off' or 'on')

    onClick: => @toggle()
