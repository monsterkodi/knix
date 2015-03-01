###

 0000000  000000000   0000000    0000000   00000000
000          000     000   000  000        000     
0000000      000     000000000  000  0000  0000000 
     000     000     000   000  000   000  000     
0000000      000     000   000   0000000   00000000

###

class Stage

    @initContextMenu: =>

        log 'initContextMenu'
        $('stage_content').on 'mousedown', @showContextMenu

        @contextMenu = knix.get
            id:    'context-menu'
            type:  'context-menu'
            title: 'context'
            style:
                position: 'absolute'

        @contextMenu.elem.hide()
        @contextMenu

    @positionWindow: (win) =>
        # log win
        [p, w, h] = [win.absPos(), win.getWidth(), win.getHeight()]
        # log p, w, h
        if p.x + w > @width()
            win.setPos pos @width() - w, Math.max(p.y, $('menu').getHeight())

    @showContextMenu: (event, e) =>
        if $('stage_content') == e
            log 'showContextMenu'
            @contextMenu.elem.show()

    @width:  => @size().width
    @height: => @size().height

    @size: =>
        s = window.getComputedStyle $('stage_content')
        width:  parseInt s.width
        height: parseInt s.height

    @isFullscreen: =>
        document.fullscreenElement or
        document.webkitFullscreenElement or
        document.mozFullScreenElement or
        document.mozFullScreen or
        document.webkitIsFullScreen

    @toggleFullscreen: =>
        if @isFullscreen()?
            document.mozCancelFullScreen?()
            document.webkitExitFullscreen?()
            document.exitFullscreen?()
        else
            s = $('stage')
            s.mozRequestFullScreen?()
            s.webkitRequestFullscreen?()
            s.requestFullscreen?()

    @absPos: (event) =>
        event = if event? then event else window.event
        if isNaN window.scrollX
            return pos(event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
                       event.clientY + document.documentElement.scrollTop + document.body.scrollTop)
        else
            return pos(event.clientX + window.scrollX, event.clientY + window.scrollY)

    @relPos: (event) =>
        event = if event? then event else window.event
        c = pos event.clientX, event.clientY
        t = event.target.getWidget().absPos()
        # log c, t
        return c.sub t
