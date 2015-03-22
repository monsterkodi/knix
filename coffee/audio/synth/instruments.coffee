###

000  000   000   0000000  000000000  00000000   000   000  00     00  00000000  000   000  000000000   0000000
000  0000  000  000          000     000   000  000   000  000   000  000       0000  000     000     000     
000  000 0 000  0000000      000     0000000    000   000  000000000  0000000   000 0 000     000     0000000 
000  000  0000       000     000     000   000  000   000  000 0 000  000       000  0000     000          000
000  000   000  0000000      000     000   000   0000000   000   000  00000000  000   000     000     0000000 

###

class Instruments extends Buffers

    @names = ["test1", "test2", 
    "piano1", "piano2", "piano3", "piano4", "piano5", 
    "string1", "string2", 
    "bell1", "bell2", "bell3", "bell4", 
    "flute", 
    "organ1", "organ2", "organ3", "organ4", 
    "fm1", "fm2", "fm3", "drum1", 
    "drum2", "drum3"]

    constructor: (cfg, defs) -> @init cfg, defs

    init: (cfg, defs) =>
        super cfg, defs
        @

    setInstrument: (v) =>
        if @config.instrument != _.value(v)
            @config.instrument = _.value(v)
            @initInstrument()
            
    initInstrument: =>
        log @config.instrument
        @createBuffers()
            
    initNoteAtIndex: (noteIndex) =>
        # log @config.instrument, noteIndex
        noteName = Keyboard.allNoteNames()[noteIndex]
        frequency = Keyboard.allNotes()[noteName]
        w = 2.0 * Math.PI * frequency
        func = @[@config.instrument]
        for sampleIndex in [0...@sampleLength]
            x = sampleIndex/(@sampleLength-1)
            @samples[noteIndex][sampleIndex] = func sampleIndex*@isr, w, x

    sampleForNoteIndex: (noteIndex) =>
        if not @samples[noteIndex]?
            @samples[noteIndex] = new Float32Array @sampleLength
            @initNoteAtIndex noteIndex
        @samples[noteIndex]
                
    createBuffers: => @samples = new Array Keyboard.numNotes()
                
    ###
    000000000  00000000   0000000  000000000
       000     000       000          000   
       000     0000000   0000000      000   
       000     000            000     000   
       000     00000000  0000000      000   
    ###
    
    test1: (t, w, x) => 
        # fm3
        
    test2: (t, w, x) => 
        
        wt = w*t
        wm = Math.tan(0.025 * wt) + 2.0 * Math.sin(wt) + 0.3*Math.random()
        y0 = Math.sin(wm * t)

        a0 = -0.93 * t
        b1 = 1.0 - a0
        y = b1 * y0

        exp2y = Math.exp(2.0 * y)
        y = (exp2y - 1.0) / (exp2y + 1.0)
        d = 0.95; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y
        
    ###
    00000000   000   0000000   000   000   0000000 
    000   000  000  000   000  0000  000  000   000
    00000000   000  000000000  000 0 000  000   000
    000        000  000   000  000  0000  000   000
    000        000  000   000  000   000   0000000 
    ###

    piano1: (t, w, x) => 
        
        wt = w*t
        y  = 0.6 * Math.sin(1.0*wt) * Math.exp(-0.0008*wt)
        y += 0.3 * Math.sin(2.0*wt) * Math.exp(-0.0010*wt)
        y += 0.1 * Math.sin(4.0*wt) * Math.exp(-0.0015*wt)
        y += 0.2*y*y*y
        y *= 0.9 + 0.1*Math.cos(70.0*t)
        y  = 2.0*y*Math.exp(-22.0*t) + y
        d = 0.8; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y
        
    piano2: (t, w, x) =>

        t    = t + .00015*@noise(12*t)
        rt   = t
        r    = t*w*.2
        r    = @fmod(r,1)
        a    = 0.15 + 0.6*(rt)
        b    = 0.65 - 0.5*(rt)
        y    = 50*r*(r-1)*(r-.2)*(r-a)*(r-b)
        r    = t*w*.401
        r    = @fmod(r,1)
        a    = 0.12 + 0.65*(rt)
        b    = 0.67 - 0.55*(rt)
        y2   = 50*r*(r-1)*(r-.4)*(r-a)*(r-b)
        r    = t*w*.399
        r    = @fmod(r,1)
        a    = 0.14 + 0.55*(rt)
        b    = 0.66 - 0.65*(rt)
        y3   = 50*r*(r-1)*(r-.8)*(r-a)*(r-b)
        y   += .02*@noise(1000*t)
        y   /= (t*w*.0015+.1)
        y2  /= (t*w*.0020+.1)
        y3  /= (t*w*.0025+.1)
        y    = (y+y2+y3)/3
        d = 0.8; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y

    piano3: (t, w, x) =>
        
        tt = 1-t
        a  = Math.sin(t*w*.5)*Math.log(t+0.3)*tt
        b  = Math.sin(t*w)*t*.4
        y  = (a+b)*tt
        d = 0.8; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y
        
    piano4: (t, w, x) =>
        
        y  = Math.sin(w*t)
        y *= 1-x*x*x*x

    piano5: (t, w, x) =>
        
        wt = w*t
        y  = 0.6*Math.sin(1.0*wt)*Math.exp(-0.0008*wt)
        y += 0.3*Math.sin(2.0*wt)*Math.exp(-0.0010*wt)
        y += 0.1*Math.sin(4.0*wt)*Math.exp(-0.0015*wt)
        y += 0.2*y*y*y
        y *= 0.5 + 0.5*Math.cos(70.0*t) # vibrato
        y  = 2.0*y*Math.exp(-22.0*t) + y
        y *= 1-x*x*x*x

    ###
     0000000   00000000    0000000    0000000   000   000
    000   000  000   000  000        000   000  0000  000
    000   000  0000000    000  0000  000000000  000 0 000
    000   000  000   000  000   000  000   000  000  0000
     0000000   000   000   0000000   000   000  000   000
    ###
    
    organ1: (t, w, x) =>

        y  = .6 * Math.cos(w*t)   * Math.exp(-4*t)
        y += .4 * Math.cos(2*w*t) * Math.exp(-3*t)
        y += .01* Math.cos(4*w*t) * Math.exp(-1*t)
        y = y*y*y + y*y*y*y*y + y*y
        a = .5+.5*Math.cos(3.14*x)
        y = Math.sin(y*a*3.14)
        y *= 20*t*Math.exp(-.1*x)

    organ2: (t, w, x) =>

        f = @fmod(t,6.2831/w)*w/6.2831
        a = .7+.3*Math.cos(6.2831*t)
        y = -1.0+2*@saw(f,a)
        y = y*y*y
        y = 15*y*x*Math.exp(-4*x)
        y *= 1-x*x*x*x

    organ3: (t, w, x) =>

        wt = w*t
        a1 = .5+.5*Math.cos(0+t*12)
        a2 = .5+.5*Math.cos(1+t*8)
        a3 = .5+.5*Math.cos(2+t*4)
        y  = @saw(0.2500*wt,a1)*Math.exp(-2*x)
        y += @saw(0.1250*wt,a2)*Math.exp(-3*x)
        y += @saw(0.0625*wt,a3)*Math.exp(-4*x)
        y *= 0.8+0.2*Math.cos(64*t)

    organ4: (t, w, x) =>

        ws = 0.1*w*t
        f  = 0.001*(Math.cos(5*t))
        y  = 1.0*(@saw((1.00+f)*ws,1)-0.5)
        y += 0.7*(@saw((2.01+f)*ws,1)-0.5)
        y += 0.5*(@saw((4.02+f)*ws,1)-0.5)
        y += 0.2*(@saw((8.02+f)*ws,1)-0.5)
        y *= 20*x*Math.exp(-5.15*x)
        y *= 0.9+0.1*Math.cos(40*t)
        
    ###
    0000000    00000000  000      000    
    000   000  000       000      000    
    0000000    0000000   000      000    
    000   000  000       000      000    
    0000000    00000000  0000000  0000000
    ###
        
    bell1: (t, w, x) =>
        
        wt = w*t
        y  = 0.100 * Math.exp(-t/1.000) * Math.sin(0.56*wt)
        y += 0.067 * Math.exp(-t/0.900) * Math.sin(0.56*wt)
        y += 0.100 * Math.exp(-t/0.650) * Math.sin(0.92*wt)
        y += 0.180 * Math.exp(-t/0.550) * Math.sin(0.92*wt)
        y += 0.267 * Math.exp(-t/0.325) * Math.sin(1.19*wt)
        y += 0.167 * Math.exp(-t/0.350) * Math.sin(1.70*wt)
        y += 0.146 * Math.exp(-t/0.250) * Math.sin(2.00*wt)
        y += 0.133 * Math.exp(-t/0.200) * Math.sin(2.74*wt)
        y += 0.133 * Math.exp(-t/0.150) * Math.sin(3.00*wt)
        y += 0.100 * Math.exp(-t/0.100) * Math.sin(3.76*wt)
        y += 0.133 * Math.exp(-t/0.075) * Math.sin(4.07*wt)
        y *= 1-x*x*x*x

    bell2: (t, w, x) =>

        wt = w*t
        y  = 0.100 * Math.exp(-t/1.000) * Math.sin(0.56*wt)
        y += 0.067 * Math.exp(-t/0.900) * Math.sin(0.56*wt)
        y += 0.100 * Math.exp(-t/0.650) * Math.sin(0.92*wt)
        y += 0.180 * Math.exp(-t/0.550) * Math.sin(0.92*wt)
        y += 0.267 * Math.exp(-t/0.325) * Math.sin(1.19*wt)
        y += 0.167 * Math.exp(-t/0.350) * Math.sin(1.70*wt)
        y += 2.0*y*Math.exp(-22.0*t) # attack
        y *= 1-x*x*x*x


    bell3: (t, w, x) =>
        wt = w*t
        y  = 0
        y += 0.100 * Math.exp(-t/1)    * Math.sin(0.25*wt)
        y += 0.200 * Math.exp(-t/0.75) * Math.sin(0.50*wt)
        y += 0.400 * Math.exp(-t/0.5)  * Math.sin(1.00*wt)
        y += 0.200 * Math.exp(-t/0.25) * Math.sin(2.00*wt)
        y += 0.100 * Math.exp(-t/0.1)  * Math.sin(4.00*wt)
        y += 2.0*y*Math.exp(-22.0*t) # attack
        y *= 1-x*x*x*x

    bell4: (t, w, x) =>
        wt = w*t
        y  = 0
        y += 0.100 * Math.exp(-t/0.9) * Math.sin(0.62*wt)
        y += 0.200 * Math.exp(-t/0.7) * Math.sin(0.86*wt)
        y += 0.500 * Math.exp(-t/0.5) * Math.sin(1.00*wt)
        y += 0.200 * Math.exp(-t/0.2) * Math.sin(1.27*wt)
        y += 0.100 * Math.exp(-t/0.1) * Math.sin(1.40*wt)
        y += 2.0*y*Math.exp(-22.0*t) # attack
        y *= 1-x*x*x*x

    ###
     0000000  000000000  00000000   000  000   000   0000000 
    000          000     000   000  000  0000  000  000      
    0000000      000     0000000    000  000 0 000  000  0000
         000     000     000   000  000  000  0000  000   000
    0000000      000     000   000  000  000   000   0000000 
    ###

    string1: (t, w, x) =>

        wt = w*t
        f  =     Math.cos(0.251*wt)*Math.PI
        y  = 0.5*Math.sin(1*wt+f)*Math.exp(-0.0007*wt)
        y += 0.2*Math.sin(2*wt+f)*Math.exp(-0.0009*wt)
        y += 0.2*Math.sin(4*wt+f)*Math.exp(-0.0016*wt)
        y += 0.1*Math.sin(8*wt+f)*Math.exp(-0.0020*wt)
        y *= 0.9 + 0.1*Math.cos(70.0*t) # vibrato
        y  = 2.0*y*Math.exp(-22.0*t) + y # attack

        if x > 0.8 # fade out
            f = 1-(x-0.8)/0.2
            y *= f*f
        y

    string2: (t, w, x) =>
        
        wt = w*t
        f  =     Math.sin(0.251*wt)*Math.PI
        y  = 0.5*Math.sin(1*wt+f)*Math.exp(-1.0*x)
        y += 0.4*Math.sin(2*wt+f)*Math.exp(-2.0*x)
        y += 0.3*Math.sin(4*wt+f)*Math.exp(-3.0*x)
        y += 0.2*Math.sin(8*wt+f)*Math.exp(-4.0*x)
        y += 1.0*y*Math.exp(-10.0*t) # attack
        y *= 1 - x*x*x*x # fade out
        y

    ###
    00000000  000      000   000  000000000  00000000
    000       000      000   000     000     000     
    000000    000      000   000     000     0000000 
    000       000      000   000     000     000     
    000       0000000   0000000      000     00000000
    ###

    flute: (t, w, x) =>

        y  = 6.0*x*Math.exp(-2*x)*Math.sin(w*t)
        y *= 0.6+0.4*Math.sin(32*(1-x))
        
        d = 0.87; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y

    ###
    0000000    00000000   000   000  00     00
    000   000  000   000  000   000  000   000
    000   000  0000000    000   000  000000000
    000   000  000   000  000   000  000 0 000
    0000000    000   000   0000000   000   000
    ###
    
    drum1: (t, w) =>

        y = Math.max(-1.0,Math.min(1.0,8.0*Math.sin(3000*t*Math.exp(-6*t))))

    drum2: (t, w) => 

        y  = 0.5*@noise(32000*t)*Math.exp(-32*t)
        y += 2.0*@noise(3200*t)*Math.exp(-32*t)
        y += 3.0*Math.cos(400*(1-t)*t)*Math.exp(-4*t)

    drum3: (t, w) =>

        f = 1000-2500*t
        y = Math.sin(f*t)
        y += .2*Math.random()
        y *= Math.exp(-12*t)
        y *= 8

    ###
    00000000  00     00
    000       000   000
    000000    000000000
    000       000 0 000
    000       000   000
    ###

    fm1: (t, w, x) =>

        wt = w*t
        y0 = Math.sin(12 * Math.sin(0.5 * wt) + Math.sin(8 * Math.sin(0.15 * wt)))
        y1 = (y0 * y0 - 1.05) * Math.sin(0.005 * wt)
        y2 = 0.5 * Math.random() * Math.log(8.0*t)

        y = 0.3333 * (y0 + y1 + y2)
        y *= 3.0 * Math.exp(-1.0 * t) * Math.exp(-2.0 * x)

        exp2y = Math.exp(2.0*y)
        fi = if x < 0.01 then x*100 else 1
        y = fi * (exp2y - 1.0) / (exp2y + 1.0)

    fm2: (t, w, x) =>

        wt = w*t
        a = Math.sin(Math.sin(0.2 * wt) - Math.tan(0.5 * wt))
        b = Math.sin(Math.sin(0.2 * wt) + Math.sin(2.0 * wt))
        c = Math.sin(Math.sin(0.4 * wt) - Math.sin(2.0 * wt))
        d = 1.2 * Math.random()
        
        y = 0.25 * (a + b + c + d)
        y = (0.25 + Math.sin(0.005 * wt)) * Math.sin(y * x)
        y *= Math.exp(-4.0 * x) * Math.exp(-1.5 * x) * 40.0
        
        exp2y = Math.exp(2.0 * y)
        y = (exp2y - 1.0) / (exp2y + 1.0)
        d = 0.95; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y

    fm3: (t, w, x) =>

        wt = w*t
        wm = Math.tan(0.025 * wt) + 2.0 * Math.sin(wt) + 0.25*Math.random()
        y0 = Math.sin(wm * t)

        a0 = -0.93 * t
        b1 = 1.0 - a0
        y = b1 * y0

        exp2y = Math.exp(2.0 * y)
        y = (exp2y - 1.0) / (exp2y + 1.0)
        y *= 1-x*x*x*x*x*x
