
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

_.def = (c,d) -> _.defaults(_.cloneDeep(c), d)
