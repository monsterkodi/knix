str = require('./str.coffee')
con = require('./console.coffee')

log = ->

    f = printStackTrace()[4].split('@')[1]
    f = f.substr('file:///Users/kodi/Projects/knix/'.length)
    f = f.substr(0,f.length-2)

    # s = ""
    # for arg in arguments
    #     s += str arg
    #     if i < arguments.length-1
    #       s += " "
    s = (str(arg) for arg in arguments).join(" ")

    # console.dir(console)
    # console.trace()
    console.log "%s %c%o", s, 'color:gray', "http:localhost:8888/"+f

    con.log s

    return this

module.exports = log
