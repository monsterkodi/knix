###

000   000   0000000   000   000  0000000    000      00000000
000   000  000   000  0000  000  000   000  000      000     
000000000  000000000  000 0 000  000   000  000      0000000 
000   000  000   000  000  0000  000   000  000      000     
000   000  000   000  000   000  0000000    0000000  00000000

###

class Handle extends Widget

    constructor: (cfg, defs) -> super cfg, defs
        
    init: (cfg, defs) =>

        cfg = _.def cfg, defs
        @config = _.def cfg,
            radius: 20
            noMove: true
                        
        @circle         = @config.svg.circle @config.radius
        @elem           = @circle.node
        @elem.getWidget = @returnThis
        @initElem()
        @initEvents()
        @elem.relPos    = @relPos
        
        new Drag
            target:  @elem
            doMove:  false
            onMove:  @onDragMove
            onStart: @onDragStart
    
    initEvents: =>
        @elem.addEventListener "onpos", @config.onPos if @config.onPos?
    
    relPos:      => pos(@circle.cx(), @circle.cy())
    absPos:      => pos(@circle.cx(), @circle.cy())
        
    onDragStart: (drag, event) =>
        tag 'Drag'
        log 'startmove'
    
    onDragMove: (drag, event) =>
        tag 'Drag'
        log 'relPos', drag.absPos(event).sub @config.svg.node.getWidget().absPos()
        @setPos drag.absPos(event).sub @config.svg.node.getWidget().absPos()
    
    setPos: =>
        p = _.arg()
        o = @absPos()
        if o.notSame p
            @circle.center p.x, p.y
            @elem.dispatchEvent new CustomEvent 'onpos', { 'detail': p }
