###

000   000   0000000   000   000  0000000    000      00000000
000   000  000   000  0000  000  000   000  000      000     
000000000  000000000  000 0 000  000   000  000      0000000 
000   000  000   000  000  0000  000   000  000      000     
000   000  000   000  000   000  0000000    0000000  00000000

###

class Handle extends Widget
        
    init: (cfg, defs) =>

        cfg = _.def cfg, defs

        @config = _.def cfg,
            radius: 16
            noMove: true
                        
        @circle         = @config.svg.circle @config.radius
        @circle.addClass @config.class
        @elem           = @circle.node
        @elem.getWidget = @returnThis
        @initElem()
        @initEvents()
        @elem.relPos    = @relPos
        
        @drag = new Drag
            target: @elem
            onStop: @config.onUp
    
    initEvents: =>
        @elem.addEventListener 'onpos',   @config.onPos if @config.onPos?
    
    constrain: (minX, minY, maxX, maxY) => @drag.constrain minX, minY, maxX, maxY
    
    relPos: => pos @circle.cx(), @circle.cy()
    absPos: => pos @circle.cx(), @circle.cy()
    
    setPos: =>
        p = _.arg()
        o = @relPos()
        if o.notSame p
            @circle.center p.x, p.y
            @elem.dispatchEvent new CustomEvent 'onpos', { 'detail': p }
