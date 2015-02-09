
class Path extends Widget

    constructor: (config, defaults) ->

        @config = _.def config, _.def defaults,
            start:    pos(0,0)
            startDir: pos(100,0)
            end:      pos(200,200)
            endDir:   pos(0,0)
            svg:      knix.svg

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

        @config.endHead = @config.end.add(@config.endDir)
        @setStart @config.start
        @setEnd   @config.end

    setVisible:   (v) => if v then @path.show() else @path.hide()

    setEndDir:    (p) => @config.endDir = p; @setEnd @config.end
    setStartDir:  (p) => @config.startDir = p; @setStart @config.start
    setEndHead:   (p) => @setEndDir p.sub(@config.end)
    setStartHead: (p) => @setStartDir p.sub(@config.start)

    setStart: (p) =>

        @config.start = p
        @config.startHead = @config.start.add(@config.startDir)
        @config.mid = @config.startHead.mid(@config.endHead)
        @setCtrl 0, @config.start
        @setCtrl 1, @config.startHead
        @setCtrl 2, @config.mid

    setEnd: (p) =>
        @config.end = p
        @config.endHead = @config.end.add(@config.endDir)
        @config.mid = @config.startHead.mid(@config.endHead)
        @setCtrl 2, @config.mid
        @setCtrl 3, @config.endHead
        @setCtrl 4, @config.end

    setCtrl: (c, p) =>
        si = [0,1,1,2,2][c]
        o  = [0,0,2,0,2][c]
        s  = @path.getSegment(si)
        s.coords[0+o] = p.x
        s.coords[1+o] = p.y
        @path.replaceSegment si, s
