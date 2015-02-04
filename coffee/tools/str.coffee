
strIndent = "    "

str = (o,indent="",visited=[]) ->
    if o == null
        return "<null>"
    t = typeof o
    if t == 'string'
        return o
    else if t == 'object'
        if o in visited
            if o.id? and typeof o.id == 'string' and o.localName? then return "<" + o.localName + "#" + o.id + ">"
            return "<visited>"
        protoname = o.constructor.name
        if not protoname? or protoname == ""
            if o.id? and typeof o.id == 'string' and o.localName?
                protoname = o.localName + "#"+o.id
            else
                protoname = "object"
        s = "<" + protoname + ">\n"
        visited.push o
        s += (indent+strIndent+k + ": " + str(o[k],indent+strIndent,visited) for k in Object.getOwnPropertyNames(o)).join("\n")
        return s+"\n"
    else if t == 'function'
        return "->"
    else
        return String(o) # plain values
    return "<???>"

String.prototype.fmt = ->
    vsprintf this, [].slice.call arguments
