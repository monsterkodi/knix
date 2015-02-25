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

_.arg = (event, argname='') ->
    
    if typeof event == 'object'
        if event.detail?
            if event.detail[argname]?
                #log 'event detail arg'
                return event.detail[argname]
            #log 'event detail'
            return event.detail
            
    if argname == 'value'
        #log 'float value'
        return parseFloat event
        
    #log 'just value', event
    event

_.value = (event) -> _.arg event, 'value'
