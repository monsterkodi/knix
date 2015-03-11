###

000000000  00000000   000   0000000    0000000   00000000  00000000    0000000  00000000  000      000    
   000     000   000  000  000        000        000       000   000  000       000       000      000    
   000     0000000    000  000  0000  000  0000  0000000   0000000    000       0000000   000      000    
   000     000   000  000  000   000  000   000  000       000   000  000       000       000      000    
   000     000   000  000   0000000    0000000   00000000  000   000   0000000  00000000  0000000  0000000

###

class TriggerCell extends TrackCell

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            type: 'TriggerCell'
            text: '<i class="fa fa-square"></i>'
            
        @connect 'click', @toggle
        @
            
    isOn   : => @elem.hasClassName 'on'
    isOff  : => not @isOn
    del    : => if @isOn() then @off() 
    toggle : => if @isOn() then @off() else @on()
            
    on: =>
        # log @elem.id
        @elem.removeClassName 'off'
        @elem.addClassName 'on'
        # log @tracker().elem.id
        @tracker().setTrigger @

    off: => 
        # log @elem.id
        @elem.removeClassName 'on'
        @elem.addClassName 'off'
        # log @tracker().elem.id
        @tracker().delTrigger @
