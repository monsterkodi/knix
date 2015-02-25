###

00000000    0000000   000000000  000   000
000   000  000   000     000     000   000
00000000   000000000     000     000000000
000        000   000     000     000   000
000        000   000     000     000   000

###

class Path extends Widget

    constructor: (cfg, defs) ->

        @config = _.def cfg, _.def defs,
            start:    pos(0,0)
            startDir: pos(0,0)
            end:      pos(0,0)
            endDir:   pos(0,0)
            svg:      knix.svg
            noMove:   true

        @path = @config.svg.path()
        @path .M  0,0
            .Q  0,0,0,0
            .Q  0,0,0,0

        @path.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
        @path.style(cursor: 'grabbing')
        @path.stroke(width: 4)
        @path.addClass('path')
        @path.addClass(clss) for clss in @config.class.split(' ') if @config.class?
        @path.fill('none')
        @path.widget = @
        @path.node.widget = @
        @elem = @path
        
        if @config.startHandle?
            @config.startHandle.elem.addEventListener 'onMove', @setStart
        if @config.endHandle?
            @config.endHandle.elem.addEventListener 'onMove', @setEnd

        @config.endHead   = @config.end.add(@config.endDir)
        @config.startHead = @config.start.add(@config.startDir)
        @setStart @config.start
        @setEnd   @config.end
        @initEvents()

    close: =>
        @path?.remove()
        @path = null
        super()

    setVisible:   (v) => if v then @path.show() else @path.hide()

    setEndDir:    (p) => @config.endDir = p; @setEnd @config.end
    setStartDir:  (p) => @config.startDir = p; @setStart @config.start
    setEndHead:   (p) => @setEndDir p.sub(@config.end)
    setStartHead: (p) => @setStartDir p.sub(@config.start)

    setStart: (p) =>
        p = _.arg(p)
        @config.start = pos(p.x, p.y)
        # log '@config.start', @config.start
        @config.startHead = @config.start.add(@config.startDir)
        @config.mid = @config.startHead.mid(@config.endHead)
        @setCtrl 0, @config.start
        @setCtrl 1, @config.startHead
        @setCtrl 2, @config.mid
        if @config.startHandle?
            @config.startHandle.setPos @config.start

    setEnd: (p) =>
        p = _.arg(p)
        @config.end = pos(p.x, p.y)
        # log '@config.end', @config.end
        @config.endHead = @config.end.add(@config.endDir)
        @config.mid = @config.startHead.mid(@config.endHead)
        @setCtrl 2, @config.mid
        @setCtrl 3, @config.endHead
        @setCtrl 4, @config.end
        if @config.endHandle?
            @config.endHandle.setPos @config.end

    setCtrl: (c, p) =>
        si = [0,1,1,2,2][c]
        o  = [0,0,2,0,2][c]
        s  = @path.getSegment(si)
        s.coords[0+o] = p.x
        s.coords[1+o] = p.y
        @path.replaceSegment si, s
