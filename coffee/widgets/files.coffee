###

00000000  000  000      00000000   0000000
000       000  000      000       000     
000000    000  000      0000000   0000000 
000       000  000      000            000
000       000  0000000  00000000  0000000 

###

class Files

    @saveWindows: =>
        
        windows = knix.selectedOrAllWindows()
        if _.isEmpty windows then return
        json = knix.stateForWidgets windows
        
        # log json
        
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
                type    : 'button'
                text    : file
                action  : @fileSelected

        f = knix.get
            title    : ' '
            hasClose : true
            hasMaxi  : false
            resize   : false
            hasShade : false
            popup    : true
            pos      : Stage.absPos event
            children : children
            buttons  : \
            [
                action : @trashFiles
                icon   : 'octicon-trashcan'
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
        if filename
            log filename
            data = @allFiles()[filename]
            knix.closeAllWindows()
            knix.restore JSON.parse data
        
