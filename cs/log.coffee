str = require('./tools.coffee').str

log = ->

    # s = ""
    # for arg in arguments
    #     s += str arg
    #     if i < arguments.length-1
    #       s += " "

    s = [str(arg) for arg in arguments].join " "
    console.log s
    return

module.exports = log
