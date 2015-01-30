
@newElement = (type) ->
    e = new Element type
    e.identify()
    e

String.prototype.fmt = ->
    vsprintf this, [].slice.call arguments

Element.addMethods
    raise: (element) ->
        if not (element = $(element))
            return
        element.parentElement.appendChild element
        return
