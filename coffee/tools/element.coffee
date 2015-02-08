
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
