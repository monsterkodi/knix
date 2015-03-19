###

000000000   0000000    0000000   000       0000000
   000     000   000  000   000  000      000     
   000     000   000  000   000  000      0000000 
   000     000   000  000   000  000           000
   000      0000000    0000000   0000000  0000000 

###

Element.addMethods 
    raise: (element) ->
        if not (element = $(element))
            return
        element.parentElement.appendChild element
        return
    getWidget: (element) ->
        return element.widget if element?.widget?
        return element?.parentElement?.getWidget()

SVGAnimatedLength.prototype._str = -> "<%0.2f>".fmt @baseVal.value

_.def = (c,d) ->
    if c?
        _.defaults(_.clone(c), d)
    else if d?
        _.clone(d)
    else
        {}

_.clamp = (r1, r2, v) ->
    if r1 > r2
        [r1,r2] = [r2,r1]
    v = Math.max(v, r1) if r1?
    v = Math.min(v, r2) if r2?
    v

_.round = (value, stepSize=1) -> Math.round(value/stepSize)*stepSize

_.arg = (arg, argname='') ->
    arg = _.arg.caller.arguments[0] if not arg?
    if typeof arg == 'object'
        if arg.detail?
            if arg.detail[argname]?
                return arg.detail[argname]
            return arg.detail
            
    if argname == 'value'
        if typeof arg == 'string'
            return parseFloat arg
    arg

_.value = (arg) -> _.arg arg, 'value'
_.win   =       -> _.win.caller.arguments[0].target.getWidget().getWindow()
_.wid   =       -> _.wid.caller.arguments[0].target.getWidget()
_.del   = (l,e) -> _.remove l, (n) -> n == e
# _.del   = (l,e) -> 
#     while e in l 
#         l.splice l.indexOf(e), 1
