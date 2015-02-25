###

000000000   0000000    0000000   000       0000000
   000     000   000  000   000  000      000     
   000     000   000  000   000  000      0000000 
   000     000   000  000   000  000           000
   000      0000000    0000000   0000000  0000000 

###

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
    getWidget: (element) ->
        return element.widget if element?.widget?
        return element?.parentElement?.getWidget()

_.del = (l,e) ->
    _.remove l, (n) -> n == e

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

_.arg = (arg, argname='') ->
    arg = _.arg.caller.arguments[0] if not arg?
    if typeof arg == 'object'
        if arg.detail?
            if arg.detail[argname]?
                #log 'event detail arg'
                return arg.detail[argname]
            #log 'event detail'
            return arg.detail
            
    if argname == 'value'
        #log 'float value'
        return parseFloat arg
        
    #log 'just value', event
    arg

_.value = (arg) -> _.arg arg, 'value'

_.win = -> _.win.caller.arguments[0].target.getWidget().getWindow()
_.wid = -> _.wid.caller.arguments[0].target.getWidget()
