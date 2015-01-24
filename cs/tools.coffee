strIndent = "   "
strFunctn = (o,indent="") ->
    if o == null
        return "null"
    t = typeof o
    if t == 'string'
        return o
    else if t == 'object'
        if o.constructor.name == 'Object'
            if o.id
                return ["<", t, String(o), "id:", o.id, "class:", o.className, ">", JSON.stringify($H(o), null, strIndent)].join("=")
            else
                return $H(o).inspect().slice "#<Hash:".length
        else
            s ="<"+o.constructor.name + ">\n"
            s += (indent+strIndent+k + ": " + strFunctn(o[k],indent+strIndent) for k in Object.getOwnPropertyNames(o)).join("\n")
            return s
    else
        return String(o)
    "<???>"

@str = strFunctn

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
