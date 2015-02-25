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
            noMove: true
                        
        @circle      = @config.svg.circle @config.radius
        @elem        = @circle.node
        @elem.widget = @
        @initElem()
        @elem.getWidget = @returnThis
        @elem.relPos = @relPos
        
        new Drag
            target:  @elem
            doMove:  false
            onMove:  @onDragMove
            onStart: @onDragStart
        
    relPos:      => pos(@circle.cx(), @circle.cy())
    absPos:      => pos(@circle.cx(), @circle.cy())
        
    onDragStart: (drag, event) =>
        log 'startmove'
    
    onDragMove: (drag, event) =>
        # log 'r', drag.absPos(event).sub @config.svg.widget.absPos()
        @setPos drag.absPos(event).sub @config.svg.widget.absPos()
    
    setPos: (p) =>
        # log p
        p = _.arg p
        o = @absPos()
        if o.notSame p
            @circle.center p.x, p.y
            @elem.dispatchEvent new CustomEvent 'onMove', { 'detail': p }
