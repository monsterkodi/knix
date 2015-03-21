
/*

0000000    000   000  00000000  00000000  00000000  00000000    0000000
000   000  000   000  000       000       000       000   000  000     
0000000    000   000  000000    000000    0000000   0000000    0000000 
000   000  000   000  000       000       000       000   000       000
0000000     0000000   000       000       00000000  000   000  0000000
 */
var Buffers, Instruments, Synth,
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
    this.clamp = __bind(this.clamp, this);
    this.over = __bind(this.over, this);
    this.step = __bind(this.step, this);
    this.sqr = __bind(this.sqr, this);
    this.frac = __bind(this.frac, this);
    this.sign = __bind(this.sign, this);
    this.fmod = __bind(this.fmod, this);
    this.setDuration = __bind(this.setDuration, this);
    this.createAudioBufferForNoteIndex = __bind(this.createAudioBufferForNoteIndex, this);
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
    this.samples = new Array(Keyboard.numNotes());
    this.initBuffers();
    return this;
  };

  Buffers.prototype.initBuffers = function() {
    var i, numNotes, _i;
    this.sampleLength = this.config.duration * this.config.sampleRate;
    this.isr = 1.0 / this.config.sampleRate;
    log({
      "file": "./coffee/audio/synth/buffers.coffee",
      "class": "Buffers",
      "line": 33,
      "args": ["cfg", "defs"],
      "method": "initBuffers",
      "type": "."
    }, "<span class='console-type'>@sampleLength:</span>", this.sampleLength);
    this.sampleLength = Math.floor(this.sampleLength);
    log({
      "file": "./coffee/audio/synth/buffers.coffee",
      "class": "Buffers",
      "line": 35,
      "args": ["cfg", "defs"],
      "method": "initBuffers",
      "type": "."
    }, "<span class='console-type'>@sampleLength:</span>", this.sampleLength);
    numNotes = Keyboard.numNotes();
    for (i = _i = 0; 0 <= numNotes ? _i < numNotes : _i > numNotes; i = 0 <= numNotes ? ++_i : --_i) {
      this.samples[i] = new Float32Array(this.sampleLength);
    }
    return this;
  };

  Buffers.prototype.createAudioBufferForNoteIndex = function(noteIndex) {
    var audioBuffer, buffer, i, sample, _i, _ref;
    audioBuffer = Audio.context.createBuffer(1, this.sampleLength, this.config.sampleRate);
    buffer = audioBuffer.getChannelData(0);
    sample = this.samples[noteIndex];
    for (i = _i = 0, _ref = this.sampleLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      buffer[i] = sample[i];
    }
    return audioBuffer;
  };

  Buffers.prototype.setDuration = function(v) {
    this.config.duration = _.value(v);
    return this.initBuffers();
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

  Buffers.prototype.clamp = function(x, a, b) {
    if (x < a) {
      return a;
      if (x > b) {
        return b;
        return x;
      }
    }
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

  Instruments.names = ["piano1", "piano2", "piano3", "bell", "guitar", "flute", "drum1", "drum2", "drum3", "organ1", "organ2", "organ3", "organ4", "fm1", "fm2", "fm3"];

  function Instruments(cfg, defs) {
    this.fm3 = __bind(this.fm3, this);
    this.fm2 = __bind(this.fm2, this);
    this.fm1 = __bind(this.fm1, this);
    this.drum3 = __bind(this.drum3, this);
    this.drum2 = __bind(this.drum2, this);
    this.drum1 = __bind(this.drum1, this);
    this.flute = __bind(this.flute, this);
    this.guitar = __bind(this.guitar, this);
    this.bell = __bind(this.bell, this);
    this.organ4 = __bind(this.organ4, this);
    this.organ3 = __bind(this.organ3, this);
    this.organ2 = __bind(this.organ2, this);
    this.organ1 = __bind(this.organ1, this);
    this.piano3 = __bind(this.piano3, this);
    this.piano2 = __bind(this.piano2, this);
    this.piano1 = __bind(this.piano1, this);
    this.setDuration = __bind(this.setDuration, this);
    this.initInstrument = __bind(this.initInstrument, this);
    this.setInstrument = __bind(this.setInstrument, this);
    this.init = __bind(this.init, this);
    this.init(cfg, defs);
  }

  Instruments.prototype.init = function(cfg, defs) {
    Instruments.__super__.init.call(this, cfg, defs);
    return this;
  };

  Instruments.prototype.setInstrument = function(v) {
    if (this.instrument !== _.value(v)) {
      this.instrument = _.value(v);
      return this.initInstrument();
    }
  };

  Instruments.prototype.initInstrument = function() {
    var f, func, i, n, s, w, _i, _ref, _results;
    log({
      "file": "./coffee/audio/synth/instruments.coffee",
      "class": "Instruments",
      "line": 27,
      "args": ["v"],
      "method": "initInstrument",
      "type": "."
    }, "<span class='console-type'>@instrument:</span>", this.instrument);
    func = this[this.instrument];
    _results = [];
    for (s = _i = 0, _ref = this.samples.length; 0 <= _ref ? _i < _ref : _i > _ref; s = 0 <= _ref ? ++_i : --_i) {
      n = Keyboard.allNoteNames()[s];
      f = Keyboard.allNotes()[n];
      w = 2.0 * Math.PI * f;
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (i = _j = 0, _ref1 = this.sampleLength; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(this.samples[s][i] = func(i * this.isr, w));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Instruments.prototype.setDuration = function(v) {
    if (this.config.duration !== _.value(v)) {
      Instruments.__super__.setDuration.apply(this, arguments);
      return this.initInstrument();
    }
  };


  /*
  00000000   000   0000000   000   000   0000000 
  000   000  000  000   000  0000  000  000   000
  00000000   000  000000000  000 0 000  000   000
  000        000  000   000  000  0000  000   000
  000        000  000   000  000   000   0000000
   */

  Instruments.prototype.piano1 = function(t, w) {
    var y;
    y = 0.6 * Math.sin(1.0 * w * t) * Math.exp(-0.0008 * w * t);
    y += 0.3 * Math.sin(2.0 * w * t) * Math.exp(-0.0010 * w * t);
    y += 0.1 * Math.sin(4.0 * w * t) * Math.exp(-0.0015 * w * t);
    y += 0.2 * y * y * y;
    y *= 0.9 + 0.1 * Math.cos(70.0 * t);
    return y = 2.0 * y * Math.exp(-22.0 * t) + y;
  };

  Instruments.prototype.piano2 = function(t, w) {
    var a, b, r, rt, y, y2, y3;
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
    return y = (y + y2 + y3) / 3;
  };

  Instruments.prototype.piano3 = function(t, w) {
    var a, b, c, tt, y;
    tt = 1 - t;
    a = Math.sin(t * w * .5) * Math.log(t + 0.3) * tt;
    b = Math.sin(t * w) * t * .4;
    c = this.fmod(tt, .075) * Math.cos(Math.pow(tt, 3) * w) * t * 2;
    return y = (a + b + c) * tt;
  };


  /*
   0000000   00000000    0000000    0000000   000   000
  000   000  000   000  000        000   000  0000  000
  000   000  0000000    000  0000  000000000  000 0 000
  000   000  000   000  000   000  000   000  000  0000
   0000000   000   000   0000000   000   000  000   000
   */

  Instruments.prototype.organ1 = function(t, w) {
    var a, y;
    y = .6 * Math.cos(w * t) * Math.exp(-4 * t);
    y += .4 * Math.cos(2 * w * t) * Math.exp(-3 * t);
    y += .01 * Math.cos(4 * w * t) * Math.exp(-1 * t);
    y = y * y * y + y * y * y * y * y + y * y;
    a = .5 + .5 * Math.cos(8 * t);
    y = Math.sin(y * a * 3.14);
    return y *= 30 * t * Math.exp(-.1 * t);
  };

  Instruments.prototype.organ2 = function(t, w) {
    var a, f, y;
    f = this.fmod(t, 6.2831 / w) * w / 6.2831;
    a = .7 + .3 * Math.cos(6.2831 * t);
    y = -1.0 + 2 * this.saw(f, a);
    y = y * y * y;
    return y = 15 * y * t * Math.exp(-5 * t);
  };

  Instruments.prototype.organ3 = function(t, w) {
    var a1, a2, a3, y;
    a1 = .5 + .5 * Math.cos(0 + t * 12);
    a2 = .5 + .5 * Math.cos(1 + t * 8);
    a3 = .5 + .5 * Math.cos(2 + t * 4);
    y = this.saw(.2500 * w * t, a1) * Math.exp(-2 * t);
    y += this.saw(.1250 * w * t, a2) * Math.exp(-3 * t);
    y += this.saw(.0625 * w * t, a3) * Math.exp(-4 * t);
    return y *= .8 + .2 * Math.cos(64 * t);
  };

  Instruments.prototype.organ4 = function(t, w) {
    var f, y;
    f = 0.001 * (Math.cos(5 * t));
    y = 1.0 * (this.saw((1.00 + f) * 0.1 * w * t, 1) - 0.5);
    y += 0.7 * (this.saw((2.01 + f) * 0.1 * w * t, 1) - 0.5);
    y += 0.5 * (this.saw((4.02 + f) * 0.1 * w * t, 1) - 0.5);
    y += 0.2 * (this.saw((8.02 + f) * 0.1 * w * t, 1) - 0.5);
    y *= 20 * t * Math.exp(-4 * t);
    return y *= 0.9 + 0.1 * Math.cos(40 * t);
  };


  /*
  0000000    00000000  000      000    
  000   000  000       000      000    
  0000000    0000000   000      000    
  000   000  000       000      000    
  0000000    00000000  0000000  0000000
   */

  Instruments.prototype.bell = function(t, w) {
    var y;
    y = 0.100 * Math.exp(-t / 1.000) * Math.sin(0.56 * w * t);
    y += 0.067 * Math.exp(-t / 0.900) * Math.sin(0.56 * w * t);
    y += 0.100 * Math.exp(-t / 0.650) * Math.sin(0.92 * w * t);
    y += 0.180 * Math.exp(-t / 0.550) * Math.sin(0.92 * w * t);
    y += 0.267 * Math.exp(-t / 0.325) * Math.sin(1.19 * w * t);
    y += 0.167 * Math.exp(-t / 0.350) * Math.sin(1.70 * w * t);
    y += 0.146 * Math.exp(-t / 0.250) * Math.sin(2.00 * w * t);
    y += 0.133 * Math.exp(-t / 0.200) * Math.sin(2.74 * w * t);
    y += 0.133 * Math.exp(-t / 0.150) * Math.sin(3.00 * w * t);
    y += 0.100 * Math.exp(-t / 0.100) * Math.sin(3.76 * w * t);
    y += 0.133 * Math.exp(-t / 0.075) * Math.sin(4.07 * w * t);
    return y;
  };


  /*
   0000000  000000000  00000000   000  000   000   0000000 
  000          000     000   000  000  0000  000  000      
  0000000      000     0000000    000  000 0 000  000  0000
       000     000     000   000  000  000  0000  000   000
  0000000      000     000   000  000  000   000   0000000
   */

  Instruments.prototype.guitar = function(t, w) {
    var f, y;
    f = Math.cos(0.251 * w * t);
    y = 0.5 * Math.cos(1.0 * w * t + 3.14 * f) * Math.exp(-0.0007 * w * t);
    y += 0.2 * Math.cos(2.0 * w * t + 3.14 * f) * Math.exp(-0.0009 * w * t);
    y += 0.2 * Math.cos(4.0 * w * t + 3.14 * f) * Math.exp(-0.0016 * w * t);
    y += 0.1 * Math.cos(8.0 * w * t + 3.14 * f) * Math.exp(-0.0020 * w * t);
    y *= 0.9 + 0.1 * Math.cos(70.0 * t);
    return y = 2.0 * y * Math.exp(-22.0 * t) + y;
  };


  /*
  00000000  000      000   000  000000000  00000000
  000       000      000   000     000     000     
  000000    000      000   000     000     0000000 
  000       000      000   000     000     000     
  000       0000000   0000000      000     00000000
   */

  Instruments.prototype.flute = function(t, w) {
    var y;
    y = 6.0 * t * Math.exp(-2 * t) * Math.sin(w * t);
    return y *= .8 + .2 * Math.cos(16 * t);
  };


  /*
  0000000    00000000   000   000  00     00
  000   000  000   000  000   000  000   000
  000   000  0000000    000   000  000000000
  000   000  000   000  000   000  000 0 000
  0000000    000   000   0000000   000   000
   */

  Instruments.prototype.drum1 = function(t, w) {
    var y;
    return y = Math.max(-1.0, Math.min(1.0, 8.0 * Math.sin(3000 * t * Math.exp(-6 * t))));
  };

  Instruments.prototype.drum2 = function(t, w) {
    var y;
    y = 0.5 * this.noise(32000 * t) * Math.exp(-32 * t);
    y += 2.0 * this.noise(3200 * t) * Math.exp(-32 * t);
    return y += 3.0 * Math.cos(400 * (1 - t) * t) * Math.exp(-4 * t);
  };

  Instruments.prototype.drum3 = function(t, w) {
    var f, y;
    f = 1000 - 2500 * t;
    y = Math.sin(f * t);
    y += .2 * Math.random();
    y *= Math.exp(-12 * t);
    return y *= 8;
  };


  /*
  00000000  00     00
  000       000   000
  000000    000000000
  000       000 0 000
  000       000   000
   */

  Instruments.prototype.fm1 = function(t, w) {
    var a0, a1, a2, exp2y, k0, k1, k2, k3, y, y0, y1, y2;
    k0 = 0.5;
    k1 = 0.15;
    k2 = 1.05;
    k3 = 0.005;
    a0 = 12.0;
    a1 = 8.0;
    a2 = 0.1;
    y0 = Math.sin(a0 * Math.sin(k0 * w * t) + Math.sin(a1 * Math.sin(k1 * w * t)));
    y1 = (y0 * y0 - k2) * Math.sin(k3 * w * t);
    y2 = 0.5 * Math.random() * Math.log(8.0 * t);
    y = 0.3333 * (y0 + y1 + y2);
    y *= 3.0 * Math.exp(-1.0 * t) * Math.exp(-2.0 * t);
    exp2y = Math.exp(2.0 * y);
    return y = (exp2y - 1.0) / (exp2y + 1.0);
  };

  Instruments.prototype.fm2 = function(t, w) {
    var a, b, c, d, exp2y, y;
    a = Math.sin(Math.sin(0.2 * w * t) - Math.tan(0.5 * w * t));
    b = Math.sin(Math.sin(0.2 * w * t) + Math.sin(2.0 * w * t));
    c = Math.sin(Math.sin(0.4 * w * t) - Math.sin(2.0 * w * t));
    d = 1.2 * Math.random();
    y = 0.25 * (a + b + c + d);
    y = (0.25 + Math.sin(0.005 * w * t)) * Math.sin(y * t);
    y *= Math.exp(-4.0 * t) * Math.exp(-1.5 * t) * 40.0;
    exp2y = Math.exp(2.0 * y);
    return y = (exp2y - 1.0) / (exp2y + 1.0);
  };

  Instruments.prototype.fm3 = function(t, w) {
    var a0, b1, exp2y, wm, y, y0;
    wm = Math.tan(0.025 * w * t) + 2.0 * Math.sin(w * t) + Math.random();
    y0 = Math.sin(wm * t);
    a0 = -0.93 * t;
    b1 = 1.0 - a0;
    y = b1 * y0;
    exp2y = Math.exp(2.0 * y);
    return y = (exp2y - 1.0) / (exp2y + 1.0);
  };

  return Instruments;

})(Buffers);


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
      minDuration: 0.001,
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
      duration: cfg.duration
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
    var ctx, cvh, cvs, cvw, i, sampleIndex, v, x, xd, y, _i, _ref;
    cvs = this.canvas.elem;
    ctx = cvs.getContext("2d");
    cvw = cvs.getWidth();
    cvh = cvs.getHeight();
    ctx.lineWidth = 1;
    ctx.fillStyle = StyleSwitch.colors.synth_canvas;
    ctx.fillRect(0, 0, cvw, cvh);
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(0, 0, cvw, cvh);
    ctx.strokeStyle = StyleSwitch.colors.synth_trace;
    ctx.beginPath();
    xd = this.getWidth() / this.instruments.sampleLength;
    x = 0;
    sampleIndex = Keyboard.noteIndex(this.config.noteName);
    for (i = _i = 0, _ref = this.instruments.sampleLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      v = this.instruments.samples[sampleIndex][i] * 0.1;
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
      icon: 'fa-database',
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
