
class Console

    @log: (s) ->
        $$(".console").each (e) ->
            e.insert "<pre>"+s+"</pre>"
            e.getWidget().scrollToBottom()
        this

    @menu: ->

        wid = require './wid.coffee'
        wid.get
            type:   'button'
            id:     'open_console'
            text:   'console'
            parent: 'menu'
            onClick: -> Console.show()

    @show: ->
        wid = require './wid.coffee'
        stg = require './stage.coffee'
        wid.get
            title:    'console'
            class:    'frame console-widget'
            x:        stg.size().width/2
            y:        0
            width:    stg.size().width/2-4
            height:   stg.size().height-4
            content:  'scroll'
            child:
                type:   'console'
                text:   'knix 0.1.0'
                noDown: true

module.exports = Console
