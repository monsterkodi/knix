
class Stage

    @width:  -> @size().width
    @height: -> @size().height

    @size: ->
        s = window.getComputedStyle $('stage_content')
        width:  parseInt s.width
        height: parseInt s.height

    @isFullscreen: ->
        document.fullscreenElement or
        document.webkitFullscreenElement or
        document.mozFullScreenElement or
        document.mozFullScreen or
        document.webkitIsFullScreen

    @toggleFullscreen: ->
        if @isFullscreen()?
            document.mozCancelFullScreen?()
            document.webkitExitFullscreen?()
            document.exitFullscreen?()
        else
            s = $('stage')
            s.mozRequestFullScreen?()
            s.webkitRequestFullscreen?()
            s.requestFullscreen?()
