
class Path extends Widget

    @create: (config, defaults) ->

        cfg = _.def config, _.def defaults,
            start:    [0,0]
            startDir: [0,0]
            end:      [0,0]
            endDir:   [0,0]

        pth = cfg.svg.path()
        pth .M  0,0
            .Q  0,0,0,0
            .Q  0,0,0,0
        pth.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
        pth.stroke(color: "rgba(0,0,255,0.4)", width: 16).fill('none')
        _.extend pth, @prototype
        cfg.endHead = pth.add(cfg.end,cfg.endDir)
        pth.config = cfg
        pth.setStart cfg.start
        pth.setEnd   cfg.end
        pth

    add: (a,b) -> [a[0]+b[0], a[1]+b[1]]
    sub: (a,b) -> [a[0]-b[0], a[1]-b[1]]
    mid: (a,b) -> [(a[0]+b[0])*0.5, (a[1]+b[1])*0.5]

    setEndDir:    (p) -> @config.endDir = p; @setEnd @config.end
    setStartDir:  (p) -> @config.startDir = p; @setStart @config.start
    setEndHead:   (p) -> @setEndDir @sub(p,@config.end)
    setStartHead: (p) -> @setStartDir @sub(p,@config.start)

    setStart: (p) ->
        c = @config
        c.start = p
        c.startHead = @add(c.start,c.startDir)
        c.mid = @mid(c.startHead,c.endHead)
        @setCtrl 0, c.start[0], c.start[1]
        @setCtrl 1, c.startHead[0], c.startHead[1]
        @setCtrl 1, c.mid[0], c.mid[1], 2

    setEnd:   (p) ->
        c = @config
        c.end = p
        c.endHead = @add(c.end,c.endDir)
        c.mid = @mid(c.startHead,c.endHead)
        @setCtrl 1, c.mid[0], c.mid[1], 2
        @setCtrl 2, c.endHead[0], c.endHead[1]
        @setCtrl 2, c.end[0], c.end[1], 2

    setCtrl: (c, x, y, o=0) ->
        s = @getSegment(c)
        s.coords[0+o] = x
        s.coords[1+o] = y
        @replaceSegment c, s
