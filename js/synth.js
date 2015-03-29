
/*

0000000    000   000  00000000  00000000  00000000  00000000    0000000
000   000  000   000  000       000       000       000   000  000     
0000000    000   000  000000    000000    0000000   0000000    0000000 
000   000  000   000  000       000       000       000   000       000
0000000     0000000   000       000       00000000  000   000  0000000
 */
var Buffers, DrumSet, Drums, Instruments, Synth,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Buffers = (function() {
  function Buffers(cfg, defs) {
    this.cellnoise = __bind(this.cellnoise, this);
    this.noise = __bind(this.noise, this);
    this.grad = __bind(this.grad, this);
    this.saw = __bind(this.saw, this);
    this.tri = __bind(this.tri, this);
    this.smoothstep = __bind(this.smoothstep, this);
    this.mix = __bind(this.mix, this);
    this.over = __bind(this.over, this);
    this.step = __bind(this.step, this);
    this.sqr = __bind(this.sqr, this);
    this.frac = __bind(this.frac, this);
    this.sign = __bind(this.sign, this);
    this.fmod = __bind(this.fmod, this);
    this.setDuration = __bind(this.setDuration, this);
    this.createAudioBufferForNoteIndex = __bind(this.createAudioBufferForNoteIndex, this);
    this.sampleForNoteIndex = __bind(this.sampleForNoteIndex, this);
    this.createBuffers = __bind(this.createBuffers, this);
    this.initBuffers = __bind(this.initBuffers, this);
    this.init = __bind(this.init, this);
    this.init(cfg, defs);
  }

  Buffers.prototype.init = function(cfg, defs) {
    this.config = _.def(cfg, defs);
    this.config = _.def(this.config, {
      sampleRate: 44100,
      duration: 1
    });
    this.isr = 1.0 / this.config.sampleRate;
    this.initBuffers();
    return this;
  };

  Buffers.prototype.initBuffers = function() {
    this.sampleLength = this.config.duration * this.config.sampleRate;
    this.sampleLength = Math.floor(this.sampleLength);
    log({
      "file": "./coffee/audio/synth/buffers.coffee",
      "class": "Buffers",
      "line": 31,
      "args": ["cfg", "defs"],
      "method": "initBuffers",
      "type": "."
    }, "<span class='console-type'>@sampleLength:</span>", this.sampleLength);
    return this.createBuffers();
  };

  Buffers.prototype.createBuffers = function() {
    var i, numNotes, _i;
    numNotes = Keyboard.numNotes();
    this.samples = new Array(numNotes);
    for (i = _i = 0; 0 <= numNotes ? _i < numNotes : _i > numNotes; i = 0 <= numNotes ? ++_i : --_i) {
      this.samples[i] = new Float32Array(this.sampleLength);
    }
    return this;
  };

  Buffers.prototype.sampleForNoteIndex = function(noteIndex) {
    return this.samples[noteIndex];
  };

  Buffers.prototype.createAudioBufferForNoteIndex = function(noteIndex) {
    var audioBuffer, buffer, i, sample, _i, _ref;
    sample = this.sampleForNoteIndex(noteIndex);
    audioBuffer = Audio.context.createBuffer(1, sample.length, this.config.sampleRate);
    buffer = audioBuffer.getChannelData(0);
    for (i = _i = 0, _ref = sample.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      buffer[i] = sample[i];
    }
    return audioBuffer;
  };

  Buffers.prototype.setDuration = function(v) {
    if (this.config.duration !== _.value(v)) {
      this.config.duration = _.value(v);
      return this.initBuffers();
    }
  };

  Buffers.prototype.fmod = function(x, y) {
    return x % y;
  };

  Buffers.prototype.sign = function(x) {
    return (x > 0.0) && 1.0 || -1.0;
  };

  Buffers.prototype.frac = function(x) {
    return x % 1.0;
  };

  Buffers.prototype.sqr = function(a, x) {
    if (Math.sin(x) > a) {
      return 1.0;
    } else {
      return -1.0;
    }
  };

  Buffers.prototype.step = function(a, x) {
    return (x >= a) && 1.0 || 0.0;
  };

  Buffers.prototype.over = function(x, y) {
    return 1.0 - (1.0 - x) * (1.0 - y);
  };

  Buffers.prototype.mix = function(a, b, x) {
    return a + (b - a) * Math.min(Math.max(x, 0.0), 1.0);
  };

  Buffers.prototype.smoothstep = function(a, b, x) {
    var y;
    if (x < a) {
      return 0.0;
    }
    if (x > b) {
      return 1.0;
    }
    y = (x - a) / (b - a);
    return y * y * (3.0 - 2.0 * y);
  };

  Buffers.prototype.tri = function(a, x) {
    x = x / (2.0 * Math.PI);
    x = x % 1.0;
    if (x < 0.0) {
      x = 1.0 + x;
    }
    if (x < a) {
      x /= a;
    } else {
      x = 1.0 - (x - a) / (1.0 - a);
    }
    return 2.0 * x - 1.0;
  };

  Buffers.prototype.saw = function(x, a) {
    var f;
    f = x % 1.0;
    if (f < a) {
      return f / a;
    } else {
      return 1.0 - (f - a) / (1.0 - a);
    }
  };

  Buffers.prototype.grad = function(n, x) {
    n = (n << 13) ^ n;
    n = n * (n * n * 15731 + 789221) + 1376312589;
    if (n & 0x20000000) {
      return -x;
    } else {
      return x;
    }
  };

  Buffers.prototype.noise = function(x) {
    var a, b, f, i, w;
    i = Math.floor(x);
    f = x - i;
    w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    a = this.grad(i + 0, f + 0.0);
    b = this.grad(i + 1, f - 1.0);
    return a + (b - a) * w;
  };

  Buffers.prototype.cellnoise = function(x) {
    var n;
    n = Math.floor(x);
    n = (n << 13) ^ n;
    n = n * (n * n * 15731 + 789221) + 1376312589;
    n = (n >> 14) & 65535;
    return n / 65535.0;
  };

  return Buffers;

})();


