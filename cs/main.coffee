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
            x:        Math.random() * parseInt size.width
            y:        Math.random() * parseInt size.height

    $('add_b').observe 'click', (e) ->
        w = Widget.widget
            y:        30
            width:    120
            height:   100
            hasTitle: true
            hasSize:  false

        a = Widget.button
            x:        10
            y:        30
            width:    40
            text:     'ok'
            parent:   w.id
            onClick:  (event, element) -> @getParent().getChild('b').close()

        b = Widget.button
            x:        70
            y:        30
            width:    40
            text:     'no'
            parent:   w.id
            style:    'button b'
            onClick:  (event, element) -> @getParent().close()

    Widget.widget
        y:      30
        width:  100
        height: 100
        hasTitle: true
        hasSize: false

    return
