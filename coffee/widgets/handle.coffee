###

000   000   0000000   000   000  0000000    000      00000000
000   000  000   000  0000  000  000   000  000      000     
000000000  000000000  000 0 000  000   000  000      0000000 
000   000  000   000  000  0000  000   000  000      000     
000   000  000   000  000   000  0000000    0000000  00000000

###

class Handle extends Widget

    constructor: (cfg, defs) ->

        cfg = _.def cfg, defs
        @config = _.def cfg,
            radius: 20
            noMove: true
                        
        @circle      = @config.svg.circle @config.radius
        @elem        = @circle.node
        @elem.widget = @
        @initElem()
        @elem.relPos = @relPos
        
        new Drag
            target:  @elem
            doMove:  false
            onMove:  @onDragMove
            onStart: @onDragStart
        
    relPos:      => pos(@circle.cx(), @circle.cy())
    absPos:      => pos(@circle.cx(), @circle.cy())
        
    onDragStart: (drag, event) =>
        tag 'Drag'
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
