---
title:  knix
layout: default
---

![screenshot](http://monsterkodi.github.io/knix/images/knix03.png)

# example code

{% highlight coffee %}

w = knix.get
    title:     'hello'
    hasSize:   true
    minWidth:  130
    center:    true
    children: \
    [
        type:       'slider'
        hasBar:     true
        hasKnob:    true
        valueStep:  5
    ,
        type:       'value'
        format:     "%3.2f"
        valueStep:  21
    ,
        type:       'button'
        text:       'ok'
        onClick:    -> @getWindow().close()
    ]
    connect: \
    [
        signal: 'slider:onValue'
        slot:   'value:setValue'
    ]

w.resolveSlot('slider:setValue') 33.3

{% endhighlight %}

# demo

I am currently only supporting firefox. But it might work with some layout glitches on non-IE browsers as well:

[demo](demo.html)
