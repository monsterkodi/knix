###

0000000    000   000  00000000  00000000  00000000  00000000    0000000
000   000  000   000  000       000       000       000   000  000     
0000000    000   000  000000    000000    0000000   0000000    0000000 
000   000  000   000  000       000       000       000   000       000
0000000     0000000   000       000       00000000  000   000  0000000 

###

class Buffers

    constructor: (cfg, defs) -> @init cfg, defs

    init: (cfg, defs) =>
        
        @config = _.def cfg, defs
        
        @config = _.def @config,
            sampleRate : 44100
            duration   : 1
            
        @samples = new Array Keyboard.numNotes()
        
        @initBuffers()
        @
    
    initBuffers: =>
        
        @sampleLength = @config.duration*@config.sampleRate
        @isr          = 1.0/@config.sampleRate
        
        @sampleLength = Math.floor @sampleLength
        log @sampleLength
        @createBuffers()
        
    createBuffers: =>
        numNotes = Keyboard.numNotes()
        for i in [0...numNotes]
            @samples[i] = new Float32Array @sampleLength
        @
        
    sampleForNoteIndex: (noteIndex) => @samples[noteIndex]

    createAudioBufferForNoteIndex: (noteIndex) =>
        audioBuffer = Audio.context.createBuffer 1, @sampleLength, @config.sampleRate
        buffer = audioBuffer.getChannelData 0
        sample = @sampleForNoteIndex noteIndex
        for i in [0...@sampleLength]
            buffer[i] = sample[i]
        audioBuffer
    
    setDuration: (v) =>
        if @config.duration != _.value(v)
            @config.duration = _.value(v)
            @initBuffers()
        
    fmod:  (x,y)   => x%y
    sign:  (x)     => (x>0.0) and 1.0 or -1.0
    frac:  (x)     => x % 1.0
    sqr:   (a,x)   => if Math.sin(x)>a then 1.0 else -1.0    
    step:  (a,x)   => (x>=a) and 1.0 or 0.0
    over:  (x,y)   => 1.0 - (1.0-x)*(1.0-y)
    clamp: (x,a,b) => if x<a then return a; if x>b then return b; x
    mix:   (a,b,x) => a + (b-a) * Math.min(Math.max(x,0.0),1.0)

    smoothstep: (a,b,x) =>
        if x < a then return 0.0
        if x > b then return 1.0
        y = (x-a) / (b-a)
        y*y*(3.0-2.0*y)

    tri: (a,x) =>
        x = x / (2.0*Math.PI)
        x = x % 1.0
        if x < 0.0 then x = 1.0 + x
        if x < a   then x /= a else x = 1.0-(x-a)/(1.0-a)
        2.0*x-1.0

    saw: (x,a) =>
        f = x % 1.0
        if (f < a) then (f / a) else (1.0 - (f-a)/(1.0-a))

    grad: (n, x) =>
        n = (n << 13) ^ n
        n = (n * (n * n * 15731 + 789221) + 1376312589)
        if (n & 0x20000000) then -x else x

    noise: (x) =>
        i = Math.floor x
        f = x - i
        w = f*f*f*(f*(f*6.0-15.0)+10.0)
        a = @grad i+0, f+0.0
        b = @grad i+1, f-1.0
        a + (b-a)*w
    
    cellnoise: (x) =>
        n = Math.floor(x)
        n = (n << 13) ^ n
        n = (n * (n * n * 15731 + 789221) + 1376312589)
        n = (n>>14) & 65535
        return n/65535.0
