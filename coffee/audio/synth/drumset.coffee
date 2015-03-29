###

0000000    00000000   000   000  00     00   0000000  00000000  000000000
000   000  000   000  000   000  000   000  000       000          000   
000   000  0000000    000   000  000000000  0000000   0000000      000   
000   000  000   000  000   000  000 0 000       000  000          000   
0000000    000   000   0000000   000   000  0000000   00000000     000   
 
###

class DrumSet extends Instruments 

    @drums = 
        C: 
            drumName: "kick1"
            duration: 1.0
        Cs:  
            drumName: "kick2"
            duration: 1.1
        D:  
            drumName: "kick3"
            duration: 1.1
        Ds:  
            drumName: "kick4"
            duration: 1.1
        E:  
            drumName: "tom1"
            duration: 0.5
        F:
            drumName: "tom2"
            duration: 1.0
        Fs:  
            drumName: "perc1"
            duration: 1.1
        G:
            drumName: "snare1"
            duration: 0.03
        Gs: 
            drumName: "weird1"
            duration: 1.1
        A: 
            drumName: "hihat1"
            duration: 0.3
        As:  
            drumName: "hihat2"
            duration: 0.3
        B:
            drumName: "hihat3"
            duration: 0.4

    initDrumAtIndex: (drumIndex) =>
        drum = DrumSet.drums[Keyboard.noteNames[drumIndex]]
        func = @[drum.drumName]
        sampleLength = Math.floor drum.duration * @config.sampleRate
        log drumIndex, sampleLength, @config.sampleRate
        @samples[drumIndex] = new Float32Array sampleLength
        for sampleIndex in [0...sampleLength]
            x = sampleIndex/(sampleLength-1)
            @samples[drumIndex][sampleIndex] = func sampleIndex*@isr, sampleLength, x

    initBuffers: => @createBuffers()
    createBuffers: => @samples = new Array DrumSet.names.length
    drumIndexForNoteName: (noteName) => Keyboard.noteIndex(noteName)%12
    sampleForNoteIndex: (noteIndex) => @sampleForNoteName Keyboard.allNoteNames()[noteIndex]
    sampleForNoteName: (noteName) =>
        drumIndex = @drumIndexForNoteName noteName
        if not @samples[drumIndex]?
            @initDrumAtIndex drumIndex
        @samples[drumIndex]
                    
    ###
    0000000    00000000   000   000  00     00
    000   000  000   000  000   000  000   000
    000   000  0000000    000   000  000000000
    000   000  000   000  000   000  000 0 000
    0000000    000   000   0000000   000   000
    ###
    

    kick1: (t, l, x) => 

        y  = 0.5*@noise(32000*t)*Math.exp(-32*t)
        y += 2.0*@noise(3200*t)*Math.exp(-32*t)
        y += 3.0*Math.sin(400*(1-t)*t)*Math.exp(-4*t)
        y *= 2

    kick2: (t, l, x) => 

        y  = 0.5*@noise(3200*t)*Math.exp(-16*t)
        y += 2.0*@noise(320*t)*Math.exp(-16*t)
        y += 3.0*Math.sin(400*(1-t)*t)*Math.exp(-4*t)
        y *= 2

    kick3: (t, l, x) => 

        y  = 0.5*@cellnoise(32000*t)*Math.exp(-32*t)
        y += 2.0*@cellnoise(3200*t)*Math.exp(-16*t)
        y += 3.0*Math.sin(400*(1-t)*t)*Math.exp(-4*t)
        y *= 1.3

    kick4: (t, l, x) => 
        y  = 3.0*Math.sin(400*(1-t)*t)*Math.exp(-4*t)
        y += 0.5*@saw(0,400*t)*Math.exp(-8*t)
        y += 1.0*@sqr(0,200*t)*Math.exp(-16*t)
        y += 2.0*@sqr(0,100*t)*Math.exp(-6*t)

    tom1: (t, l, x) =>

        f  = 1000-2500*t
        y  = Math.sin(f*t)
        y *= Math.exp(-12*t)
        y *= 3

    tom2: (t, l, x) =>
        
        y = _.clamp -1.0, 1.0, 2.0*Math.sin(2000*t*Math.exp(-6*t))*Math.exp(-6*t)
        d = 0.95; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y

    snare1: (t, l, x) =>

        f = 1000-2500*t
        y = Math.sin(f*t)
        y += 0.2*Math.random()
        y *= 4*@cellnoise(32000*t)*Math.exp(-6*t)

    weird1: (t, l, x) =>
        
        y = Math.max(-1.0,Math.min(1.0,8.0*Math.sin(3000*t*Math.exp(-6*t))))
        d = 0.95; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y

    perc1: (t, l, x) => 
        y  = 0.5*Math.sin(8000*t)*Math.exp(-16*t)
        y += 0.5*Math.sin(3200*t)*Math.exp(-16*t)
        y += 3.0*Math.sin(400*(1-t)*t)*Math.exp(-4*t)
        y *= 2        

    hihat1: (t, l, x) =>

        f = 1000-2500*t
        y = Math.sin(f*t)
        y += 0.2*Math.random()
        y *= 10*@noise(32000*t)*Math.exp(-6*t)
        d = 0.95; if x > d then y *= Math.pow(1-(x-d)/(1-d), 2) # decay
        y

    hihat2: (t, l, x) =>

        f = 2000-1500*t
        y = Math.sin(f*t)
        y += 0.1*Math.random()
        y *= 4*@noise(16000*t)*Math.exp(-2*t)
        y *= 1-(x*x*x*x*x)

    hihat3: (t, l, x) =>

        f = 2000-1500*t
        y = @sqr(f*t)
        y *= 4*@noise(16000*t)*Math.exp(-2*t)
        y *= 1-(x*x*x*x*x)
