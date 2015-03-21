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
        
        cfg = _.def cfg,
            states : ['off', 'on']
            icons  : ['octicon-x', 'octicon-check'] 
        
        cfg.state = cfg.states[0] unless cfg.state?
        cfg.icon  = cfg.icons[cfg.states.indexOf cfg.state] unless cfg.icon?

        super cfg,
            class : 'button'

        @connect 'trigger', @toggle
        @connect 'onState', @config.onState if @config.onState?
        @setState @config.state
        @
        
    setState: (state) =>
        @elem.removeClassName @config.state
        @config.state = state
        @elem.addClassName @config.state
        @getChild('icon')?.setIcon @config.icons[@getIndex()]
        @emit 'onState',
            state: @config.state

    getIndex : => @config.states.indexOf @config.state
    toggle   : => @setState @config.states[(@getIndex()+1)%@config.states.length]
