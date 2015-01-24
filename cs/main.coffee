log    = require './log.coffee'
Widget = require './widget.coffee'
Window = require './window.coffee'

document.observe "dom:loaded", ->

    log "window size:", Window.size()

    #log (x + y for x in [1, 2] for y in [7, 8])

    $$(".menu").each (menu) ->
        $(menu.id).raise()

    $('del').observe 'click', (e) ->
        log 'del'
        Widget.closeAll

    $('add_a').observe 'click', (e) ->
        size = window.getComputedStyle $('content')
        cfg =
            width:    300
            height:   200
            x:        Math.random() * parseInt size.width
            y:        Math.random() * parseInt size.height
        log cfg
        Widget.create cfg

    $('add_b').observe 'click', (e) ->
        log 'hello'

    Widget.create
        y:      30
        width:  100
        height: 100
        hasTitle: true
        hasSize: false

    return
