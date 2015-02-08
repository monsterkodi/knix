###

     0000000   0000000   000   000    000000    0000000   000      00000000
    000       000   000  0000  000  000        000   000  000      000
    000       000   000  000 0 000   0000000   000   000  000      0000000
    000       000   000  000  0000        000  000   000  000      000
     0000000   0000000   000   000   0000000    0000000   0000000  00000000

###

class Console extends Window

    @toHtml: ->

        html = (str(arg) for arg in arguments).join(" ")
        html.replace(/[<]([^>]+)[>]/g, '<span class="console-type">&lt;$1&gt;</span>')
            .replace(/([:,\.\{\}\(\)\[\]])/g, '<span class="console-punct">$1</span>')
            .replace(/->/g, '<span class="octicon octicon-arrow-small-right"></span>')

    @log: ->

        s = Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0))

        $$(".console").each (e) ->
            e.insert "<pre>"+s+"</pre>"
            e.getWindow().scrollToBottom()
        this

    @menu: ->

        knix.create
            type:   'button'
            id:     'open_console'
            icon:   'octicon-terminal'
            class:  'tool-button'
            parent: 'tool'
            onClick: -> new Console()

    constructor: (cfg) ->

        w  = Stage.size().width/2
        h  = Stage.size().height - $('menu').getHeight() - 2

        super cfg,
            title:    'console'
            class:    'console-window'
            x:        w
            y:        $('menu').getHeight()+2
            width:    w
            height:   h
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
