###

     0000000  000000000 000   000 000      00000000
    000          000     000 000  000      000     
     0000000     000      00000   000      0000000 
          000    000       000    000      000     
     0000000     000       000    00000000 00000000

###

class StyleSwitch

    @schemes = ['dark.css', 'bright.css']
    @filter = null

    @toggle: ->

        link = document.getElementById 'style-link'
        currentScheme = link.href.split('/').last()
        nextSchemeIndex = ( @schemes.indexOf(currentScheme) + 1) % @schemes.length
        newlink = document.createElement "link"
        newlink.setAttribute 'rel',  'stylesheet'
        newlink.setAttribute 'type', 'text/css'
        newlink.setAttribute 'href', 'style/'+@schemes[nextSchemeIndex]
        newlink.setAttribute 'id',   'style-link'

        link.parentNode.replaceChild(newlink, link)

    @togglePathFilter: ->

        if not @filter?
            for p in $$('.path')
                if not filter?
                    s = window.getComputedStyle p
                    @filter = p.instance.style('filter')
                p.instance.style 'filter: none'
        else
            for p in $$('.path')
                p.instance.style({ filter: @filter })
            @filter = null
