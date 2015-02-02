
class Console

    @log: (s) ->
        $$(".console").each (e) ->
            e.insert "<pre>"+s+"</pre>"
            e.getWindow().scrollToBottom()
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
        con = wid.get
            type:     'window'
            title:    'console'
            class:    'console-window'
            x:        stg.size().width/2
            y:        0
            width:    stg.size().width/2-4
            height:   stg.size().height/2-4
            content:  'scroll'
            buttons:  \
            [
                type:    "window-button-right"
                child:
                    type: 'icon'
                    icon: 'octicon-trashcan'
                onClick: (event,e) ->
                    e.getWindow().getChild('console').clear()
            ,
                type:    "window-button-left"
                child:
                    type: 'icon'
                    icon: 'octicon-diff-added'
                onClick: (event,e) -> e.getWindow().maximize()
            ]
            child:
                type:   'console'
                text:   'knix 0.1.0'
                noDown: true

module.exports = Console
