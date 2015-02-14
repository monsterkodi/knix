###

     0000000  0000000   000   000    000000    0000000   000      00000000
    000      000   000  0000  000  000        000   000  000      000
    000      000   000  000 0 000   0000000   000   000  000      0000000
    000      000   000  000  0000        000  000   000  000      000
     0000000  0000000   000   000   0000000    0000000   0000000  00000000

###

class Console extends Window

    @seenTags  = []

    constructor: (cfg) ->

        @logTags =
            'knix':           'off'
            'Stage':          'off'
            # 'Widget':         'off'
            'Window':         'off'
            'layout':         'off'
            'todo':           'off'
            # 'connections':    'off'

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
            if not tag.startsWith('@') and not tag.startsWith('.')
                children.push
                    type:       'toggle'
                    text:       tag
                    state:      @logTags[tag]
                    onState:    @onTagState

        children.push
            type: 'button'
            text: 'ok'
            onClick: (event,e) -> e.getWindow().close()

        knix.get
            hasClose: false
            hasMaxi:  false
            title:    'tags'
            resize:   false
            hasShade: false
            popup:    true
            pos:      Stage.absPos(event)
            children: children
            buttons:  \
            [
                class:   'window-button-right'
                child:
                    type: 'icon'
                    icon: 'octicon-x'
                onClick: (event,e) ->
                    for t in e.getWindow().elem.select('.toggle')
                        t.widget.setState('off')
            ,
                type:    "window-button-left"
                child:
                    type: 'icon'
                    icon: 'octicon-check'
                onClick: (event,e) ->
                    for t in e.getWindow().elem.select('.toggle')
                        t.widget.setState('on')
            ]

        event.preventDefault()

    onTagState: (event,e) =>
        tag = e.widget.config.text
        @logTags[tag] = event.detail.state
        @updateTags()

    insert: (s) =>
        @getChild('console').elem.insert s
        @scrollToBottom()

    logInfo: (info,url,s) =>
        # console.log info, url, s
        @addLogTag info.class
        infoStr = info.class + info.type + info.method
        tags = [info.class].concat(Console.scopeTags)
        styles = ("log_"+t.replace(/[\/@]/g, '_') for t in tags when t?).join(' ')
        @insert '<pre class="'+styles+'">'+
            '<a onClick=\''+url+'\' class="console-link" title="'+infoStr+' '+tags.join(' ')+'">'+
            '<span class="console-class">'+         info.class+'</span>'+
            '<span class="console-method-type">'+   info.type+'</span>'+
            '<span class="console-method">'+        info.method+' </span>'+
            '<span class="octicon octicon-playback-play"></span>'+
            '</a> '+Console.toHtml(s)+
            '</pre>'
        @updateTags()

    updateTags: (tags) =>
        tagElems = @elem.select('pre')
        for tagElem in tagElems
            tagElem.style.display = 'none'
        for tag of @logTags
            if @logTags[tag]? and (@logTags[tag] == true or @logTags[tag] == 'on')
                tclass = '.log_'+tag.replace(/[\/@]/g, '_')  # replace / and @ with _
                tagElems = @elem.select(tclass)
                for tagElem in tagElems
                    tagElem.style.display = ''

    addLogTag: (tag) => @logTags[tag] = true if not @logTags[tag]?

    # _________________________________________________________________________________________ static

    @setScopeTags: =>
        @scopeTags = Array.prototype.slice.call(arguments, 0)
        for t in @scopeTags
            @allConsoles().each (c) -> c.addLogTag(t)

    @logInfo: (info, s) =>
        url = '::.info.json:source-url::'.fmt(info.file,info.line)
        info.file = info.file.slice(9, -7) # remove 'coffee/' prefix and '.coffee' suffix
        @allConsoles().each (c) -> c.logInfo info, url, s

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
