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
        @    
                
    ###
     0000000  00000000  000      00000000   0000000  000000000
    000       000       000      000       000          000   
    0000000   0000000   000      0000000   000          000   
         000  000       000      000       000          000   
    0000000   00000000  0000000  00000000   0000000     000   
    ###
    
    startSelect: (event) =>
        Selectangle.start @content
        event.stop()

    ###
    000000000  00000000   000   0000000    0000000   00000000  00000000 
       000     000   000  000  000        000        000       000   000
       000     0000000    000  000  0000  000  0000  0000000   0000000  
       000     000   000  000  000   000  000   000  000       000   000
       000     000   000  000   0000000    0000000   00000000  000   000
    ###
        
    addTrigger: (target) =>
        col = @columnFor target
        row = col.rows[@step.index]
        @setTrigger row
        row.on()

    addRelease: (target) =>
        col = @columnFor target
        row = col.rows[@step.index]
        @setRelease row
        row.on()
        
    setTrigger: (cell) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].push(colIndex) if colIndex not in @rowColumns[rowIndex]

    setRelease: (cell) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @releaseRowColumns[rowIndex].push(colIndex) if colIndex not in @releaseRowColumns[rowIndex]
        
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

    ###
    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000     
     000 000   000000000  000      000   000  0000000 
       000     000   000  000      000   000  000     
        0      000   000  0000000   0000000   00000000
    ###
                
    addValue: (valueWidget) =>
        # log 'value', valueWidget.elem.id, valueWidget.config.value
        col = @columnFor valueWidget.elem
        row = col.rows[@step.index]
        @setValue row, valueWidget
        row.on()
        
    setValue: (cell, valueWidget) =>
        rowIndex = cell.config.index 
        colIndex = cell.column().config.index
        @rowColumns[rowIndex].push(colIndex) if colIndex not in @rowColumns[rowIndex]   
        cell.clear()
        cell.insertChild valueWidget.config
        
        
        