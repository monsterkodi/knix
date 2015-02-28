###

00000000  000  000      00000000   0000000
000       000  000      000       000     
000000    000  000      0000000   0000000 
000       000  000      000            000
000       000  0000000  00000000  0000000 

###

class Files

    @saveWindows: =>
        log 'saveWindows'
        dump = ''
        dump += JSON.stringify { 'windows': (w.config for w in knix.allWindows()), 'connections': knix.allConnections() }, null, '    '
        dump = dump.slice(0,-1)
        dump += "    }"
        log dump
        files = {} 
        if localStorage.getItem('files')?
            files = JSON.parse localStorage.getItem('files')
        files[uuid.v4()] = dump
        localStorage.setItem 'files', JSON.stringify(files)

    @loadMenu: (event) =>

        children = []
        for file, data of JSON.parse(localStorage.getItem('files'))
            log 'file', file, data.length
            children.push
                type:       'button'
                text:       file
                onClick:    @loadFile

        knix.get
            hasClose: true
            hasMaxi:  false
            title:    ' '
            resize:   false
            hasShade: false
            popup:    true
            pos:      Stage.absPos event
            children: children
            buttons:  \
            [
                type:    "window-button-left"
                child:
                    type: 'icon'
                    icon: 'octicon-trashcan'
                onClick: @trashFiles
            ]

    @trashFiles: =>
        localStorage.setItem 'files', "{}"

    @loadFile: (event) =>
        filename = event.target.getWidget().config.text
        log filename
        data = JSON.parse(localStorage.getItem('files'))[filename]
        log data.length
        knix.closeWindows()
        state = JSON.parse data
        log state
        knix.restore state
        
