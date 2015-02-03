
#    #######   #######   ###   ###    #######   #######   ###      ########
#   ###       ###   ###  ####  ###  ###        ###   ###  ###      ###
#   ###       ###   ###  ### # ###   #######   ###   ###  ###      #######
#   ###       ###   ###  ###  ####        ###  ###   ###  ###      ###
#    #######   #######   ###   ###   #######    #######   #######  ########

class Console extends Widget

    @log: (s) ->

        $$(".console").each (e) ->
            e.insert "<pre>"+s+"</pre>"
            e.getWindow().scrollToBottom()
        this

    @menu: ->

        Widget.create
            type:   'button'
            id:     'open_console'
            text:   'console'
            parent: 'menu'
            onClick: -> Console.create()

    @create: (cfg) ->

        w2 = Stage.size().width/2
        h2 = Stage.size().height/2

        con = knix.get
            title:    'console'
            class:    'console-window'
            x:        w2
            y:        0
            width:    w2-4
            height:   h2-4
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
                class:  'console'
                text:   'knix 0.1.0'
                noDown: true
