###

    000        0000000    0000000
    000       000   000  000
    000       000   000  000  0000
    000       000   000  000   000
    000000000  0000000    0000000

###

log = ->

    # f = printStackTrace()[4].split('@')[1]
    # f = f.substr('file:///Users/kodi/Projects/knix/'.length)
    # f = f.substr(0,f.length-2)

    # s = ""
    # for arg in arguments
    #     s += str arg
    #     if i < arguments.length-1
    #       s += " "
    s = (str(arg) for arg in arguments).join(" ")

    # console.dir(console)
    # console.trace()
    console.log "%c%s", 'color:white', s

    Console.log.apply(Console, Array.prototype.slice.call(arguments, 0))

_log = ->

    url = 'http://localhost:8888/'+arguments[0]+':'+arguments[1]
    onclick = "new Ajax.Request('"+url+"');"
    short = arguments[0].substr(9)         # remove 'coffee/' prefix
    short = short.substr(0,short.length-7) # remove '.coffee' suffix
    array = Array.prototype.slice.call(arguments, 2)
    s = (str(arg) for arg in array).join(" ")
    console.log "%c%s", 'color:white', s
    s = '<pre><a onClick="'+onclick+'" class="console-link" title="'+short+'"><span class="octicon octicon-primitive-dot"></span></a> ' + Console.toHtml(s) + '</pre>'
    Console.insert(s)

error = ->

    s = (str(arg) for arg in arguments).join(" ")

    console.log "%c%s", 'color:yellow', s

    Console.error.apply(Console, Array.prototype.slice.call(arguments, 0))
