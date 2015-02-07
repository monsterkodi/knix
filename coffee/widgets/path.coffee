
class Path extends Widget

    @create: (config, defaults) ->

        cfg = _.def config, _.def defaults,
            start:    [0,0]
            startDir: [100,0]
            end:      [200,200]
            endDir:   [0,0]

        pth = cfg.svg.path()
        pth .M  0,0
            .Q  0,0,0,0
            .Q  0,0,0,0

        pth.attr('stroke-linecap': 'round', 'stroke-linejoin': 'round')
        pth.stroke(color: "rgba(0,0,255,0.4)", width: 16).fill('none')

        _.extend pth, @prototype

        cfg.endHead = pth.add(cfg.end,cfg.endDir)
        pth.config  = cfg
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
        @setCtrl 0, c.start
        @setCtrl 1, c.startHead
        @setCtrl 2, c.mid

    setEnd: (p) ->
        c = @config
        c.end = p
        c.endHead = @add(c.end,c.endDir)
        c.mid = @mid(c.startHead,c.endHead)
        @setCtrl 2, c.mid
        @setCtrl 3, c.endHead
        @setCtrl 4, c.end

    setCtrl: (c, p) ->
        si = [0,1,1,2,2][c]
        o  = [0,0,2,0,2][c]
        s  = @getSegment(si)
        s.coords[0+o] = p[0]
        s.coords[1+o] = p[1]
        @replaceSegment si, s
