
class StyleSwitch

    @schemes = ['dark.css', 'bright.css']

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
