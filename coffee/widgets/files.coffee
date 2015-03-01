###

00000000  000  000      00000000   0000000
000       000  000      000       000     
000000    000  000      0000000   0000000 
000       000  000      000            000
000       000  0000000  00000000  0000000 

###

class Files

    @saveWindows: =>
        
        windows = knix.allWindows()
        if _.isEmpty windows then return

        json = JSON.stringify { 'windows': (w.config for w in windows), 'connections': knix.allConnections() }, null, '    '
        
        log json
        
        files = @allFiles()
        files[uuid.v4()] = json
        localStorage.setItem 'files', JSON.stringify(files)

    @loadMenu: (event) =>

        files = @allFiles()
        if _.isEmpty files then return
            
        children = []
        for file, data of files
            log 'file', file, data.length
            children.push
                type:       'button'
                text:       file
                onClick:    @fileSelected

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
        knix.closePopups()

    @allFiles: => 
        if localStorage.getItem('files')? 
            return JSON.parse localStorage.getItem('files') 
        {}

    @loadLast: => @loadFile _.keys(@allFiles()).last()
        
    @fileSelected: (event) => @loadFile event.target.getWidget().config.text

    @loadFile: (filename) =>
        log filename
        if filename
            data = @allFiles()[filename]
            knix.closeWindows()
            state = JSON.parse data
            # log state
            knix.restore state
        