/*

000  000   000   0000000  000000000  00000000   000   000  00     00  00000000  000   000  000000000   0000000
000  0000  000  000          000     000   000  000   000  000   000  000       0000  000     000     000     
000  000 0 000  0000000      000     0000000    000   000  000000000  0000000   000 0 000     000     0000000 
000  000  0000       000     000     000   000  000   000  000 0 000  000       000  0000     000          000
000  000   000  0000000      000     000   000   0000000   000   000  00000000  000   000     000     0000000
 */

Instruments = (function(_super) {
  __extends(Instruments, _super);

  function Instruments() {
    this.fm3 = __bind(this.fm3, this);
    this.fm2 = __bind(this.fm2, this);
    this.fm1 = __bind(this.fm1, this);
    this.flute = __bind(this.flute, this);
    this.string2 = __bind(this.string2, this);
    this.string1 = __bind(this.string1, this);
    this.bell4 = __bind(this.bell4, this);
    this.bell3 = __bind(this.bell3, this);
    this.bell2 = __bind(this.bell2, this);
    this.bell1 = __bind(this.bell1, this);
    this.organ4 = __bind(this.organ4, this);
    this.organ3 = __bind(this.organ3, this);
    this.organ2 = __bind(this.organ2, this);
    this.organ1 = __bind(this.organ1, this);
    this.piano5 = __bind(this.piano5, this);
    this.piano4 = __bind(this.piano4, this);
    this.piano3 = __bind(this.piano3, this);
    this.piano2 = __bind(this.piano2, this);
    this.piano1 = __bind(this.piano1, this);
    this.test2 = __bind(this.test2, this);
    this.test1 = __bind(this.test1, this);
    this.createBuffers = __bind(this.createBuffers, this);
    this.sampleForNoteIndex = __bind(this.sampleForNoteIndex, this);
    this.initNoteAtIndex = __bind(this.initNoteAtIndex, this);
    this.initInstrument = __bind(this.initInstrument, this);
    this.setInstrument = __bind(this.setInstrument, this);
    return Instruments.__super__.constructor.apply(this, arguments);
  }

  Instruments.names = ["piano1", "piano2", "piano3", "piano4", "piano5", "string1", "string2", "flute", "bell1", "bell2", "bell3", "bell4", "organ1", "organ2", "organ3", "organ4", "fm1", "fm2", "fm3"];

  Instruments.prototype.setInstrument = function(v) {
    if (this.config.instrument !== _.value(v)) {
      this.config.instrument = _.value(v);
      return this.initInstrument();
    }
  };

  Instruments.prototype.initInstrument = function() {
    return this.createBuffers();
  };

  Instruments.prototype.initNoteAtIndex = function(noteIndex) {
    var frequency, func, noteName, sampleIndex, w, x, _i, _ref, _results;
    noteName = Keyboard.allNoteNames()[noteIndex];
    frequency = Keyboard.allNotes()[noteName];
    w = 2.0 * Math.PI * frequency;
    func = this[this.config.instrument];
    _results = [];
    for (sampleIndex = _i = 0, _ref = this.sampleLength; 0 <= _ref ? _i < _ref : _i > _ref; sampleIndex = 0 <= _ref ? ++_i : --_i) {
      x = sampleIndex / (this.sampleLength - 1);
      _results.push(this.samples[noteIndex][sampleIndex] = func(sampleIndex * this.isr, w, x));
    }
    return _results;
  };

  Instruments.prototype.sampleForNoteIndex = function(noteIndex) {
    if (this.samples[noteIndex] == null) {
      this.samples[noteIndex] = new Float32Array(this.sampleLength);
      this.initNoteAtIndex(noteIndex);
    }
    return this.samples[noteIndex];
  };

  Instruments.prototype.createBuffers = function() {
    return this.samples = new Array(Keyboard.numNotes());
  };


  /*
  000000000  00000000   0000000  000000000
     000     000       000          000   
     000     0000000   0000000      000   
     000     000            000     000   
     000     00000000  0000000      000
   */

  Instruments.prototype.test1 = function(t, w, x) {
    var a, b, wt, y;
    wt = w * t;
    a = Math.tan(0.01 * wt / Math.pow(Math.sin(wt), -x));
    b = this.frac(Math.log(x * wt));
    y = a * b;
    return _.clamp(-3, 3, y);
  };

  Instruments.prototype.test2 = function(t, w, x) {
    var a0, b1, exp2y, wm, wt, y, y0;
    wt = w * t;
    wm = Math.tan(0.25 * wt) + 2.0 * Math.sin(wt);
    y0 = Math.sin(wm * t);
    a0 = -0.93 * t;
    b1 = 1.0 - a0;
    y = b1 * y0;
    exp2y = Math.exp(2.0 * y);
    y = (exp2y - 1.0) / (exp2y + 1.0);
    _.clamp(-2, 2, y);
    return y *= 1 - x * x * x * x * x * x;
  };


  /*
  00000000   000   0000000   000   000   0000000 
  000   000  000  000   000  0000  000  000   000
  00000000   000  000000000  000 0 000  000   000
  000        000  000   000  000  0000  000   000
  000        000  000   000  000   000   0000000
   */

  Instruments.prototype.piano1 = function(t, w, x) {
    var d, wt, y;
    wt = w * t;
    y = 0.6 * Math.sin(1.0 * wt) * Math.exp(-0.0008 * wt);
    y += 0.3 * Math.sin(2.0 * wt) * Math.exp(-0.0010 * wt);
    y += 0.1 * Math.sin(4.0 * wt) * Math.exp(-0.0015 * wt);
    y += 0.2 * y * y * y;
    y *= 0.9 + 0.1 * Math.cos(70.0 * t);
    y = 2.0 * y * Math.exp(-22.0 * t) + y;
    d = 0.8;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  Instruments.prototype.piano2 = function(t, w, x) {
    var a, b, d, r, rt, y, y2, y3;
    t = t + .00015 * this.noise(12 * t);
    rt = t;
    r = t * w * .2;
    r = this.fmod(r, 1);
    a = 0.15 + 0.6 * rt;
    b = 0.65 - 0.5 * rt;
    y = 50 * r * (r - 1) * (r - .2) * (r - a) * (r - b);
    r = t * w * .401;
    r = this.fmod(r, 1);
    a = 0.12 + 0.65 * rt;
    b = 0.67 - 0.55 * rt;
    y2 = 50 * r * (r - 1) * (r - .4) * (r - a) * (r - b);
    r = t * w * .399;
    r = this.fmod(r, 1);
    a = 0.14 + 0.55 * rt;
    b = 0.66 - 0.65 * rt;
    y3 = 50 * r * (r - 1) * (r - .8) * (r - a) * (r - b);
    y += .02 * this.noise(1000 * t);
    y /= t * w * .0015 + .1;
    y2 /= t * w * .0020 + .1;
    y3 /= t * w * .0025 + .1;
    y = (y + y2 + y3) / 3;
    d = 0.8;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  Instruments.prototype.piano3 = function(t, w, x) {
    var a, b, d, tt, y;
    tt = 1 - t;
    a = Math.sin(t * w * .5) * Math.log(t + 0.3) * tt;
    b = Math.sin(t * w) * t * .4;
    y = (a + b) * tt;
    d = 0.8;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  Instruments.prototype.piano4 = function(t, w, x) {
    var y;
    y = Math.sin(w * t);
    return y *= 1 - x * x * x * x;
  };

  Instruments.prototype.piano5 = function(t, w, x) {
    var wt, y;
    wt = w * t;
    y = 0.6 * Math.sin(1.0 * wt) * Math.exp(-0.0008 * wt);
    y += 0.3 * Math.sin(2.0 * wt) * Math.exp(-0.0010 * wt);
    y += 0.1 * Math.sin(4.0 * wt) * Math.exp(-0.0015 * wt);
    y += 0.2 * y * y * y;
    y *= 0.5 + 0.5 * Math.cos(70.0 * t);
    y = 2.0 * y * Math.exp(-22.0 * t) + y;
    return y *= 1 - x * x * x * x;
  };


  /*
   0000000   00000000    0000000    0000000   000   000
  000   000  000   000  000        000   000  0000  000
  000   000  0000000    000  0000  000000000  000 0 000
  000   000  000   000  000   000  000   000  000  0000
   0000000   000   000   0000000   000   000  000   000
   */

  Instruments.prototype.organ1 = function(t, w, x) {
    var a, y;
    y = .6 * Math.cos(w * t) * Math.exp(-4 * t);
    y += .4 * Math.cos(2 * w * t) * Math.exp(-3 * t);
    y += .01 * Math.cos(4 * w * t) * Math.exp(-1 * t);
    y = y * y * y + y * y * y * y * y + y * y;
    a = .5 + .5 * Math.cos(3.14 * x);
    y = Math.sin(y * a * 3.14);
    return y *= 20 * t * Math.exp(-.1 * x);
  };

  Instruments.prototype.organ2 = function(t, w, x) {
    var a, f, y;
    f = this.fmod(t, 6.2831 / w) * w / 6.2831;
    a = .7 + .3 * Math.cos(6.2831 * t);
    y = -1.0 + 2 * this.saw(f, a);
    y = y * y * y;
    y = 15 * y * x * Math.exp(-4 * x);
    return y *= 1 - x * x * x * x;
  };

  Instruments.prototype.organ3 = function(t, w, x) {
    var a1, a2, a3, wt, y;
    wt = w * t;
    a1 = .5 + .5 * Math.cos(0 + t * 12);
    a2 = .5 + .5 * Math.cos(1 + t * 8);
    a3 = .5 + .5 * Math.cos(2 + t * 4);
    y = this.saw(0.2500 * wt, a1) * Math.exp(-2 * x);
    y += this.saw(0.1250 * wt, a2) * Math.exp(-3 * x);
    y += this.saw(0.0625 * wt, a3) * Math.exp(-4 * x);
    return y *= 0.8 + 0.2 * Math.cos(64 * t);
  };

  Instruments.prototype.organ4 = function(t, w, x) {
    var f, ws, y;
    ws = 0.1 * w * t;
    f = 0.001 * (Math.cos(5 * t));
    y = 1.0 * (this.saw((1.00 + f) * ws, 1) - 0.5);
    y += 0.7 * (this.saw((2.01 + f) * ws, 1) - 0.5);
    y += 0.5 * (this.saw((4.02 + f) * ws, 1) - 0.5);
    y += 0.2 * (this.saw((8.02 + f) * ws, 1) - 0.5);
    y *= 20 * x * Math.exp(-5.15 * x);
    return y *= 0.9 + 0.1 * Math.cos(40 * t);
  };


  /*
  0000000    00000000  000      000    
  000   000  000       000      000    
  0000000    0000000   000      000    
  000   000  000       000      000    
  0000000    00000000  0000000  0000000
   */

  Instruments.prototype.bell1 = function(t, w, x) {
    var wt, y;
    wt = w * t;
    y = 0.100 * Math.exp(-t / 1.000) * Math.sin(0.56 * wt);
    y += 0.067 * Math.exp(-t / 0.900) * Math.sin(0.56 * wt);
    y += 0.100 * Math.exp(-t / 0.650) * Math.sin(0.92 * wt);
    y += 0.180 * Math.exp(-t / 0.550) * Math.sin(0.92 * wt);
    y += 0.267 * Math.exp(-t / 0.325) * Math.sin(1.19 * wt);
    y += 0.167 * Math.exp(-t / 0.350) * Math.sin(1.70 * wt);
    y += 0.146 * Math.exp(-t / 0.250) * Math.sin(2.00 * wt);
    y += 0.133 * Math.exp(-t / 0.200) * Math.sin(2.74 * wt);
    y += 0.133 * Math.exp(-t / 0.150) * Math.sin(3.00 * wt);
    y += 0.100 * Math.exp(-t / 0.100) * Math.sin(3.76 * wt);
    y += 0.133 * Math.exp(-t / 0.075) * Math.sin(4.07 * wt);
    return y *= 1 - x * x * x * x;
  };

  Instruments.prototype.bell2 = function(t, w, x) {
    var wt, y;
    wt = w * t;
    y = 0.100 * Math.exp(-t / 1.000) * Math.sin(0.56 * wt);
    y += 0.067 * Math.exp(-t / 0.900) * Math.sin(0.56 * wt);
    y += 0.100 * Math.exp(-t / 0.650) * Math.sin(0.92 * wt);
    y += 0.180 * Math.exp(-t / 0.550) * Math.sin(0.92 * wt);
    y += 0.267 * Math.exp(-t / 0.325) * Math.sin(1.19 * wt);
    y += 0.167 * Math.exp(-t / 0.350) * Math.sin(1.70 * wt);
    y += 2.0 * y * Math.exp(-22.0 * t);
    return y *= 1 - x * x * x * x;
  };

  Instruments.prototype.bell3 = function(t, w, x) {
    var wt, y;
    wt = w * t;
    y = 0;
    y += 0.100 * Math.exp(-t / 1) * Math.sin(0.25 * wt);
    y += 0.200 * Math.exp(-t / 0.75) * Math.sin(0.50 * wt);
    y += 0.400 * Math.exp(-t / 0.5) * Math.sin(1.00 * wt);
    y += 0.200 * Math.exp(-t / 0.25) * Math.sin(2.00 * wt);
    y += 0.100 * Math.exp(-t / 0.1) * Math.sin(4.00 * wt);
    y += 2.0 * y * Math.exp(-22.0 * t);
    return y *= 1 - x * x * x * x;
  };

  Instruments.prototype.bell4 = function(t, w, x) {
    var wt, y;
    wt = w * t;
    y = 0;
    y += 0.100 * Math.exp(-t / 0.9) * Math.sin(0.62 * wt);
    y += 0.200 * Math.exp(-t / 0.7) * Math.sin(0.86 * wt);
    y += 0.500 * Math.exp(-t / 0.5) * Math.sin(1.00 * wt);
    y += 0.200 * Math.exp(-t / 0.2) * Math.sin(1.27 * wt);
    y += 0.100 * Math.exp(-t / 0.1) * Math.sin(1.40 * wt);
    y += 2.0 * y * Math.exp(-22.0 * t);
    return y *= 1 - x * x * x * x;
  };


  /*
   0000000  000000000  00000000   000  000   000   0000000 
  000          000     000   000  000  0000  000  000      
  0000000      000     0000000    000  000 0 000  000  0000
       000     000     000   000  000  000  0000  000   000
  0000000      000     000   000  000  000   000   0000000
   */

  Instruments.prototype.string1 = function(t, w, x) {
    var f, wt, y;
    wt = w * t;
    f = Math.cos(0.251 * wt) * Math.PI;
    y = 0.5 * Math.sin(1 * wt + f) * Math.exp(-0.0007 * wt);
    y += 0.2 * Math.sin(2 * wt + f) * Math.exp(-0.0009 * wt);
    y += 0.2 * Math.sin(4 * wt + f) * Math.exp(-0.0016 * wt);
    y += 0.1 * Math.sin(8 * wt + f) * Math.exp(-0.0020 * wt);
    y *= 0.9 + 0.1 * Math.cos(70.0 * t);
    y = 2.0 * y * Math.exp(-22.0 * t) + y;
    if (x > 0.8) {
      f = 1 - (x - 0.8) / 0.2;
      y *= f * f;
    }
    return y;
  };

  Instruments.prototype.string2 = function(t, w, x) {
    var f, wt, y;
    wt = w * t;
    f = Math.sin(0.251 * wt) * Math.PI;
    y = 0.5 * Math.sin(1 * wt + f) * Math.exp(-1.0 * x);
    y += 0.4 * Math.sin(2 * wt + f) * Math.exp(-2.0 * x);
    y += 0.3 * Math.sin(4 * wt + f) * Math.exp(-3.0 * x);
    y += 0.2 * Math.sin(8 * wt + f) * Math.exp(-4.0 * x);
    y += 1.0 * y * Math.exp(-10.0 * t);
    y *= 1 - x * x * x * x;
    return y;
  };


  /*
  00000000  000      000   000  000000000  00000000
  000       000      000   000     000     000     
  000000    000      000   000     000     0000000 
  000       000      000   000     000     000     
  000       0000000   0000000      000     00000000
   */

  Instruments.prototype.flute = function(t, w, x) {
    var d, y;
    y = 6.0 * x * Math.exp(-2 * x) * Math.sin(w * t);
    y *= 0.6 + 0.4 * Math.sin(32 * (1 - x));
    d = 0.87;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };


  /*
  00000000  00     00
  000       000   000
  000000    000000000
  000       000 0 000
  000       000   000
   */

  Instruments.prototype.fm1 = function(t, w, x) {
    var exp2y, fi, wt, y, y0, y1, y2;
    wt = w * t;
    y0 = Math.sin(12 * Math.sin(0.5 * wt) + Math.sin(8 * Math.sin(0.15 * wt)));
    y1 = (y0 * y0 - 1.05) * Math.sin(0.005 * wt);
    y2 = 0.5 * Math.random() * Math.log(8.0 * t);
    y = 0.3333 * (y0 + y1 + y2);
    y *= 3.0 * Math.exp(-1.0 * t) * Math.exp(-2.0 * x);
    exp2y = Math.exp(2.0 * y);
    fi = x < 0.01 ? x * 100 : 1;
    return y = fi * (exp2y - 1.0) / (exp2y + 1.0);
  };

  Instruments.prototype.fm2 = function(t, w, x) {
    var a, b, c, d, exp2y, wt, y;
    wt = w * t;
    a = Math.sin(Math.sin(0.2 * wt) - Math.tan(0.5 * wt));
    b = Math.sin(Math.sin(0.2 * wt) + Math.sin(2.0 * wt));
    c = Math.sin(Math.sin(0.4 * wt) - Math.sin(2.0 * wt));
    d = 1.2 * Math.random();
    y = 0.25 * (a + b + c + d);
    y = (0.25 + Math.sin(0.005 * wt)) * Math.sin(y * x);
    y *= Math.exp(-4.0 * x) * Math.exp(-1.5 * x) * 40.0;
    exp2y = Math.exp(2.0 * y);
    y = (exp2y - 1.0) / (exp2y + 1.0);
    d = 0.95;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  Instruments.prototype.fm3 = function(t, w, x) {
    var a0, b1, exp2y, wm, wt, y, y0;
    wt = w * t;
    wm = Math.tan(0.25 * wt) + 2.0 * Math.sin(wt) + 0.25 * Math.random();
    y0 = Math.sin(wm * t);
    a0 = -0.93 * t;
    b1 = 1.0 - a0;
    y = b1 * y0;
    exp2y = Math.exp(2.0 * y);
    y = (exp2y - 1.0) / (exp2y + 1.0);
    return y *= 1 - x * x * x * x * x * x;
  };

  return Instruments;

})(Buffers);


/*

0000000    00000000   000   000  00     00   0000000
000   000  000   000  000   000  000   000  000     
000   000  0000000    000   000  000000000  0000000 
000   000  000   000  000   000  000 0 000       000
0000000    000   000   0000000   000   000  0000000
 */

Drums = (function(_super) {
  __extends(Drums, _super);

  function Drums() {
    this.drawCurve = __bind(this.drawCurve, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.playNote = __bind(this.playNote, this);
    this.onTrigger = __bind(this.onTrigger, this);
    this.note = __bind(this.note, this);
    this.setGain = __bind(this.setGain, this);
    this.setNote = __bind(this.setNote, this);
    this.init = __bind(this.init, this);
    return Drums.__super__.constructor.apply(this, arguments);
  }

  Drums.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      type: 'Drums',
      noteName: 'C0',
      height: 330,
      duration: 0.4,
      minDuration: 0.01,
      maxDuration: 2.0,
      gain: 0.5
    });
    _ref = Audio.gain(cfg), this.gain = _ref[0], cfg = _ref[1];
    this.audio = this.gain;
    Drums.__super__.init.call(this, cfg, {
      title: 'drums',
      children: [
        {
          type: 'jacks',
          hasInput: false,
          content: {
            type: 'hbox',
            children: [
              {
                type: 'connector',
                slot: 'note'
              }, {
                type: 'spinner',
                "class": 'note',
                recKey: 'note',
                tooltip: 'note',
                value: cfg.noteName,
                values: Keyboard.allNoteNames(),
                style: {
                  width: '100%'
                }
              }
            ]
          }
        }, {
          type: 'canvas',
          "class": 'synth_canvas',
          style: {
            width: '100%',
            height: '100%',
            marginBottom: '6px'
          }
        }, {
          type: 'sliderspin',
          "class": 'gain',
          tooltip: 'gain',
          value: cfg.gain,
          minValue: 0.0,
          maxValue: 1.0
        }, {
          type: 'button',
          text: 'trigger',
          "class": 'trigger'
        }
      ]
    });
    this.drumset = new DrumSet();
    this.canvas = this.getChild('canvas');
    this.connect('trigger:trigger', this.onTrigger);
    this.connect('gain:onValue', this.setGain);
    this.connect('note:onValue', this.setNote);
    this.setGain(this.config.gain);
    return this;
  };

  Drums.prototype.setNote = function(v) {
    this.config.noteName = _.value(v);
    return this.drawCurve();
  };

  Drums.prototype.setGain = function(v) {
    this.config.gain = _.value(v);
    return this.gain.gain.value = this.config.gain;
  };

  Drums.prototype.note = function(event) {
    if (event.detail.event === 'trigger') {
      return this.playNote(event.detail);
    }
  };

  Drums.prototype.onTrigger = function(event) {
    return this.playNote({
      event: 'trigger',
      noteName: this.getChild('note').config.value
    });
  };

  Drums.prototype.playNote = function(note) {
    var audioBuffer, node;
    audioBuffer = this.drumset.createAudioBufferForNoteIndex(Keyboard.noteIndex(note.noteName));
    node = Audio.context.createBufferSource();
    node.buffer = audioBuffer;
    node.connect(this.gain);
    node.state = node.noteOn;
    return node.start(0);
  };

  Drums.prototype.sizeWindow = function() {
    var content, height, width, _ref;
    Drums.__super__.sizeWindow.apply(this, arguments);
    content = this.getChild('content');
    content.setHeight(this.contentHeight());
    height = content.innerHeight() - 120;
    width = content.innerWidth() - 20;
    if ((_ref = this.canvas) != null) {
      _ref.resize(width, height);
    }
    return this.drawCurve();
  };

  Drums.prototype.drawCurve = function() {
    var ctx, cvh, cvs, cvw, hh, i, sample, v, x, xd, y, _i, _ref;
    cvs = this.canvas.elem;
    ctx = cvs.getContext("2d");
    cvw = cvs.getWidth();
    cvh = cvs.getHeight();
    ctx.lineWidth = 1;
    ctx.fillStyle = StyleSwitch.colors.synth_canvas;
    ctx.fillRect(0, 0, cvw, cvh);
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(0, 0, cvw, cvh);
    ctx.beginPath();
    ctx.strokeStyle = StyleSwitch.colors.analyser_trigger;
    hh = cvh * 0.5;
    ctx.moveTo(0, hh);
    ctx.lineTo(cvw, hh);
    ctx.stroke();
    ctx.strokeStyle = StyleSwitch.colors.synth_trace;
    ctx.beginPath();
    sample = this.drumset.sampleForNoteName(this.config.noteName);
    xd = cvw / sample.length;
    x = 0;
    for (i = _i = 0, _ref = sample.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      v = sample[i] * 0.1;
      y = (0.5 + v) * cvh;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += xd;
    }
    return ctx.stroke();
  };

  Drums.menu = function() {
    return Drums.menuButton({
      text: 'Drums',
      icon: 'fa-database',
      action: function() {
        return new Drums({
          center: true
        });
      }
    });
  };

  return Drums;

})(AudioWindow);


/*

0000000    00000000   000   000  00     00   0000000  00000000  000000000
000   000  000   000  000   000  000   000  000       000          000   
000   000  0000000    000   000  000000000  0000000   0000000      000   
000   000  000   000  000   000  000 0 000       000  000          000   
0000000    000   000   0000000   000   000  0000000   00000000     000
 */

DrumSet = (function(_super) {
  __extends(DrumSet, _super);

  function DrumSet() {
    this.hihat3 = __bind(this.hihat3, this);
    this.hihat2 = __bind(this.hihat2, this);
    this.hihat1 = __bind(this.hihat1, this);
    this.perc1 = __bind(this.perc1, this);
    this.weird1 = __bind(this.weird1, this);
    this.snare1 = __bind(this.snare1, this);
    this.tom2 = __bind(this.tom2, this);
    this.tom1 = __bind(this.tom1, this);
    this.kick4 = __bind(this.kick4, this);
    this.kick3 = __bind(this.kick3, this);
    this.kick2 = __bind(this.kick2, this);
    this.kick1 = __bind(this.kick1, this);
    this.sampleForNoteName = __bind(this.sampleForNoteName, this);
    this.sampleForNoteIndex = __bind(this.sampleForNoteIndex, this);
    this.drumIndexForNoteName = __bind(this.drumIndexForNoteName, this);
    this.createBuffers = __bind(this.createBuffers, this);
    this.initBuffers = __bind(this.initBuffers, this);
    this.initDrumAtIndex = __bind(this.initDrumAtIndex, this);
    return DrumSet.__super__.constructor.apply(this, arguments);
  }

  DrumSet.drums = {
    C: {
      drumName: "kick1",
      duration: 1.0
    },
    Cs: {
      drumName: "kick2",
      duration: 1.1
    },
    D: {
      drumName: "kick3",
      duration: 1.1
    },
    Ds: {
      drumName: "kick4",
      duration: 1.1
    },
    E: {
      drumName: "tom1",
      duration: 0.5
    },
    F: {
      drumName: "tom2",
      duration: 1.0
    },
    Fs: {
      drumName: "perc1",
      duration: 1.1
    },
    G: {
      drumName: "snare1",
      duration: 0.03
    },
    Gs: {
      drumName: "weird1",
      duration: 1.1
    },
    A: {
      drumName: "hihat1",
      duration: 0.3
    },
    As: {
      drumName: "hihat2",
      duration: 0.3
    },
    B: {
      drumName: "hihat3",
      duration: 0.4
    }
  };

  DrumSet.prototype.initDrumAtIndex = function(drumIndex) {
    var drum, func, sampleIndex, sampleLength, x, _i, _results;
    drum = DrumSet.drums[Keyboard.noteNames[drumIndex]];
    func = this[drum.drumName];
    sampleLength = Math.floor(drum.duration * this.config.sampleRate);
    log({
      "file": "./coffee/audio/synth/drumset.coffee",
      "class": "DrumSet",
      "line": 55,
      "args": ["drumIndex"],
      "method": "initDrumAtIndex",
      "type": "."
    }, "<span class='console-type'>drumIndex:</span>", drumIndex, "<span class='console-type'>sampleLength:</span>", sampleLength, "<span class='console-type'>@config.sampleRate:</span>", this.config.sampleRate);
    this.samples[drumIndex] = new Float32Array(sampleLength);
    _results = [];
    for (sampleIndex = _i = 0; 0 <= sampleLength ? _i < sampleLength : _i > sampleLength; sampleIndex = 0 <= sampleLength ? ++_i : --_i) {
      x = sampleIndex / (sampleLength - 1);
      _results.push(this.samples[drumIndex][sampleIndex] = func(sampleIndex * this.isr, sampleLength, x));
    }
    return _results;
  };

  DrumSet.prototype.initBuffers = function() {
    return this.createBuffers();
  };

  DrumSet.prototype.createBuffers = function() {
    return this.samples = new Array(DrumSet.names.length);
  };

  DrumSet.prototype.drumIndexForNoteName = function(noteName) {
    return Keyboard.noteIndex(noteName) % 12;
  };

  DrumSet.prototype.sampleForNoteIndex = function(noteIndex) {
    return this.sampleForNoteName(Keyboard.allNoteNames()[noteIndex]);
  };

  DrumSet.prototype.sampleForNoteName = function(noteName) {
    var drumIndex;
    drumIndex = this.drumIndexForNoteName(noteName);
    if (this.samples[drumIndex] == null) {
      this.initDrumAtIndex(drumIndex);
    }
    return this.samples[drumIndex];
  };


  /*
  0000000    00000000   000   000  00     00
  000   000  000   000  000   000  000   000
  000   000  0000000    000   000  000000000
  000   000  000   000  000   000  000 0 000
  0000000    000   000   0000000   000   000
   */

  DrumSet.prototype.kick1 = function(t, l, x) {
    var y;
    y = 0.5 * this.noise(32000 * t) * Math.exp(-32 * t);
    y += 2.0 * this.noise(3200 * t) * Math.exp(-32 * t);
    y += 3.0 * Math.sin(400 * (1 - t) * t) * Math.exp(-4 * t);
    return y *= 2;
  };

  DrumSet.prototype.kick2 = function(t, l, x) {
    var y;
    y = 0.5 * this.noise(3200 * t) * Math.exp(-16 * t);
    y += 2.0 * this.noise(320 * t) * Math.exp(-16 * t);
    y += 3.0 * Math.sin(400 * (1 - t) * t) * Math.exp(-4 * t);
    return y *= 2;
  };

  DrumSet.prototype.kick3 = function(t, l, x) {
    var y;
    y = 0.5 * this.cellnoise(32000 * t) * Math.exp(-32 * t);
    y += 2.0 * this.cellnoise(3200 * t) * Math.exp(-16 * t);
    y += 3.0 * Math.sin(400 * (1 - t) * t) * Math.exp(-4 * t);
    return y *= 1.3;
  };

  DrumSet.prototype.kick4 = function(t, l, x) {
    var y;
    y = 3.0 * Math.sin(400 * (1 - t) * t) * Math.exp(-4 * t);
    y += 0.5 * this.saw(0, 400 * t) * Math.exp(-8 * t);
    y += 1.0 * this.sqr(0, 200 * t) * Math.exp(-16 * t);
    return y += 2.0 * this.sqr(0, 100 * t) * Math.exp(-6 * t);
  };

  DrumSet.prototype.tom1 = function(t, l, x) {
    var f, y;
    f = 1000 - 2500 * t;
    y = Math.sin(f * t);
    y *= Math.exp(-12 * t);
    return y *= 3;
  };

  DrumSet.prototype.tom2 = function(t, l, x) {
    var d, y;
    y = _.clamp(-1.0, 1.0, 2.0 * Math.sin(2000 * t * Math.exp(-6 * t)) * Math.exp(-6 * t));
    d = 0.95;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  DrumSet.prototype.snare1 = function(t, l, x) {
    var f, y;
    f = 1000 - 2500 * t;
    y = Math.sin(f * t);
    y += 0.2 * Math.random();
    return y *= 4 * this.cellnoise(32000 * t) * Math.exp(-6 * t);
  };

  DrumSet.prototype.weird1 = function(t, l, x) {
    var d, y;
    y = Math.max(-1.0, Math.min(1.0, 8.0 * Math.sin(3000 * t * Math.exp(-6 * t))));
    d = 0.95;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  DrumSet.prototype.perc1 = function(t, l, x) {
    var y;
    y = 0.5 * Math.sin(8000 * t) * Math.exp(-16 * t);
    y += 0.5 * Math.sin(3200 * t) * Math.exp(-16 * t);
    y += 3.0 * Math.sin(400 * (1 - t) * t) * Math.exp(-4 * t);
    return y *= 2;
  };

  DrumSet.prototype.hihat1 = function(t, l, x) {
    var d, f, y;
    f = 1000 - 2500 * t;
    y = Math.sin(f * t);
    y += 0.2 * Math.random();
    y *= 10 * this.noise(32000 * t) * Math.exp(-6 * t);
    d = 0.95;
    if (x > d) {
      y *= Math.pow(1 - (x - d) / (1 - d), 2);
    }
    return y;
  };

  DrumSet.prototype.hihat2 = function(t, l, x) {
    var f, y;
    f = 2000 - 1500 * t;
    y = Math.sin(f * t);
    y += 0.1 * Math.random();
    y *= 4 * this.noise(16000 * t) * Math.exp(-2 * t);
    return y *= 1 - (x * x * x * x * x);
  };

  DrumSet.prototype.hihat3 = function(t, l, x) {
    var f, y;
    f = 2000 - 1500 * t;
    y = this.sqr(f * t);
    y *= 4 * this.noise(16000 * t) * Math.exp(-2 * t);
    return y *= 1 - (x * x * x * x * x);
  };

  return DrumSet;

})(Instruments);


/*

 0000000  000   000  000   000  000000000  000   000
000        000 000   0000  000     000     000   000
0000000     00000    000 0 000     000     000000000
     000     000     000  0000     000     000   000
0000000      000     000   000     000     000   000
 */

Synth = (function(_super) {
  __extends(Synth, _super);

  function Synth() {
    this.drawCurve = __bind(this.drawCurve, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.playNote = __bind(this.playNote, this);
    this.onTrigger = __bind(this.onTrigger, this);
    this.note = __bind(this.note, this);
    this.setInstrument = __bind(this.setInstrument, this);
    this.setDuration = __bind(this.setDuration, this);
    this.setGain = __bind(this.setGain, this);
    this.setNote = __bind(this.setNote, this);
    this.init = __bind(this.init, this);
    return Synth.__super__.constructor.apply(this, arguments);
  }

  Synth.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      type: 'Synth',
      instrument: 'guitar',
      noteName: 'C4',
      height: 330,
      duration: 0.4,
      minDuration: 0.01,
      maxDuration: 2.0,
      gain: 0.5
    });
    _ref = Audio.gain(cfg), this.gain = _ref[0], cfg = _ref[1];
    this.audio = this.gain;
    Synth.__super__.init.call(this, cfg, {
      title: 'synth',
      recKey: 'synth',
      children: [
        {
          type: 'jacks',
          hasInput: false,
          content: {
            type: 'hbox',
            children: [
              {
                type: 'connector',
                slot: 'note'
              }, {
                type: 'spinner',
                "class": 'note',
                recKey: 'note',
                tooltip: 'note',
                value: cfg.noteName,
                recKey: 'note',
                values: Keyboard.allNoteNames(),
                style: {
                  width: '100%'
                }
              }
            ]
          }
        }, {
          type: 'canvas',
          "class": 'synth_canvas',
          style: {
            width: '100%',
            height: '100%',
            marginBottom: '6px'
          }
        }, {
          type: 'sliderspin',
          "class": 'duration',
          tooltip: 'duration',
          recKey: 'duration',
          value: cfg.duration,
          minValue: cfg.minDuration,
          maxValue: cfg.maxDuration,
          spinStep: cfg.durationStep
        }, {
          type: 'sliderspin',
          "class": 'gain',
          tooltip: 'gain',
          value: cfg.gain,
          minValue: 0.0,
          maxValue: 1.0
        }, {
          type: 'spinner',
          "class": 'instrument',
          tooltip: 'instrument',
          value: cfg.instrument,
          values: Instruments.names
        }, {
          type: 'button',
          text: 'trigger',
          "class": 'trigger'
        }
      ]
    });
    this.instruments = new Instruments({
      duration: this.config.duration,
      instrument: this.config.instrument
    });
    this.canvas = this.getChild('canvas');
    this.connect('trigger:trigger', this.onTrigger);
    this.connect('gain:onValue', this.setGain);
    this.connect('note:onValue', this.setNote);
    this.connect('duration:onValue', this.setDuration);
    this.connect('instrument:onValue', this.setInstrument);
    this.setDuration(this.config.duration);
    this.setGain(this.config.gain);
    return this;
  };

  Synth.prototype.setNote = function(v) {
    this.config.noteName = _.value(v);
    return this.drawCurve();
  };

  Synth.prototype.setGain = function(v) {
    this.config.gain = _.value(v);
    return this.gain.gain.value = this.config.gain;
  };

  Synth.prototype.setDuration = function(v) {
    this.config.duration = _.value(v);
    this.instruments.setDuration(v);
    return this.drawCurve();
  };

  Synth.prototype.setInstrument = function(v) {
    this.instruments.setInstrument(v);
    return this.drawCurve();
  };

  Synth.prototype.note = function(event) {
    if (event.detail.event === 'trigger') {
      return this.playNote(event.detail);
    }
  };

  Synth.prototype.onTrigger = function(event) {
    return this.playNote({
      event: 'trigger',
      noteName: this.getChild('note').config.value
    });
  };

  Synth.prototype.playNote = function(note) {
    var audioBuffer, node;
    audioBuffer = this.instruments.createAudioBufferForNoteIndex(Keyboard.noteIndex(note.noteName));
    node = Audio.context.createBufferSource();
    node.buffer = audioBuffer;
    node.connect(this.gain);
    node.state = node.noteOn;
    return node.start(0);
  };

  Synth.prototype.sizeWindow = function() {
    var content, height, width, _ref;
    Synth.__super__.sizeWindow.apply(this, arguments);
    content = this.getChild('content');
    content.setHeight(this.contentHeight());
    height = content.innerHeight() - 180;
    width = content.innerWidth() - 20;
    if ((_ref = this.canvas) != null) {
      _ref.resize(width, height);
    }
    return this.drawCurve();
  };

  Synth.prototype.drawCurve = function() {
    var ctx, cvh, cvs, cvw, hh, i, sample, v, x, xd, y, _i, _ref;
    cvs = this.canvas.elem;
    ctx = cvs.getContext("2d");
    cvw = cvs.getWidth();
    cvh = cvs.getHeight();
    ctx.lineWidth = 1;
    ctx.fillStyle = StyleSwitch.colors.synth_canvas;
    ctx.fillRect(0, 0, cvw, cvh);
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(0, 0, cvw, cvh);
    ctx.beginPath();
    ctx.strokeStyle = StyleSwitch.colors.analyser_trigger;
    hh = cvh * 0.5;
    ctx.moveTo(0, hh);
    ctx.lineTo(cvw, hh);
    ctx.stroke();
    ctx.strokeStyle = StyleSwitch.colors.synth_trace;
    ctx.beginPath();
    sample = this.instruments.sampleForNoteIndex(Keyboard.noteIndex(this.config.noteName));
    xd = cvw / sample.length;
    x = 0;
    for (i = _i = 0, _ref = sample.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      v = sample[i] * 0.1;
      y = (0.5 + v) * cvh;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += xd;
    }
    return ctx.stroke();
  };

  Synth.menu = function() {
    return Synth.menuButton({
      text: 'Synth',
      icon: 'fa-area-chart',
      action: function() {
        return new Synth({
          center: true
        });
      }
    });
  };

  return Synth;

})(AudioWindow);

//# sourceMappingURL=synth.js.map
