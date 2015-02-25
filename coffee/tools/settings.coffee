###

 0000000  00000000  000000000  000000000  000  000   000   0000000    0000000
000       000          000        000     000  0000  000  000        000     
0000000   0000000      000        000     000  000 0 000  000  0000  0000000 
     000  000          000        000     000  000  0000  000   000       000
0000000   00000000     000        000     000  000   000   0000000   0000000 

###

class Settings

    @set: (key, value) =>
        log key, value
        settings = {}
        if localStorage.getItem('settings')?
            settings = JSON.parse localStorage.getItem('settings')
        settings[key] = value
        localStorage.setItem 'settings', JSON.stringify(settings)
        log settings
        @

    @get: (key, def) =>
        log key, def
        s = localStorage.getItem('settings')
        settings = JSON.parse(s)
        if settings?[key]?
            log settings
            return settings[key]
        def
        
    @clear: => localStorage.setItem 'settings', "{}"
