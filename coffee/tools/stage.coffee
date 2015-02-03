
class Stage

    @width:  -> @size().width
    @height: -> @size().height

    @size: ->
        s = window.getComputedStyle $('stage_content')
        width:  parseInt s.width
        height: parseInt s.height
