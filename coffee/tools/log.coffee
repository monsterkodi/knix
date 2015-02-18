###

000       0000000    0000000 
000      000   000  000      
000      000   000  000  0000
000      000   000  000   000
0000000   0000000    0000000 

###

log = -> Console.logInfo.apply Console, Array.prototype.slice.call(arguments, 0)

error = ->
    tag 'error'
    Console.logInfo.apply Console, Array.prototype.slice.call(arguments, 0)

warn = ->
    tag 'warning'
    Console.logInfo.apply Console, Array.prototype.slice.call(arguments, 0)
