###

00000000  000   000  00000000  000   000  000000000   0000000   00000000   000  0000000  
000       000   000  000       0000  000     000     000        000   000  000  000   000
0000000    000 000   0000000   000 0 000     000     000  0000  0000000    000  000   000
000          000     000       000  0000     000     000   000  000   000  000  000   000
00000000      0      00000000  000   000     000      0000000   000   000  000  0000000  

###

class EventGrid extends Widget

    init: (cfg, defs) =>
        
        cfg = _.def cfg, defs
        
        super cfg,
            class: 'EventGrid'
            noMove: true
            style:
                position: 'relative'

        @rowHeight   = 14
        @minRecIndex = 9*12
        @maxRecIndex = 0
        @timeline    = undefined
        @timeposx    = 0
        @activeCells = []
        @connect 'mousedown', @startSelect            
        @
            
    onWindowSize: => @setWidth @config.steps * @config.stepWidth
                
    ###
    000000000  00000000   000   0000000    0000000   00000000  00000000 
       000     000   000  000  000        000        000       000   000
       000     0000000    000  000  0000  000  0000  0000000   0000000  
       000     000   000  000  000   000  000   000  000       000   000
       000     000   000  000   0000000    0000000   00000000  000   000
    ###
        
    setTime: (time) =>
        @timeposx = time * @config.stepWidth / @config.stepSecs
        for c in @activeCells
            c.setWidth @timeposx - c.relPos().x
        
    addNote: (event) =>
        log event.detail
        
    addTrigger: (target) =>
        
        c = new EventCell
            parent : @
            height : @rowHeight-2
            winID  : target.getWindow().elem.id
            widID  : target.id
            
        recIndex     = target.widget.config.recIndex
        oldMaxIndex  = @maxRecIndex
        oldRange     = @maxRecIndex-@minRecIndex
        @minRecIndex = Math.min(@minRecIndex, recIndex)
        @maxRecIndex = Math.max(@maxRecIndex, recIndex)
        newRange     = @maxRecIndex-@minRecIndex
        if oldMaxIndex < @maxRecIndex
            for c in @children()
                c.moveBy 0, (@maxRecIndex-oldMaxIndex)*@rowHeight
        if oldRange != newRange
            @setHeight (newRange+3)*@rowHeight
        relIndex = recIndex - @minRecIndex
        y = @rowHeight + (newRange-relIndex+1) * @rowHeight
        log @timeposx, y
        c.moveTo @timeposx, y
        @activeCells.push c

    addRelease: (target) =>
        winID = target.getWindow().elem.id
        widID = target.id
        
        for c in @activeCells
            if c.config.winID == winID and c.config.widID == widID
                c.setWidth Math.max(@timeposx - c.relPos().x, 1)
                @activeCells.splice(@activeCells.indexOf c, 1)
                
    delTrigger: (cell) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].splice(@rowColumns[rowIndex].indexOf(colIndex),1) if colIndex in @rowColumns[rowIndex]
        
    triggerRow: (rowIndex) =>
        triggers = []
        for colIndex in @rowColumns[rowIndex]
            col = @columns[colIndex]
            row = col.rows[rowIndex]
            if row.isOn?()
                triggers.push col.rec
            else if row.hasValue?()
                col.rec.getWindow().config[col.rec.config.recKey] = row.value()
        for trigger in triggers
            trigger.trigger?()

    releaseRow: (rowIndex) =>
        releases = []
        for colIndex in @releaseRowColumns[rowIndex]
            col = @columns[colIndex]
            row = col.rows[rowIndex]
            if row.isOn?()
                releases.push col.rec
        for release in releases
            release.release?()

    removeAllCells: =>
        log 'removeAllCells'
        @activeCells = []
        for c in @children()
            c.close()
        
    ###
    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000     
     000 000   000000000  000      000   000  0000000 
       000     000   000  000      000   000  000     
        0      000   000  0000000   0000000   00000000
    ###
                
    addValue: (valueWidget) =>
        log 'value', valueWidget.elem.id, valueWidget.config.value
        # col = @columnFor valueWidget.elem
        # row = col.rows[@step.index]
        # @setValue row, valueWidget
        # row.on()
        
    setValue: (cell, valueWidget) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].push(colIndex) if colIndex not in @rowColumns[rowIndex]   
        cell.clear()
        cell.insertChild valueWidget.config
        
    ###
     0000000  00000000  000      00000000   0000000  000000000
    000       000       000      000       000          000   
    0000000   0000000   000      0000000   000          000   
         000  000       000      000       000          000   
    0000000   00000000  0000000  00000000   0000000     000   
    ###
    
    startSelect: (event) =>
        log 'start select'
        Selectangle.start @
        event.stop()
        
