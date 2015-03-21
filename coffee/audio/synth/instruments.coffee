###

000  000   000   0000000  000000000  00000000   000   000  00     00  00000000  000   000  000000000   0000000
000  0000  000  000          000     000   000  000   000  000   000  000       0000  000     000     000     
000  000 0 000  0000000      000     0000000    000   000  000000000  0000000   000 0 000     000     0000000 
000  000  0000       000     000     000   000  000   000  000 0 000  000       000  0000     000          000
000  000   000  0000000      000     000   000   0000000   000   000  00000000  000   000     000     0000000 

###

class Instruments extends Buffers

    @names = ["piano1", "piano2", "piano3", "bell", "guitar", "flute", "drum1", "drum2", "drum3", "organ1", "organ2", "organ3", "organ4", "fm1", "fm2", "fm3"]

    constructor: (cfg, defs) -> @init cfg, defs

    init: (cfg, defs) =>
        super cfg, defs
        @

    setInstrument: (v) =>
        if @instrument != _.value(v)
            @instrument = _.value(v)
            func = @[@instrument]
            for s in [0...@samples.length]
                n = Keyboard.allNoteNames()[s]
                f = Keyboard.allNotes()[n]
                w = 2.0 * Math.PI * f
                for i in [0...@sampleLength]
                    @samples[s][i] = func i*@isr, w

    ###
    00000000   000   0000000   000   000   0000000 
    000   000  000  000   000  0000  000  000   000
    00000000   000  000000000  000 0 000  000   000
    000        000  000   000  000  0000  000   000
    000        000  000   000  000   000   0000000 
    ###

    piano1: (t, w) => 
        
        y  = 0.6*Math.sin(1.0*w*t)*Math.exp(-0.0008*w*t)
        y += 0.3*Math.sin(2.0*w*t)*Math.exp(-0.0010*w*t)
        y += 0.1*Math.sin(4.0*w*t)*Math.exp(-0.0015*w*t)
        y += 0.2*y*y*y
        y *= 0.9 + 0.1*Math.cos(70.0*t)
        y  = 2.0*y*Math.exp(-22.0*t) + y

    piano2: (t, w) =>

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

    piano3: (t, w) =>
        
        tt = 1-t
        a  = Math.sin(t*w*.5)*Math.log(t+0.3)*tt
        b  = Math.sin(t*w)*t*.4
        c  = @fmod(tt,.075)*Math.cos(Math.pow(tt,3)*w)*t*2
        y  = (a+b+c)*tt

    ###
     0000000   00000000    0000000    0000000   000   000
    000   000  000   000  000        000   000  0000  000
    000   000  0000000    000  0000  000000000  000 0 000
    000   000  000   000  000   000  000   000  000  0000
     0000000   000   000   0000000   000   000  000   000
    ###
    
    organ1: (t, w) =>

        y  = .6 * Math.cos(w*t)   * Math.exp(-4*t)
        y += .4 * Math.cos(2*w*t) * Math.exp(-3*t)
        y += .01* Math.cos(4*w*t) * Math.exp(-1*t)
        y = y*y*y + y*y*y*y*y + y*y
        a = .5+.5*Math.cos(8*t); y = Math.sin(y*a*3.14)
        y *= 30*t*Math.exp(-.1*t)

    organ2: (t, w) =>

        f = @fmod(t,6.2831/w)*w/6.2831
        a = .7+.3*Math.cos(6.2831*t)
        y = -1.0+2*@saw(f,a)
        y = y*y*y
        y = 15*y*t*Math.exp(-5*t)

    organ3: (t, w) =>

        a1 = .5+.5*Math.cos(0+t*12)
        a2 = .5+.5*Math.cos(1+t*8)
        a3 = .5+.5*Math.cos(2+t*4)
        y  = @saw(.2500*w*t,a1)*Math.exp(-2*t)
        y += @saw(.1250*w*t,a2)*Math.exp(-3*t)
        y += @saw(.0625*w*t,a3)*Math.exp(-4*t)

        y *= .8+.2*Math.cos(64*t)

    organ4: (t, w) =>

        f  = 0.001*(Math.cos(5*t))
        y  = 1.0*(@saw((1.00+f)*0.1*w*t,1)-0.5)
        y += 0.7*(@saw((2.01+f)*0.1*w*t,1)-0.5)
        y += 0.5*(@saw((4.02+f)*0.1*w*t,1)-0.5)
        y += 0.2*(@saw((8.02+f)*0.1*w*t,1)-0.5)
        y *= 20*t*Math.exp(-4*t)
        y *= 0.9+0.1*Math.cos(40*t)
        
    ###
    0000000    00000000  000      000    
    000   000  000       000      000    
    0000000    0000000   000      000    
    000   000  000       000      000    
    0000000    00000000  0000000  0000000
    ###
        
    bell: (t, w) =>

        y  = 0.100*Math.exp( -t/1.000 )*Math.sin( 0.56*w*t )
        y += 0.067*Math.exp( -t/0.900 )*Math.sin( 0.56*w*t )
        y += 0.100*Math.exp( -t/0.650 )*Math.sin( 0.92*w*t )
        y += 0.180*Math.exp( -t/0.550 )*Math.sin( 0.92*w*t )
        y += 0.267*Math.exp( -t/0.325 )*Math.sin( 1.19*w*t )
        y += 0.167*Math.exp( -t/0.350 )*Math.sin( 1.70*w*t )
        y += 0.146*Math.exp( -t/0.250 )*Math.sin( 2.00*w*t )
        y += 0.133*Math.exp( -t/0.200 )*Math.sin( 2.74*w*t )
        y += 0.133*Math.exp( -t/0.150 )*Math.sin( 3.00*w*t )
        y += 0.100*Math.exp( -t/0.100 )*Math.sin( 3.76*w*t )
        y += 0.133*Math.exp( -t/0.075 )*Math.sin( 4.07*w*t )
        y

    ###
     0000000  000000000  00000000   000  000   000   0000000 
    000          000     000   000  000  0000  000  000      
    0000000      000     0000000    000  000 0 000  000  0000
         000     000     000   000  000  000  0000  000   000
    0000000      000     000   000  000  000   000   0000000 
    ###

    guitar: (t, w) =>

        f  =     Math.cos(0.251*w*t)
        y  = 0.5*Math.cos(1.0*w*t+3.14*f)*Math.exp(-0.0007*w*t)
        y += 0.2*Math.cos(2.0*w*t+3.14*f)*Math.exp(-0.0009*w*t)
        y += 0.2*Math.cos(4.0*w*t+3.14*f)*Math.exp(-0.0016*w*t)
        y += 0.1*Math.cos(8.0*w*t+3.14*f)*Math.exp(-0.0020*w*t)
        y *= 0.9 + 0.1*Math.cos(70.0*t)
        y  = 2.0*y*Math.exp(-22.0*t) + y

    ###
    00000000  000      000   000  000000000  00000000
    000       000      000   000     000     000     
    000000    000      000   000     000     0000000 
    000       000      000   000     000     000     
    000       0000000   0000000      000     00000000
    ###

    flute: (t, w) =>

        y  = 6.0*t*Math.exp( -2*t )*Math.sin( w*t )
        y *= .8+.2*Math.cos(16*t)

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

    fm1: (t, w) =>

        k0 = 0.5
        k1 = 0.15
        k2 = 1.05
        k3 = 0.005

        a0 = 12.0
        a1 = 8.0
        a2 = 0.1

        y0 = Math.sin(a0 * Math.sin(k0 * w * t) + Math.sin(a1 * Math.sin(k1 * w * t)))
        y1 = (y0 * y0 - k2) * Math.sin(k3 * w * t)
        y2 = 0.5 * Math.random() * Math.log(8.0 * t)

        y = 0.3333 * (y0 + y1 + y2)
        y *= 3.0 * Math.exp(-1.0 * t) * Math.exp(-2.0 * t)

        exp2y = Math.exp(2.0 * y)
        y = (exp2y - 1.0) / (exp2y + 1.0)

    fm2: (t, w) =>

        a = Math.sin(Math.sin(0.2 * w * t) - Math.tan(0.5 * w * t))
        b = Math.sin(Math.sin(0.2 * w * t) + Math.sin(2.0 * w * t))
        c = Math.sin(Math.sin(0.4 * w * t) - Math.sin(2.0 * w * t))
        d = 1.2 * Math.random()

        y = 0.25 * (a + b + c + d)
        y = (0.25 + Math.sin(0.005 * w * t)) * Math.sin( y * t)
        y *= Math.exp(-4.0 * t) * Math.exp(-1.5 * t) * 40.0

        exp2y = Math.exp(2.0 * y)
        y = (exp2y - 1.0) / (exp2y + 1.0)

    fm3: (t, w) =>

        wm = Math.tan(0.025 * w * t) + 2.0 * Math.sin(w * t) + Math.random()
        y0 = Math.sin(wm * t)

        a0 = -0.93 * t
        b1 = 1.0 - a0
        y = b1 * y0

        exp2y = Math.exp(2.0 * y)
        y = (exp2y - 1.0) / (exp2y + 1.0)
