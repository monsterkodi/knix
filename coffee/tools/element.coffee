
@newElement = (type) ->
    e = new Element type
    e.identify()
    e

Element.addMethods
    raise: (element) ->
        if not (element = $(element))
            return
        element.parentElement.appendChild element
        return

_.def = (c,d) ->
    if c?
        _.defaults(_.clone(c), d)
        # _.defaults(c, d)
    else
        d

_.clamp = (r1, r2, v) ->
        if r1 > r2
            [r1,r2] = [r2,r1]
        v = Math.max(v, r1) if r1?
        v = Math.min(v, r2) if r2?
        v
