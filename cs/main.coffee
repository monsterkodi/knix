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
        size = window.getComputedStyle $('stage_content')
        Widget.widget
            width:    300
            height:   200
            title:    'widget'
            x:        Math.random() * parseInt size.width
            y:        Math.random() * parseInt size.height

    $('add_b').observe 'click', (e) ->
        w = Widget.widget
            y:        30
            title:    'hello'
            hasSize:  true

        c = Widget.scroll
            parent:   w
            width:    100
            valueMin: 20.0
            valueMax: 60.0
            rangeMin: 0.0
            rangeMax: 100.0

        s = Widget.slider
            parent:   w
            width:    100
            value:    70.0
            rangeMin: 0.0
            rangeMax: 100.0

        v = Widget.value
            parent:   w
            width:    100
            value:    600.0
            rangeMin: 4
            rangeMax: 10
            step:     1

        a = Widget.button
            width:    40
            text:     'ok'
            parent:   w
            style:    'button a static-left'
            onClick:  (event, element) -> @getParent().getChild('b').close()

        b = Widget.button
            width:    40
            text:     'no'
            parent:   w
            style:    'button b static-right'
            onClick:  (event, element) -> @getParent().close()

    Widget.widget
        y:      30
        width:  100
        height: 100
        hasTitle: true
        hasSize: false

    return
