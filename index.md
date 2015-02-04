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
    onClick: -&gt;
        wid.get
            title:     'hello'
            hasSize:   true
            width:     200
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
                value:      50
                valueMin:   20
                valueMax:   80
                format:     "%3.2f"
                connect:
                    signal: 'slider:onValue'
                    slot:   'setValue'
            ,
                type:       'relative'
                child:
                    type:       'button'
                    text:       'ok'
                    class:      'top-right'
                    onClick:    -&gt; @getWindow().close()
            ]

{% endhighlight %}
