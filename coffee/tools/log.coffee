###

    000        0000000    0000000
    000       000   000  000
    000       000   000  000  0000
    000       000   000  000   000
    000000000  0000000    0000000

###

tag = ->
    for t in arguments
        console.log 'tag:', t

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

    array = Array.prototype.slice.call(arguments, 2)
    s = (str(arg) for arg in array).join " "
    console.log "%c%s", 'color:white', s
    Console.logTag arguments[0], arguments[1], s

error = ->

    s = (str(arg) for arg in arguments).join " "

    console.log "%c%s", 'color:yellow', s

    Console.error.apply(Console, Array.prototype.slice.call(arguments, 0))
