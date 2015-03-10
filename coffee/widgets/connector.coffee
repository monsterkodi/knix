###

 0000000   0000000   000   000  000   000  00000000   0000000  000000000   0000000   00000000 
000       000   000  0000  000  0000  000  000       000          000     000   000  000   000
000       000   000  000 0 000  000 0 000  0000000   000          000     000   000  0000000  
000       000   000  000  0000  000  0000  000       000          000     000   000  000   000
 0000000   0000000   000   000  000   000  00000000   0000000     000      0000000   000   000

###

class Connector extends Widget
    
    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        cfg.class = 'slot'   if cfg.slot?
        cfg.class = 'signal' if cfg.signal?
        cfg.class = 'in'     if cfg.in?
        cfg.class = 'out'    if cfg.out?

        super cfg,
            type   : 'connector'
            onOver : @onOver
            onOut  : @onOut
            noMove : true

        new Drag
            target  : @elem
            minPos  : pos(undefined,0)
            cursor  : 'grab'
            doMove  : false
            onStart : @dragStart
            onMove  : @dragMove
            onStop  : @dragStop

        @connections = []
        @

    close: =>
        @connections = []
        super()

    isSignal: => @config.signal?
    isSlot:   => @config.slot?
    isIn:     => @isSlot() or @config.in
    isOut:    => @isSignal() or @config.out

    name:     => 
        n = @config[@config.class]
        if @config.class in ['in', 'out']
            n += ":" + @config.class
        n

    addConnection: (c) =>
        @connections.push c if c not in @connections
        @elem.addClassName 'connected'

    delConnection: (c) =>
        _.del @connections, c
        @elem.removeClassName('connected') if @connections.length == 0

    canConnectTo: (other) =>
        return true if @isSignal() and other.isSlot() or @isSlot() and other.isSignal()
        return @config.in? and @config.in == other.config.out or @config.out? and @config.out == other.config.in

    connectorAtPos: (p) =>
        @handle.elem.style.pointerEvents = 'none'
        elem = Stage.elementAtPos p
        @handle.elem.style.pointerEvents = 'auto'
        if elem.getWidget()
            if elem.getWidget().constructor == Connector and @canConnectTo(elem.getWidget())
                return elem.getWidget()
        undefined

    onOver: (event) =>
        p = Stage.absPos(event)
        if @elem == document.elementFromPoint(p.x, p.y)
            @elem.addClassName 'highlight'

    onOut: =>
        @elem.removeClassName 'highlight'

    dragStart: (drag,event) =>

        p = drag.absPos(event)

        @handle = new Widget
            type   : 'connector-handle'
            parent : 'stage_content'
            style  :
                cursor : 'grabbing'

        @handle.setPos p
        @elem.addClassName 'connected'

        @path = new Path
            class    : 'connector'
            parent   : 'stage_content'
            start    : @absCenter()
            end      : p
            startDir : if @isOut() then pos(100,-10) else pos(-100,-10)

        @elem.style.cursor = 'grabbing'

    dragMove: (drag,event) =>

        p = drag.absPos(event)

        if conn = @connectorAtPos p
            @path.path.addClass 'connectable'
            @path.setStartDir if @isOut() then pos(100,1) else pos(-100,-1)
            @path.setEndDir if conn.isOut() then pos(100,1) else pos(-100,-1)
            @conn = conn
            @conn.elem.addClassName 'highlight'
            @handle.elem.addClassName 'highlight'
        else
            @path.path.removeClass 'connectable'
            @path.setStartDir if @isOut() then pos(100,-10) else pos(-100,-10)
            @path.setEndDir pos(0,0)
            if @conn? then @conn.elem.removeClassName 'highlight'; delete @conn
            @handle.elem.removeClassName 'highlight'

        @handle.setPos p
        @path.setEnd p

    dragStop: (drag,event) =>

        p = drag.absPos event

        if conn = @connectorAtPos p
            new Connection
                source : @
                target : conn
            conn.elem.removeClassName 'highlight'
        else if @connections.length == 0
            @elem.removeClassName 'connected'

        # tag 'Drag'
        # log 'stop'
        @handle.close()
        @path.path.remove()

    _str: =>
        s  = @elem.id + " "
        s += "signal: " + @config.signal if @isSignal()
        s += "slot: " + @config.slot if @isSlot()
        s += @config.in if @config.in?
        s += @config.out if @config.out?
        s
    
