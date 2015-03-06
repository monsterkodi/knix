###

000000000  00000000    0000000    0000000  000   000   0000000  00000000  000      000    
   000     000   000  000   000  000       000  000   000       000       000      000    
   000     0000000    000000000  000       0000000    000       0000000   000      000    
   000     000   000  000   000  000       000  000   000       000       000      000    
   000     000   000  000   000   0000000  000   000   0000000  00000000  0000000  0000000

###

class TrackCell extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type: 'TrackCell'
            text: '<i class="fa fa-square"></i>'
            
        @connect 'click', @toggle
        @    
        
    isOn   : => @elem.hasClassName 'on'
    isOff  : => not @isOn
    toggle : => if @isOn() then @off() else @on()
        
    on: =>
        # log @elem.id
        @elem.removeClassName 'off'
        @elem.addClassName 'on'

    off: => 
        log @elem.id
        @elem.removeClassName 'on'
        @elem.addClassName 'off'
