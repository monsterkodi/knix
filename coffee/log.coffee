str = require('./str.coffee')

log = ->

    f = printStackTrace()[4].split('@')[1]
    f = f.substr('file:///Users/kodi/Desktop/knix/'.length)
    f = f.substr(0,f.length-2)
    # console.log "%c%o", 'color:gray', "http:localhost:8888/"+f

    # s = ""
    # for arg in arguments
    #     s += str arg
    #     if i < arguments.length-1
    #       s += " "
    s = (str(arg) for arg in arguments).join(" ")
    # console.dir(console)
    # console.trace()
    console.log "%s %c%o", s, 'color:gray', "http:localhost:8888/"+f
    return

module.exports = log
