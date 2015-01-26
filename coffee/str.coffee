strIndent = "    "
str = (o,indent="") ->
    if o == null
        return "null"
    t = typeof o
    if t == 'string'
        return o
    else if t == 'object'
        s = "\n"
        s = "<"+o.constructor.name + ">\n" if o.constructor.name != "Object"
        s += (indent+strIndent+k + ": " + str(o[k],indent+strIndent) for k in Object.getOwnPropertyNames(o)).join("\n")
        return s+"\n"
    else
        return String(o)
    return "<???>"

module.exports = str
