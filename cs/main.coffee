log    = require './log.coffee'
Widget = require './widget.coffee'
Window = require './window.coffee'

document.observe "dom:loaded", ->

    # log "window size:", Window.size()
    # log (x + y for x in [1, 2] for y in [7, 8])

    $$(".menu").each (menu) ->
        $(menu.id).raise()

    $('del').observe 'click', (e) ->
        Widget.closeAll()

    $('add_a').observe 'click', (e) ->
        size = window.getComputedStyle $('content')
        Widget.widget
            width:    300
            height:   200
            title:    'widget'
            x:        Math.random() * parseInt size.width
            y:        Math.random() * parseInt size.height

    $('add_b').observe 'click', (e) ->
        w = Widget.widget
            y:        30
            width:    120
            height:   150
            title:    'hello'
            hasSize:  true

        a = Widget.button
            x:        10
            y:        120
            width:    40
            text:     'ok'
            parent:   w.id
            onClick:  (event, element) -> @getParent().getChild('b').close()

        b = Widget.button
            x:        70
            y:        120
            width:    40
            text:     'no'
            parent:   w.id
            style:    'button b'
            onClick:  (event, element) -> @getParent().close()

        c = Widget.scroll
            x:        10
            y:        30
            parent:   w.id
            width:    100
            valueMin: 20.0
            valueMax: 60.0
            rangeMin: 0.0
            rangeMax: 100.0

        s = Widget.slider
            x:        10
            y:        60
            parent:   w.id
            width:    100
            value:    70.0
            rangeMin: 0.0
            rangeMax: 100.0

        v = Widget.value
            x:        10
            y:        90
            parent:   w.id
            width:    100
            value:    600.0
            rangeMin: 4
            rangeMax: 10
            step:     1

    Widget.widget
        y:      30
        width:  100
        height: 100
        hasTitle: true
        hasSize: false

    return
