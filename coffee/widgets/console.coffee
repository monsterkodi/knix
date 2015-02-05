###

     0000000   0000000   000   000    000000    0000000   000      00000000
    000       000   000  0000  000  000        000   000  000      000
    000       000   000  000 0 000   0000000   000   000  000      0000000
    000       000   000  000  0000        000  000   000  000      000
     0000000   0000000   000   000   0000000    0000000   0000000  00000000

###

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
            icon:   'octicon-terminal'
            class:  'tool-button'
            parent: 'tool'
            onClick: -> Console.create()

    @create: (cfg) ->

        w2 = Stage.size().width/2
        h2 = Stage.size().height/2

        con = knix.get
            title:    'console'
            class:    'console-window'
            x:        w2
            y:        $('menu').getHeight()+2
            width:    w2
            height:   h2*2
            content:  'scroll'
            buttons:  \
            [
                class:   'window-button-right'
                child:
                    type: 'icon'
                    icon: 'octicon-trashcan'
                onClick: (event,e) -> e.getWindow().getChild('console').clear()
            ,
                type:    "window-button-left"
                child:
                    type: 'icon'
                    icon: 'octicon-diff-added'
                onClick: (event,e) -> e.getWindow().maximize()
            ]
            child:
                class:  'console'
                text:   '<span class="tiny-text" style="vertical-align:top">console - knix version '+knix.version+'</span>'
                noDown: true
