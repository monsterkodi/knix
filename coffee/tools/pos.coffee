class Pos

    constructor: (@x, @y) ->

    add: (val) ->
        newPos = new Pos(@x, @y)
        if val?
            newPos.x += val.x  unless isNaN(val.x)
            newPos.y += val.y  unless isNaN(val.y)
        newPos

    sub: (val) ->
        newPos = new Pos(@x, @y)
        if val?
            newPos.x -= val.x  unless isNaN(val.x)
            newPos.y -= val.y  unless isNaN(val.y)
        newPos

    min: (val) ->
        newPos = new Pos(@x, @y)
        return newPos unless val?
        newPos.x = val.x  if not isNaN(val.x) and @x > val.x
        newPos.y = val.y  if not isNaN(val.y) and @y > val.y
        newPos

    max: (val) ->
        newPos = new Pos(@x, @y)
        return newPos unless val?
        newPos.x = val.x  if not isNaN(val.x) and @x < val.x
        newPos.y = val.y  if not isNaN(val.y) and @y < val.y
        newPos

    bound: (lower, upper) ->
        newPos = @max(lower)
        newPos.min upper

    check: ->
        newPos = new Pos(@x, @y)
        newPos.x = 0  if isNaN(newPos.x)
        newPos.y = 0  if isNaN(newPos.y)
        newPos

    apply: (element) ->
        element = document.getElementById(element)  if typeof (element) is "string"
        return  unless element?
        element.style.left = @x + "px"  unless isNaN(@x)
        element.style.top = @y + "px"  unless isNaN(@y)
        return

pos = (x,y) -> new Pos x,y
