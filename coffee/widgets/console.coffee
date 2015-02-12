###

     0000000  0000000   000   000    000000    0000000   000      00000000
    000      000   000  0000  000  000        000   000  000      000
    000      000   000  000 0 000   0000000   000   000  000      0000000
    000      000   000  000  0000        000  000   000  000      000
     0000000  0000000   000   000   0000000    0000000   0000000  00000000

###

class Console extends Window

    constructor: (cfg) ->

        @logTags =
            # 'widget':              false
            # 'window':              false
            # 'window.stretchWidth': false
            # 'layout':              false
            # 'tools/stage':         false
            'connections':         false
            'widgets/connection':  false

        @scopeTags = []

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

        @elem.on 'contextmenu', @onContextMenu

    onContextMenu: (event,e) =>

        children = []
        for tag of @logTags
            console.log 'logTags', tag, @logTags[tag]
            children.push
                type: 'toggle'
                text: tag

        children.push
            type: 'button'
            text: 'ok'
            onClick: (event,e) -> e.getWindow().close()

        knix.get
            hasClose: false
            hasMaxi:  false
            hasTitle: false
            resize:   false
            hasShade: false
            pos:      Stage.absPos(event)
            children: children

        event.preventDefault()

    insert: (s) =>
        @getChild('console').elem.insert s
        @scrollToBottom()

    logFileTag: (fileTag,url,s) =>
        @addLogTag fileTag
        onclick = "new Ajax.Request('"+url+"');"
        tags = @allTags fileTag, Console.scopeTags
        styles = ("log_"+t.replace(/[\/]/g, '_') for t in tags).join(' ')
        @insert '<pre class="'+styles+'"><a onClick="'+onclick+
            '" class="console-link" title="'+tags.join(' ')+
            '"><span class="octicon octicon-primitive-dot"></span></a> '+Console.toHtml(s)+
            '</pre>'

        @filterTags tags

    allTags: (fileTag, scopeTags) =>
        scopeTags? and [fileTag, (((s.startsWith('.') or s.startsWith('@')) and fileTag+s or s) for s in scopeTags) ].flatten() or [fileTag]

    filterTags: (tags) =>
        for tag in tags
            if @logTags[tag] == false
                t = tag.replace(/[\/]/g, '_')  # replace slashes with _
                tagElems = @elem.select('.log_'+t)
                for tagElem in tagElems
                    tagElem.style.display = 'none'

    addLogTag: (tag) =>

        @logTags[tag] = true if not @logTags[tag]?
        # console.log @logTags

    # _________________________________________________________________________________________ static

    @setScopeTags: => @scopeTags = Array.prototype.slice.call(arguments, 0)

    @logFileLine: (file, line, s) =>

        url = 'http://localhost:8888/'+file+':'+line
        tag = file.substr(9)             # remove 'coffee/' prefix
        tag = tag.substr(0,tag.length-7) # remove '.coffee' suffix
        # tag = tag.replace(/[\/]/g, '_')  # replace slashes with _

        @allConsoles().each (c) -> c.logFileTag tag, url, s

    @allConsoles: => (e.getWindow() for e in $$(".console"))

    @insert: (s) => @allConsoles().each (c) -> c.insert(s)

    @log:  => @insert Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0))

    @code: => @insert "<pre>" + Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0)) + "</pre>"

    @toHtml: =>

        html = (str(arg) for arg in arguments).join(" ")
        html.replace(/[<]([^>]+)[>]/g, '<span class="console-type">&lt;$1&gt;</span>')
            .replace(/([:,\.\{\}\(\)\[\]])/g, '<span class="console-punct">$1</span>')
            .replace(/->/g, '<span class="octicon octicon-arrow-small-right"></span>')

    @error: =>

        s = '<span class="console-error">%s</span> '.fmt(str(arguments[0])) +
            @toHtml.apply(Console, Array.prototype.slice.call(arguments, 1))
        Console.insert s

    @menu: =>

        knix.create
            type:   'button'
            id:     'open_console'
            icon:   'octicon-terminal'
            class:  'tool-button'
            parent: 'tool'
            onClick: -> new Console()

tag = Console.setScopeTags
