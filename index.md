---
title: knix
layout: default
---

![screenshot](http://monsterkodi.github.io/knix/images/knix01.png)

# example code

{% highlight coffee %}

wid.get
    type:   'button'
    text:   'hello'
    parent: 'menu'
    onClick: ->
        wid.get
            title:     'hello'
            hasSize:   true
            minWidth:  130
            children: \
            [
                id:         'slider'
                type:       'slider'
                hasKnob:    true
                hasBar:     true
                value:      50.0
                valueMax:   200.0
                valueStep:  1
            ,
                type:       'value'
                format:     "%3.2f"
                connect:
                    signal: 'slider:onValue'
                    slot:   'setValue'
            ,
                type:       'relative'
                child:
                    type:       'button'
                    text:       'ok'
                    onClick:    -> @getWindow().close()
            ]

{% endhighlight %}
