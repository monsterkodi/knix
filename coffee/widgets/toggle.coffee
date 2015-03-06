###

000000000   0000000    0000000    0000000   000      00000000
   000     000   000  000        000        000      000     
   000     000   000  000  0000  000  0000  000      0000000 
   000     000   000  000   000  000   000  000      000     
   000      0000000    0000000    0000000   0000000  00000000

###

class Toggle extends Button
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs

        super cfg,
            class   : 'button'
            state   : 'off'
            states  : ['on', 'off']
            icon    : 'octicon-check'
            icons   : ['octicon-check', 'octicon-x']

        @connect 'click', @onClick
        @connect 'onState', @config.onState if @config.onState?
        @setState @config.state
        @
        
    setState: (state) =>
        # e = @getChild('icon').elem
        # e.removeClassName @config.icons[@getIndex()]
        @elem.removeClassName @config.state
        @config.state = state
        # e.addClassName @config.icons[@getIndex()]
        @elem.addClassName @config.state
        @getChild('icon')?.setIcon @config.icons[@getIndex()]
        @emit 'onState',
            state: @config.state

    getIndex : => @config.states.indexOf @config.state
    toggle   : => @setState @config.states[(@getIndex()+1)%@config.states.length]
    onClick  : => @toggle()
