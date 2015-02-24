###

000   000   0000000   000   000  0000000    000      00000000
000   000  000   000  0000  000  000   000  000      000     
000000000  000000000  000 0 000  000   000  000      0000000 
000   000  000   000  000  0000  000   000  000      000     
000   000  000   000  000   000  0000000    0000000  00000000

###

class Handle extends Widget

    constructor: (cfg, defs) ->

        @config = _.def cfg, _.def defs,
            radius: 30
            
        @circle      = @config.svg.circle @config.radius
        @elem        = @circle.node
        @elem.widget = @
        
    relPos:      => pos @circle.cx(), @circle.cy()
    absPos:      => pos @circle.cx(), @circle.cy()
        
    setPos: (p) =>
        o = @absPos()
        if o.notSame p
            log 'setPos', p
            @circle.center p.x, p.y
            @elem.dispatchEvent new CustomEvent 'onMove', { 'detail': p }
        # log 'dispatched'
