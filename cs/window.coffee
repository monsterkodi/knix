class Window

    @width: ->
        @size().width

    @height: ->
        @size().height

    @size: ->
        s = window.getComputedStyle $('content')
        width:  parseInt s.width
        height: parseInt s.height

module.exports = Window
