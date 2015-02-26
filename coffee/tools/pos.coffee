###

00000000    0000000    0000000
000   000  000   000  000     
00000000   000   000  0000000 
000        000   000       000
000         0000000   0000000 

###

class Pos

    constructor: (@x, @y) ->
        
    copy: => new Pos @x, @y

    add: (val) =>
        newPos = @copy()
        if val?
            newPos.x += val.x  unless isNaN(val.x)
            newPos.y += val.y  unless isNaN(val.y)
        newPos

    sub: (val) =>
        newPos = @copy()
        if val?
            newPos.x -= val.x  unless isNaN(val.x)
            newPos.y -= val.y  unless isNaN(val.y)
        newPos

    mul: (val) =>
        @x *= val
        @y *= val
        @

    scale: (other) =>
        @x *= other.x
        @y *= other.y
        @

    mid: (other) => @add(other).mul(0.5)

    min: (val) =>
        newPos = @copy()
        return newPos unless val?
        newPos.x = val.x  if not isNaN(val.x) and @x > val.x
        newPos.y = val.y  if not isNaN(val.y) and @y > val.y
        newPos

    max: (val) =>
        newPos = @copy()
        return newPos unless val?
        newPos.x = val.x  if not isNaN(val.x) and @x < val.x
        newPos.y = val.y  if not isNaN(val.y) and @y < val.y
        newPos

    clamp: (lower, upper) =>
        newPos = @copy()
        if lower? and upper?
            newPos.x = _.clamp(lower.x, upper.x, @x)
            newPos.y = _.clamp(lower.y, upper.y, @y)
        newPos

    square:         => (@x * @x) + (@y * @y)
    distSquare: (o) => @sub(o).square()
    dist:       (o) => Math.sqrt @distSquare(o)

    same:    (o) => @x == o?.x and @y == o?.y
    notSame: (o) => @x != o?.x or  @y != o?.y

    check: =>
        newPos = @copy()
        newPos.x = 0  if isNaN(newPos.x)
        newPos.y = 0  if isNaN(newPos.y)
        newPos

    _str: => "<x:%2.2f y:%2.2f>".fmt @x, @y

pos = (x,y) -> new Pos x,y
