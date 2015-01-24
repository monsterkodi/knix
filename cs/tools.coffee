
@str = (o) ->
  s = JSON.stringify(o, null, '   ')
  if s == "{}" and String(o) != "{}"
    s = [String(o), "id:", o.id, "class:", o.className, JSON.stringify($H(o), null, '   ')].join(" ")
  s

@newElement = (type) ->
    e = new Element type
    e.identify()
    e

String.prototype.fmt = ->
  @sprintf.apply this,
    [].slice.call arguments

Element.addMethods
    raise: (element) ->
        if not (element = $(element))
          return
        element.parentElement.appendChild element
        return
