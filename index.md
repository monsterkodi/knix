---
title:  knix
layout: default
---

![screenshot](http://monsterkodi.github.io/knix/images/knix03.png)

# example code

{% highlight coffee %}

@audioNodes: ->
    
    o1= new Oscillator
        title: 'high'
        minFreq: 2000
        x: 10
        y: 40

    g1= new Gain
        gain: 0.0
        x: 250
        y: 40

    an= new Analyser
        x: 500
        y: 42

    f4= new Filter
        x: 1050
        y: 42

    gm= new Gain
        master: true
        gain: 0.0
        x: 1050
        y: 400

    new Connection
        source: o1.connector 'audio:out'
        target: g1.connector 'audio:in'
    new Connection
        source: g1.connector 'audio:out'
        target: an.connector 'audio:in'
    new Connection
        source: an.connector 'audio:out'
        target: f4.connector 'audio:in'
    new Connection
        source: f4.connector 'audio:out'
        target: gm.connector 'audio:in'
        
{% endhighlight %}

# demo

I am currently only supporting firefox. But it might work with some layout glitches on non-IE browsers as well:

[demo](demo.html)
