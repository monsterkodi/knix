
/*

 0000000   000   000  0000000    000   0000000 
000   000  000   000  000   000  000  000   000
000000000  000   000  000   000  000  000   000
000   000  000   000  000   000  000  000   000
000   000   0000000   0000000    000   0000000
 */
var ADSR, Analyser, Audio, AudioWindow, Delay, Envelope, Filter, Gain, Jacks, Keyboard, Oscillator, Ramp, Recorder,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Audio = (function() {
  function Audio() {}

  Audio.init = function() {
    Audio.context = new (window.AudioContext || window.webkitAudioContext)();
    Timeline.menu();
    Keyboard.menu();
    Synth.menu();
    Drums.menu();
    ADSR.menu();
    Ramp.menu();
    Envelope.menu();
    Range.menu();
    Oscillator.menu();
    Filter.menu();
    Delay.menu();
    Analyser.menu();
    return Gain.menu();
  };

  Audio.sendParamValuesFromConnector = function(paramValues, connector) {
    var connection, _i, _len, _ref, _results;
    _ref = connector.connections;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      connection = _ref[_i];
      _results.push(connection.config.target.getWindow().paramValuesAtConnector(_.clone(paramValues), connection.config.target));
    }
    return _results;
  };

  Audio.setValuesForParam = function(paramValues, param) {
    var i, offset, range, t, value, _i, _ref, _results;
    offset = paramValues.offset || 0;
    range = paramValues.range || 1;
    param.cancelScheduledValues(Audio.context.currentTime);
    t = Audio.context.currentTime + 0.04;
    _results = [];
    for (i = _i = 0, _ref = paramValues.values.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      value = offset + paramValues.values[i].value * range;
      _results.push(param.linearRampToValueAtTime(value, t + paramValues.values[i].time));
    }
    return _results;
  };

  Audio.filter = function(cfg) {
    var filter;
    cfg = _.def(cfg, {
      frequency: 440,
      minFrequency: 100,
      maxFrequency: 12000,
      detune: 0,
      minDetune: -1000,
      maxDetune: 1000,
      gain: 1,
      minGain: 0,
      maxGain: 1,
      Q: 1,
      minQ: 0.0,
      maxQ: 50,
      filter: 'bandpass'
    });
    filter = Audio.context.createBiquadFilter();
    filter.frequency.value = cfg.frequency;
    filter.detune.value = cfg.detune;
    filter.Q.value = cfg.Q;
    filter.type = cfg.filter;
    return [filter, cfg];
  };

  Audio.delay = function(cfg) {
    var delay;
    cfg = _.def(cfg, {
      delay: 0.005,
      maxDelay: 5.0,
      minDelay: 0.0
    });
    delay = Audio.context.createDelay(cfg.maxDelay);
    delay.delayTime.value = cfg.delay;
    return [delay, cfg];
  };

  Audio.oscillator = function(cfg) {
    var oscillator;
    cfg = _.def(cfg, {
      frequency: 0,
      minFrequency: 0,
      maxFrequency: 14000
    });
    oscillator = Audio.context.createOscillator();
    oscillator.frequency.value = cfg.frequency;
    oscillator.start(0);
    return [oscillator, cfg];
  };

  Audio.gain = function(cfg) {
    var gain;
    cfg = _.def(cfg, {
      gain: 0
    });
    gain = Audio.context.createGain();
    gain.gain.value = cfg.gain;
    if (cfg.master) {
      gain.connect(Audio.context.destination);
    }
    return [gain, cfg];
  };

  Audio.analyser = function(cfg) {
    var analyser;
    cfg = _.def(cfg, {
      minDecibels: -90,
      maxDecibels: -10,
      smoothingTime: 0.85,
      fftSize: 2048
    });
    analyser = Audio.context.createAnalyser();
    analyser.minDecibels = cfg.minDecibels;
    analyser.maxDecibels = cfg.maxDecibels;
    analyser.smoothingTimeConstant = cfg.smoothingTime;
    analyser.fftSize = cfg.fftSize;
    return [analyser, cfg];
  };

  Audio.destroy = function(node) {
    node.disconnect();
    if (typeof node.stop === "function") {
      node.stop();
    }
    return void 0;
  };

  return Audio;

})();


/*

 0000000   000   000  0000000    000   0000000   000   000  000  000   000  0000000     0000000   000   000
000   000  000   000  000   000  000  000   000  000 0 000  000  0000  000  000   000  000   000  000 0 000
000000000  000   000  000   000  000  000   000  000000000  000  000 0 000  000   000  000   000  000000000
000   000  000   000  000   000  000  000   000  000   000  000  000  0000  000   000  000   000  000   000
000   000   0000000   0000000    000   0000000   00     00  000  000   000  0000000     0000000   00     00
 */

AudioWindow = (function(_super) {
  __extends(AudioWindow, _super);

  function AudioWindow() {
    this.close = __bind(this.close, this);
    this.init = __bind(this.init, this);
    return AudioWindow.__super__.constructor.apply(this, arguments);
  }

  AudioWindow.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    AudioWindow.__super__.init.call(this, cfg, {
      minWidth: 240,
      width: 300
    });
    return this;
  };

  AudioWindow.prototype.close = function() {
    this.audio = Audio.destroy(this.audio);
    return AudioWindow.__super__.close.apply(this, arguments);
  };

  return AudioWindow;

})(Window);


/*

 0000000   0000000     0000000  00000000 
000   000  000   000  000       000   000
000000000  000   000  0000000   0000000  
000   000  000   000       000  000   000
000   000  0000000    0000000   000   000
 */

ADSR = (function(_super) {
  __extends(ADSR, _super);

  function ADSR() {
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.voiceDone = __bind(this.voiceDone, this);
    this.release = __bind(this.release, this);
    this.trigger = __bind(this.trigger, this);
    this.note = __bind(this.note, this);
    this.onNoteValue = __bind(this.onNoteValue, this);
    this.voiceIndex = __bind(this.voiceIndex, this);
    this.setShape = __bind(this.setShape, this);
    this.setFreqFactor = __bind(this.setFreqFactor, this);
    this.setFrequency = __bind(this.setFrequency, this);
    this.setDuration = __bind(this.setDuration, this);
    this.setGain = __bind(this.setGain, this);
    this.init = __bind(this.init, this);
    return ADSR.__super__.constructor.apply(this, arguments);
  }

  ADSR.prototype.init = function(cfg, defs) {
    var i, oscillator, volume, _i, _ref, _ref1, _ref2, _ref3;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      type: 'ADSR',
      shape: Oscillator.shapes[0],
      noteName: 'C4',
      height: 330,
      duration: 0.2,
      minDuration: 0.0,
      maxDuration: 10.0,
      freqFactor: 1.0,
      maxFrequency: 10000,
      frequency: 2000,
      gain: 0.5,
      voices: 16,
      numHandles: 3,
      sustainIndex: 1,
      vals: [pos(0, 0), pos(.2, 1), pos(1, 0)]
    });
    _ref = Audio.gain(cfg), this.gain = _ref[0], cfg = _ref[1];
    this.voice = [];
    this.volume = [];
    this.oscillator = [];
    for (i = _i = 0, _ref1 = cfg.voices; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      _ref2 = Audio.gain(cfg), volume = _ref2[0], cfg = _ref2[1];
      _ref3 = Audio.oscillator(cfg), oscillator = _ref3[0], cfg = _ref3[1];
      this.voice.push(void 0);
      this.volume.push(volume);
      this.oscillator.push(oscillator);
      oscillator.connect(volume);
      volume.gain.value = 0;
      volume.connect(this.gain);
    }
    this.audio = this.gain;
    ADSR.__super__.init.call(this, cfg, {
      title: 'adsr',
      recKey: 'adsr',
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
                  width: '50%'
                }
              }, {
                type: 'spinner',
                "class": 'shape',
                recKey: 'shape',
                tooltip: 'shape',
                value: cfg.shape,
                values: Oscillator.shapes,
                style: {
                  width: '50%'
                }
              }
            ]
          }
        }, {
          type: 'pad',
          "class": 'pad',
          numHandles: cfg.numHandles,
          sustainIndex: cfg.sustainIndex,
          vals: cfg.vals,
          minHeight: 50,
          minWidth: 150
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
          "class": 'freqFactor',
          tooltip: 'freqency factor',
          value: cfg.freqFactor,
          minValue: 0,
          maxValue: 1.0
        }, {
          type: 'sliderspin',
          "class": 'frequency',
          tooltip: 'frequency',
          value: cfg.frequency,
          minValue: cfg.minFrequency,
          maxValue: cfg.maxFrequency
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
    this.connect('trigger:trigger', this.trigger);
    this.connect('trigger:release', this.release);
    this.connect('gain:onValue', this.setGain);
    this.connect('shape:onValue', this.setShape);
    this.connect('duration:onValue', this.setDuration);
    this.connect('freqFactor:onValue', this.setFreqFactor);
    this.connect('frequency:onValue', this.setFrequency);
    this.connect('note:onValue', this.onNoteValue);
    this.setFreqFactor(this.config.freqFactor);
    this.setFrequency(this.config.frequency);
    this.setDuration(this.config.duration);
    this.setShape(this.config.shape);
    this.setGain(this.config.gain);
    this.pad = this.getChild('pad');
    return this;
  };

  ADSR.prototype.setGain = function(v) {
    this.config.gain = _.value(v);
    return this.gain.gain.value = this.config.gain;
  };

  ADSR.prototype.setDuration = function(v) {
    return this.config.duration = _.value(v);
  };

  ADSR.prototype.setFrequency = function(v) {
    return this.config.frequency = _.value(v);
  };

  ADSR.prototype.setFreqFactor = function(v) {
    return this.config.freqFactor = _.value(v);
  };

  ADSR.prototype.setShape = function(v) {
    var i, _i, _ref, _results;
    this.config.shape = _.isString(v) ? v : _.value(v);
    _results = [];
    for (i = _i = 0, _ref = this.config.voices; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(this.oscillator[i].type = this.config.shape);
    }
    return _results;
  };

  ADSR.prototype.voiceIndex = function(id) {
    var i, _i, _j, _ref, _ref1, _ref2;
    for (i = _i = 0, _ref = this.config.voices; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (((_ref1 = this.voice[i]) != null ? _ref1.id : void 0) === id) {
        return i;
      }
    }
    for (i = _j = 0, _ref2 = this.config.voices; 0 <= _ref2 ? _j < _ref2 : _j > _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
      if (this.voice[i] === void 0) {
        this.voice[i] = {
          id: id
        };
        return i;
      }
    }
    warning({
      "file": "./coffee/audio/adsr.coffee",
      "class": "ADSR",
      "line": 162,
      "args": ["id"],
      "method": "voiceIndex",
      "type": "."
    }, 'no free voice');
    this.voice[0] = {
      id: id
    };
    return 0;
  };

  ADSR.prototype.onNoteValue = function(event) {
    var f, note;
    note = _.value(event);
    f = Keyboard.allNotes()[note];
    return this.getChild('frequency').setValue(f);
  };

  ADSR.prototype.note = function(event) {
    var f, note;
    note = event.detail;
    f = this.config.frequency;
    this.config.frequency = Keyboard.allNotes()[note.noteName];
    if (note.event === 'trigger') {
      this.trigger(event);
    } else {
      this.release(event);
    }
    this.emit('onNote');
    return this.config.frequency = f;
  };

  ADSR.prototype.trigger = function(event) {
    var i, note, t, time, v, value, vi, _i, _ref, _results;
    note = event.detail;
    i = this.voiceIndex(note.noteName);
    this.volume[i].gain.cancelScheduledValues(Audio.context.currentTime);
    this.oscillator[i].frequency.cancelScheduledValues(Audio.context.currentTime);
    t = Audio.context.currentTime + 0.01;
    _results = [];
    for (vi = _i = 0, _ref = this.pad.config.sustainIndex; 0 <= _ref ? _i <= _ref : _i >= _ref; vi = 0 <= _ref ? ++_i : --_i) {
      v = this.pad.config.vals[vi];
      time = v.x * this.config.duration;
      value = (this.config.freqFactor + (v.y * (1.0 - this.config.freqFactor))) * this.config.frequency;
      this.oscillator[i].frequency.linearRampToValueAtTime(value, t + time);
      this.volume[i].gain.linearRampToValueAtTime(v.y, t + time);
      if (vi === this.pad.config.sustainIndex) {
        _results.push(this.voice[i].done = t + time);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ADSR.prototype.release = function(event) {
    var i, msec, note, t, time, v, value, vi, _i, _ref, _ref1, _results;
    note = event.detail;
    i = this.voiceIndex(note.noteName);
    t = Audio.context.currentTime + 0.01;
    _results = [];
    for (vi = _i = _ref = this.pad.config.sustainIndex, _ref1 = this.pad.config.vals.length; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; vi = _ref <= _ref1 ? ++_i : --_i) {
      v = this.pad.config.vals[vi];
      time = v.x * this.config.duration;
      value = (this.config.freqFactor + (v.y * (1.0 - this.config.freqFactor))) * this.config.frequency;
      this.oscillator[i].frequency.linearRampToValueAtTime(value, t + time);
      this.volume[i].gain.linearRampToValueAtTime(v.y, t + time);
      if (vi === this.pad.config.vals.length - 1) {
        this.voice[i].done = Math.max(this.voice[i].done, t + time);
        msec = (this.voice[i].done - t) * 1000;
        _results.push(this.voice[i].timeout = setTimeout(this.voiceDone, msec, i));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  ADSR.prototype.voiceDone = function(i) {
    return this.voice[i] = void 0;
  };

  ADSR.prototype.sizeWindow = function() {
    var content, height, width;
    ADSR.__super__.sizeWindow.apply(this, arguments);
    if (this.pad != null) {
      content = this.getChild('content');
      content.setHeight(this.contentHeight());
      height = content.innerHeight() - 214;
      width = content.innerWidth() - 20;
      return this.pad.setSize(width, height);
    }
  };

  ADSR.menu = function() {
    return ADSR.menuButton({
      text: 'ADSR',
      icon: 'fa-cogs',
      action: function() {
        return new ADSR({
          center: true
        });
      }
    });
  };

  return ADSR;

})(AudioWindow);


/*

 0000000   000   000   0000000   000      000   000   0000000  00000000  00000000 
000   000  0000  000  000   000  000       000 000   000       000       000   000
000000000  000 0 000  000000000  000        00000    0000000   0000000   0000000  
000   000  000  0000  000   000  000         000          000  000       000   000
000   000  000   000  000   000  0000000     000     0000000   00000000  000   000
 */

Analyser = (function(_super) {
  __extends(Analyser, _super);

  function Analyser() {
    this.anim = __bind(this.anim, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.onCanvasTrigger = __bind(this.onCanvasTrigger, this);
    this.setTriggerY = __bind(this.setTriggerY, this);
    this.setScaleY = __bind(this.setScaleY, this);
    this.setScaleX = __bind(this.setScaleX, this);
    this.close = __bind(this.close, this);
    this.init = __bind(this.init, this);
    return Analyser.__super__.constructor.apply(this, arguments);
  }

  Analyser.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      scaleX: 1.0,
      scaleY: 1.0,
      triggerY: 0.0,
      height: 240
    });
    _ref = Audio.analyser(cfg), this.audio = _ref[0], cfg = _ref[1];
    this.dataArray = new Uint8Array(cfg.fftSize);
    Analyser.__super__.init.call(this, cfg, {
      type: 'analyser',
      title: 'analyser',
      children: [
        {
          type: 'jacks'
        }, {
          type: 'canvas',
          "class": 'analyser_canvas',
          style: {
            width: '100%',
            height: '100%',
            marginBottom: '5px'
          }
        }, {
          type: 'sliderspin',
          "class": 'scaleX',
          tooltip: 'horizontal scale',
          value: cfg.scaleX,
          minValue: 1.0,
          maxValue: 20.0,
          valueStep: 1
        }
      ]
    });
    this.connect('scaleX:onValue', this.setScaleX);
    this.canvas = this.getChild('analyser_canvas');
    new Drag({
      doMove: false,
      target: this.canvas.elem,
      cursor: 'crosshair',
      onStart: this.onCanvasTrigger,
      onMove: this.onCanvasTrigger
    });
    knix.animate(this);
    return this;
  };

  Analyser.prototype.close = function() {
    knix.deanimate(this);
    return Analyser.__super__.close.apply(this, arguments);
  };

  Analyser.prototype.setScaleX = function(v) {
    return this.config.scaleX = _.value(v);
  };

  Analyser.prototype.setScaleY = function(v) {
    return this.config.scaleY = _.value(v);
  };

  Analyser.prototype.setTriggerY = function(v) {
    return this.config.triggerY = _.value(v);
  };

  Analyser.prototype.onCanvasTrigger = function(drag, event) {
    if (event.target === this.canvas.elem) {
      return this.setTriggerY(-2 * (drag.relPos(event).y / this.canvas.elem.height - 0.5));
    }
  };

  Analyser.prototype.sizeWindow = function() {
    var content, hbox, height, width, _ref;
    hbox = this.getChild('hbox');
    height = this.contentHeight();
    content = this.getChild('content');
    content.setHeight(height);
    height = content.innerHeight() - 90;
    width = content.innerWidth() - 20;
    if ((_ref = this.canvas) != null) {
      _ref.resize(width, height);
    }
    return this.dataArray = new Uint8Array(2 * width);
  };

  Analyser.prototype.anim = function() {
    var ctx, cvh, cvs, cvw, i, samples, t, th, v, x, xd, y, _i;
    this.audio.getByteTimeDomainData(this.dataArray);
    cvs = this.canvas.elem;
    ctx = cvs.getContext("2d");
    cvw = cvs.getWidth();
    cvh = cvs.getHeight();
    ctx.lineWidth = 1;
    ctx.fillStyle = StyleSwitch.colors.analyser;
    ctx.fillRect(0, 0, cvw, cvh);
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(0, 0, cvw, cvh);
    ctx.beginPath();
    ctx.strokeStyle = StyleSwitch.colors.analyser_trigger;
    th = cvh * (0.5 - this.config.triggerY / 2);
    ctx.moveTo(0, th);
    ctx.lineTo(cvw, th);
    ctx.stroke();
    ctx.strokeStyle = StyleSwitch.colors.analyser_trace;
    ctx.beginPath();
    samples = this.dataArray.length;
    xd = this.config.scaleX;
    t = 0;
    while (this.dataArray[t] >= 128 + 128 * this.config.triggerY && t < samples) {
      t += 1;
    }
    while (this.dataArray[t] < 128 + 128 * this.config.triggerY && t < samples) {
      t += 1;
    }
    if (t >= samples) {
      t = 0;
    }
    x = 0;
    for (i = _i = t; t <= samples ? _i <= samples : _i >= samples; i = t <= samples ? ++_i : --_i) {
      v = 1 - this.dataArray[i] / 256.0;
      y = v * cvh;
      if (i === t) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += xd;
    }
    return ctx.stroke();
  };

  Analyser.menu = function() {
    return Analyser.menuButton({
      text: 'analyser',
      icon: 'fa-line-chart',
      action: function() {
        return new Analyser({
          center: true
        });
      }
    });
  };

  return Analyser;

})(AudioWindow);


/*

0000000    00000000  000       0000000   000   000
000   000  000       000      000   000   000 000 
000   000  0000000   000      000000000    00000  
000   000  000       000      000   000     000   
0000000    00000000  0000000  000   000     000
 */

Delay = (function(_super) {
  __extends(Delay, _super);

  function Delay() {
    this.setDelay = __bind(this.setDelay, this);
    this.init = __bind(this.init, this);
    return Delay.__super__.constructor.apply(this, arguments);
  }

  Delay.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    _ref = Audio.delay(cfg), this.audio = _ref[0], cfg = _ref[1];
    Delay.__super__.init.call(this, cfg, {
      type: 'delay',
      title: 'delay',
      resize: 'horizontal',
      children: [
        {
          type: 'jacks'
        }, {
          type: 'sliderspin',
          "class": 'delay',
          tooltip: 'delay',
          value: cfg.delay,
          minValue: cfg.minDelay,
          maxValue: cfg.maxDelay,
          spinStep: 0.0001,
          spinFormat: "%3.5f"
        }
      ]
    });
    this.connect('delay:onValue', this.setDelay);
    return this;
  };

  Delay.prototype.setDelay = function(v) {
    this.config.delay = _.value(v);
    return this.audio.delayTime.value = this.config.delay;
  };

  Delay.menu = function() {
    return Delay.menuButton({
      text: 'delay',
      icon: 'octicon-hourglass',
      action: function() {
        return new Delay({
          center: true
        });
      }
    });
  };

  return Delay;

})(AudioWindow);


/*

00000000  000   000  000   000  00000000  000       0000000   00000000   00000000
000       0000  000  000   000  000       000      000   000  000   000  000     
0000000   000 0 000   000 000   0000000   000      000   000  00000000   0000000 
000       000  0000     000     000       000      000   000  000        000     
00000000  000   000      0      00000000  0000000   0000000   000        00000000
 */

Envelope = (function(_super) {
  __extends(Envelope, _super);

  function Envelope() {
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.setRel = __bind(this.setRel, this);
    this.paramValuesAtConnector = __bind(this.paramValuesAtConnector, this);
    this.init = __bind(this.init, this);
    return Envelope.__super__.constructor.apply(this, arguments);
  }

  Envelope.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      type: 'envelope',
      valueFormat: "%0.3f",
      numHandles: 7,
      height: 220,
      width: 300,
      minWidth: 240
    });
    Envelope.__super__.init.call(this, cfg, {
      title: 'envelope',
      children: [
        {
          type: 'pad',
          "class": 'envelope_pad',
          numHandles: cfg.numHandles,
          vals: cfg.vals,
          minHeight: 50,
          minWidth: 150
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'envelope_in:setValue'
            }, {
              type: 'spin',
              "class": 'envelope_in',
              tooltip: 'input',
              valueStep: 0.001,
              minWidth: 100,
              maxWidth: 10000,
              format: cfg.valueFormat,
              style: {
                width: '50%'
              }
            }, {
              type: 'spin',
              "class": 'envelope',
              tooltip: 'output',
              valueStep: 0.00001,
              minWidth: 100,
              maxWidth: 10000,
              format: cfg.valueFormat,
              style: {
                width: '50%'
              }
            }, {
              type: 'connector',
              signal: 'envelope:onValue'
            }
          ]
        }
      ]
    });
    this.connect('envelope_in:onValue', this.setRel);
    this.pad = this.getChild('envelope_pad');
    return this;
  };

  Envelope.prototype.paramValuesAtConnector = function(paramValues, connector) {
    var v, _i, _len, _ref;
    if (paramValues.duration != null) {
      paramValues.values = [];
      _ref = this.pad.config.vals;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        paramValues.values.push({
          time: v.x * paramValues.duration,
          value: v.y
        });
      }
      return Audio.sendParamValuesFromConnector(paramValues, this.connector("envelope:onValue"));
    }
  };

  Envelope.prototype.setRel = function(rel) {
    this.config.reltime = _.value(rel);
    this.config.value = this.pad.valAtRel(this.config.reltime);
    if (this.config.reltime === 0) {
      this.pad.hideRuler();
    } else {
      this.pad.showRuler(this.config.reltime, this.config.value);
    }
    return this.getChild('envelope').setValue(this.config.value);
  };

  Envelope.prototype.sizeWindow = function() {
    var content, height, pad, width;
    pad = this.getChild('pad');
    if (pad != null) {
      content = this.getChild('content');
      content.setHeight(this.contentHeight());
      height = content.innerHeight() - 60;
      width = content.innerWidth() - 20;
      return pad.setSize(width, height);
    }
  };

  Envelope.menu = function() {
    return Envelope.menuButton({
      text: 'envelope',
      icon: 'octicon-pulse',
      action: function() {
        return new Envelope({
          center: true
        });
      }
    });
  };

  return Envelope;

})(Window);


/*

00000000  000  000      000000000  00000000  00000000 
000       000  000         000     000       000   000
000000    000  000         000     0000000   0000000  
000       000  000         000     000       000   000
000       000  0000000     000     00000000  000   000
 */

Filter = (function(_super) {
  __extends(Filter, _super);

  function Filter() {
    this.setFilter = __bind(this.setFilter, this);
    this.setFrequency = __bind(this.setFrequency, this);
    this.setQ = __bind(this.setQ, this);
    this.setDetune = __bind(this.setDetune, this);
    this.init = __bind(this.init, this);
    return Filter.__super__.constructor.apply(this, arguments);
  }

  Filter.filters = ['bandpass', 'lowpass', 'highpass', 'notch', 'allpass'];

  Filter.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      filter: Filter.filters[0]
    });
    _ref = Audio.filter(cfg), this.audio = _ref[0], cfg = _ref[1];
    Filter.__super__.init.call(this, cfg, {
      type: 'filter',
      title: 'filter',
      resize: 'horizontal',
      children: [
        {
          type: 'jacks'
        }, {
          type: 'spinner',
          "class": 'filter',
          tooltip: 'filter',
          value: cfg.filter,
          values: Filter.filters
        }, {
          type: 'sliderspin',
          "class": 'frequency',
          tooltip: 'frequency',
          value: cfg.frequency,
          minValue: cfg.minFrequency,
          maxValue: cfg.maxFrequency
        }, {
          type: 'sliderspin',
          "class": 'detune',
          tooltip: 'detune',
          value: cfg.detune,
          minValue: cfg.minDetune,
          maxValue: cfg.maxDetune
        }, {
          type: 'sliderspin',
          "class": 'Q',
          tooltip: 'Q',
          value: cfg.Q,
          minValue: cfg.minQ,
          maxValue: cfg.maxQ,
          spinStep: 0.01
        }
      ]
    });
    this.connect('filter:onValue', this.setFilter);
    this.connect('frequency:onValue', this.setFrequency);
    this.connect('detune:onValue', this.setDetune);
    this.connect('Q:onValue', this.setQ);
    this.setQ(this.config.Q);
    this.setFrequency(this.config.frequency);
    this.setDetune(this.config.detune);
    this.setFilter(this.config.filter);
    return this;
  };

  Filter.prototype.setDetune = function(v) {
    this.config.detune = _.value(v);
    return this.audio.detune.value = this.config.detune;
  };

  Filter.prototype.setQ = function(v) {
    this.config.Q = _.value(v);
    return this.audio.Q.value = this.config.Q;
  };

  Filter.prototype.setFrequency = function(v) {
    this.config.frequency = _.value(v);
    return this.audio.frequency.value = this.config.frequency;
  };

  Filter.prototype.setFilter = function(v) {
    this.config.filter = _.isString(v) ? v : _.value(v);
    return this.audio.type = this.config.filter;
  };

  Filter.menu = function() {
    return Filter.menuButton({
      text: 'filter',
      icon: 'fa-filter',
      action: function() {
        return new Filter({
          center: true
        });
      }
    });
  };

  return Filter;

})(AudioWindow);


/*

 0000000    0000000   000  000   000
000        000   000  000  0000  000
000  0000  000000000  000  000 0 000
000   000  000   000  000  000  0000
 0000000   000   000  000  000   000
 */

Gain = (function(_super) {
  __extends(Gain, _super);

  function Gain() {
    this.paramValuesAtConnector = __bind(this.paramValuesAtConnector, this);
    this.setValue = __bind(this.setValue, this);
    this.setGain = __bind(this.setGain, this);
    this.init = __bind(this.init, this);
    return Gain.__super__.constructor.apply(this, arguments);
  }

  Gain.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    _ref = Audio.gain(cfg), this.audio = _ref[0], cfg = _ref[1];
    Gain.__super__.init.call(this, cfg, {
      type: 'gain',
      title: cfg.master && 'master' || 'gain',
      resize: 'horizontal',
      children: [
        {
          type: 'jacks',
          hasOutput: cfg.master == null
        }, {
          type: 'sliderspin',
          "class": 'gain',
          tooltip: 'gain',
          value: cfg.gain,
          minValue: 0.0,
          maxValue: 1.0
        }
      ]
    });
    this.connect('gain:onValue', this.setGain);
    this.setGain(this.config.gain);
    return this;
  };

  Gain.prototype.setGain = function(v) {
    this.config.gain = _.value(v);
    return this.audio.gain.value = this.config.gain;
  };

  Gain.prototype.setValue = function(v) {
    return this.setGain(v);
  };

  Gain.prototype.paramValuesAtConnector = function(paramValues, connector) {
    return Audio.setValuesForParam(paramValues, this.audio.gain);
  };

  Gain.menu = function() {
    Gain.menuButton({
      text: 'gain',
      icon: 'fa-volume-up',
      action: function() {
        return new Gain({
          center: true,
          gain: 0.5
        });
      }
    });
    return Gain.menuButton({
      text: 'master',
      icon: 'fa-sign-out',
      action: function() {
        return new Gain({
          center: true,
          master: true,
          gain: 0.1
        });
      }
    });
  };

  return Gain;

})(AudioWindow);


/*

      000   0000000    0000000  000   000   0000000
      000  000   000  000       000  000   000     
      000  000000000  000       0000000    0000000 
000   000  000   000  000       000  000        000
 0000000   000   000   0000000  000   000  0000000
 */

Jacks = (function(_super) {
  __extends(Jacks, _super);

  function Jacks() {
    this.onDisconnect = __bind(this.onDisconnect, this);
    this.onConnect = __bind(this.onConnect, this);
    this.init = __bind(this.init, this);
    return Jacks.__super__.constructor.apply(this, arguments);
  }

  Jacks.prototype.init = function(cfg, defs) {
    var children;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      type: 'jacks'
    });
    children = [];
    if (cfg.hasInput !== false) {
      children.push({
        type: 'connector',
        "in": 'audio'
      });
    }
    children.push({
      type: 'jack_content',
      style: {
        width: '100%',
        height: '20px'
      },
      children: _.isArray(cfg.content) ? cfg.content : void 0,
      child: _.isObject(cfg.content) ? cfg.content : void 0
    });
    if (cfg.hasOutput !== false) {
      children.push({
        type: 'connector',
        out: 'audio'
      });
    }
    Jacks.__super__.init.call(this, cfg, {
      children: children
    });
    this.connect('out:onConnect', this.onConnect);
    this.connect('out:onDisconnect', this.onDisconnect);
    return this;
  };

  Jacks.prototype.onConnect = function(event) {
    return event.detail.source.getWindow().audio.connect(event.detail.target.getWindow().audio);
  };

  Jacks.prototype.onDisconnect = function(event) {
    var _ref;
    log({
      "file": "./coffee/audio/jacks.coffee",
      "class": "Jacks",
      "line": 50,
      "args": ["event"],
      "method": "onDisconnect",
      "type": "."
    }, 'onDisconnect', "<span class='console-type'>event.detail:</span>", event.detail);
    return (_ref = event.detail.source.getWindow().audio) != null ? _ref.disconnect(event.detail.target.getWindow().audio) : void 0;
  };

  return Jacks;

})(Hbox);


/*

000   000  00000000  000   000  0000000     0000000    0000000   00000000   0000000  
000  000   000        000 000   000   000  000   000  000   000  000   000  000   000
0000000    0000000     00000    0000000    000   000  000000000  0000000    000   000
000  000   000          000     000   000  000   000  000   000  000   000  000   000
000   000  00000000     000     0000000     0000000   000   000  000   000  0000000
 */

Keyboard = (function(_super) {
  __extends(Keyboard, _super);

  function Keyboard() {
    this.onKeyRelease = __bind(this.onKeyRelease, this);
    this.onKeyPress = __bind(this.onKeyPress, this);
    this.setOctave = __bind(this.setOctave, this);
    this.octaveDown = __bind(this.octaveDown, this);
    this.octaveUp = __bind(this.octaveUp, this);
    this.init = __bind(this.init, this);
    return Keyboard.__super__.constructor.apply(this, arguments);
  }

  Keyboard.noteNames = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

  Keyboard.notes = {
    C: 4186.01,
    Cs: 4434.92,
    D: 4698.63,
    Ds: 4978.03,
    E: 5274.04,
    F: 5587.65,
    Fs: 5919.91,
    G: 6271.93,
    Gs: 6644.88,
    A: 7040.00,
    As: 7458.62,
    B: 7902.13
  };

  Keyboard.keys = {
    C: 'z',
    Cs: 's',
    D: 'x',
    Ds: 'd',
    E: 'c',
    F: 'v',
    Fs: 'g',
    G: 'b',
    Gs: 'h',
    A: 'n',
    As: 'j',
    B: 'm'
  };

  Keyboard.allNotes = function() {
    var frequency, n, nb, o, _i, _len, _ref;
    if (Keyboard._allNotes == null) {
      Keyboard._allNotes = {};
      _ref = Keyboard.allNoteNames();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        n = _ref[_i];
        nb = n.slice(0, -1);
        o = Number(n.slice(-1));
        frequency = Keyboard.notes[nb] / Math.pow(2, 8 - o);
        Keyboard._allNotes[n] = frequency.toFixed(3);
      }
    }
    return Keyboard._allNotes;
  };

  Keyboard.noteIndex = function(noteName) {
    return Keyboard.allNoteNames().indexOf(noteName);
  };

  Keyboard.numNotes = function() {
    return Keyboard.noteNames.length * 9;
  };

  Keyboard.maxNoteIndex = function() {
    return Keyboard.numNotes() - 1;
  };

  Keyboard.allNoteNames = function() {
    var n, o, _i, _j, _len, _ref;
    if (Keyboard._allNoteNames == null) {
      Keyboard._allNoteNames = [];
      for (o = _i = 0; _i <= 8; o = ++_i) {
        _ref = Keyboard.noteNames;
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          n = _ref[_j];
          Keyboard._allNoteNames.push('%s%d'.fmt(n, o));
        }
      }
    }
    return Keyboard._allNoteNames;
  };

  Keyboard.prototype.init = function(cfg, defs) {
    var children, key, n, sharp, v, _i, _len, _ref, _ref1;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      octave: 4
    });
    children = [];
    _ref = Keyboard.notes;
    for (n in _ref) {
      v = _ref[n];
      sharp = n.length === 2;
      children.push({
        type: 'button',
        "class": sharp && 'keyboard-key-sharp' || 'keyboard-key',
        valign: sharp && 'top' || 'bottom',
        text: n,
        keys: [Keyboard.keys[n]]
      });
    }
    Keyboard.__super__.init.call(this, cfg, {
      type: 'keyboard',
      title: 'keyboard',
      resize: false,
      children: [
        {
          type: 'hbox',
          children: [
            {
              type: 'spin',
              "class": 'octave',
              tooltip: 'octave',
              value: cfg.octave,
              minValue: 0,
              maxValue: 8,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              signal: 'note'
            }
          ]
        }, {
          type: 'hbox',
          "class": 'keys',
          noMove: true,
          spacing: 0,
          children: children
        }
      ]
    });
    this.keys = this.getChild('keys').allChildren();
    _ref1 = this.keys;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      key = _ref1[_i];
      key.connect('trigger', this.onKeyPress);
      key.connect('release', this.onKeyRelease);
    }
    Keys.add(',', this.octaveDown);
    Keys.add('.', this.octaveUp);
    this.connect('octave:onValue', this.setOctave);
    this.setOctave(this.config.octave);
    return this;
  };

  Keyboard.prototype.octaveUp = function() {
    return this.getChild('octave').incr('+');
  };

  Keyboard.prototype.octaveDown = function() {
    return this.getChild('octave').incr('-');
  };

  Keyboard.prototype.setOctave = function(v) {
    var key, _i, _len, _ref, _results;
    this.config.octave = _.value(v);
    _ref = this.keys;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _results.push(key.config.octave = this.config.octave);
    }
    return _results;
  };

  Keyboard.prototype.onKeyPress = function(event) {
    var key, note;
    key = event.target.widget;
    note = "%s%d".fmt(key.config.text, this.config.octave);
    return this.emit('note', {
      noteName: note,
      event: 'trigger'
    });
  };

  Keyboard.prototype.onKeyRelease = function(event) {
    var key, note;
    key = event.target.widget;
    note = "%s%d".fmt(key.config.text, this.config.octave);
    return this.emit('note', {
      noteName: note,
      event: 'release'
    });
  };

  Keyboard.menu = function() {
    return Keyboard.menuButton({
      text: 'Keyboard',
      icon: 'fa-music',
      action: function() {
        return new Keyboard({
          center: true
        });
      }
    });
  };

  return Keyboard;

})(Window);


/*

 0000000    0000000   0000000  000  000      000       0000000   000000000   0000000   00000000 
000   000  000       000       000  000      000      000   000     000     000   000  000   000
000   000  0000000   000       000  000      000      000000000     000     000   000  0000000  
000   000       000  000       000  000      000      000   000     000     000   000  000   000
 0000000   0000000    0000000  000  0000000  0000000  000   000     000      0000000   000   000
 */

Oscillator = (function(_super) {
  __extends(Oscillator, _super);

  function Oscillator() {
    this.paramValuesAtConnector = __bind(this.paramValuesAtConnector, this);
    this.setShape = __bind(this.setShape, this);
    this.setFrequency = __bind(this.setFrequency, this);
    this.init = __bind(this.init, this);
    return Oscillator.__super__.constructor.apply(this, arguments);
  }

  Oscillator.shapes = ['sine', 'triangle', 'sawtooth', 'square'];

  Oscillator.prototype.init = function(cfg, defs) {
    var _ref;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      shape: Oscillator.shapes[0]
    });
    _ref = Audio.oscillator(cfg), this.audio = _ref[0], cfg = _ref[1];
    Oscillator.__super__.init.call(this, cfg, {
      type: 'oscillator',
      title: 'oscillator',
      resize: 'horizontal',
      children: [
        {
          type: 'jacks',
          hasInput: false,
          content: {
            type: 'spinner',
            "class": 'shape',
            recKey: 'shape',
            tooltip: 'shape',
            value: cfg.shape,
            values: Oscillator.shapes
          }
        }, {
          type: 'sliderspin',
          "class": 'frequency',
          tooltip: 'frequency',
          value: cfg.frequency,
          minValue: cfg.minFrequency,
          maxValue: cfg.maxFrequency
        }
      ]
    });
    this.connect('shape:onValue', this.setShape);
    this.connect('frequency:onValue', this.setFrequency);
    this.setFrequency(this.config.frequency);
    this.setShape(this.config.shape);
    return this;
  };

  Oscillator.prototype.setFrequency = function(v) {
    this.config.frequency = _.value(v);
    return this.audio.frequency.value = this.config.frequency;
  };

  Oscillator.prototype.setShape = function(v) {
    this.config.shape = _.isString(v) ? v : _.value(v);
    return this.audio.type = this.config.shape;
  };

  Oscillator.prototype.paramValuesAtConnector = function(paramValues, connector) {
    return Audio.setValuesForParam(paramValues, this.audio.frequency);
  };

  Oscillator.menu = function() {
    return Oscillator.menuButton({
      text: 'oscillator',
      icon: 'fa-circle-o-notch',
      action: function() {
        return new Oscillator({
          center: true
        });
      }
    });
  };

  return Oscillator;

})(AudioWindow);


/*

00000000    0000000   00     00  00000000 
000   000  000   000  000   000  000   000
0000000    000000000  000000000  00000000 
000   000  000   000  000 0 000  000      
000   000  000   000  000   000  000
 */

Ramp = (function(_super) {
  __extends(Ramp, _super);

  function Ramp() {
    this.setRelTime = __bind(this.setRelTime, this);
    this.anim = __bind(this.anim, this);
    this.trigger = __bind(this.trigger, this);
    this.setDuration = __bind(this.setDuration, this);
    this.init = __bind(this.init, this);
    return Ramp.__super__.constructor.apply(this, arguments);
  }

  Ramp.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      duration: 2.0,
      minDuration: 0.01,
      maxDuration: 10.0,
      durationStep: 0.01,
      valueFormat: "%1.3f",
      resize: 'horizontal'
    });
    Ramp.__super__.init.call(this, cfg, {
      type: 'ramp',
      title: 'ramp',
      children: [
        {
          type: 'sliderspin',
          "class": 'ramp',
          minValue: 0.0,
          maxValue: 1.0
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
          type: 'button',
          text: 'trigger',
          "class": 'trigger'
        }
      ]
    });
    this.connect('duration:onValue', this.setDuration);
    this.connect('trigger:trigger', this.trigger);
    return this;
  };

  Ramp.prototype.setDuration = function(v) {
    return this.config.duration = _.value(v);
  };

  Ramp.prototype.trigger = function(event) {
    if (this.config.reltime !== 0) {
      knix.deanimate(this);
    }
    Audio.sendParamValuesFromConnector({
      duration: this.config.duration
    }, this.connector('ramp:onValue'));
    this.setRelTime(0);
    if ((event.detail != null) && event.detail.metaKey) {
      return knix.animate(this);
    }
  };

  Ramp.prototype.anim = function(step) {
    this.setRelTime(this.config.reltime + step.dsecs / this.config.duration);
    if (this.config.reltime > 1.0) {
      knix.deanimate(this);
      return this.setRelTime(0);
    }
  };

  Ramp.prototype.setRelTime = function(rel) {
    this.config.reltime = rel;
    this.config.value = this.config.reltime;
    return this.getChild('ramp').setValue(this.config.value);
  };

  Ramp.menu = function() {
    return Ramp.menuButton({
      text: 'ramp',
      icon: 'fa-external-link-square',
      action: function() {
        return new Ramp({
          center: true
        });
      }
    });
  };

  return Ramp;

})(Window);


/*

00000000   00000000   0000000   0000000   00000000   0000000    00000000  00000000 
000   000  000       000       000   000  000   000  000   000  000       000   000
0000000    0000000   000       000   000  0000000    000   000  0000000   0000000  
000   000  000       000       000   000  000   000  000   000  000       000   000
000   000  00000000   0000000   0000000   000   000  0000000    00000000  000   000
 */

Recorder = (function() {
  function Recorder(cfg, defs) {
    this.close = __bind(this.close, this);
    this.onButtonUp = __bind(this.onButtonUp, this);
    this.onButtonDown = __bind(this.onButtonDown, this);
    this.onNote = __bind(this.onNote, this);
    this.onValueInput = __bind(this.onValueInput, this);
    this.registerWindow = __bind(this.registerWindow, this);
    this.init = __bind(this.init, this);
    this.init(cfg, defs);
  }

  Recorder.prototype.init = function(cfg, defs) {
    var win, _i, _len, _ref;
    this.config = _.def(cfg, defs);
    this.timeline = $(this.config.timeline).getWidget();
    this.triggers = [];
    this.values = [];
    _ref = knix.allWindows();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      win = _ref[_i];
      this.registerWindow(win);
    }
    log({
      "file": "./coffee/audio/recorder.coffee",
      "class": "Recorder",
      "line": 25,
      "args": ["cfg", "defs"],
      "method": "init",
      "type": "."
    }, 'recording: %d triggers %d values'.fmt(this.triggers.length, "<span class='console-type'>@values.length:</span>", this.values.length));
    return this;
  };

  Recorder.prototype.registerWindow = function(win) {
    var c, _i, _len, _ref, _ref1, _ref2, _results;
    if ((_ref = win.constructor.name) === 'Timeline' || _ref === 'Analyser') {
      return;
    }
    _ref1 = win.allChildren();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      c = _ref1[_i];
      if ((_ref2 = c.constructor.name) === 'Spin' || _ref2 === 'Slider' || _ref2 === 'Spinner' || _ref2 === 'Button' || _ref2 === 'ADSR') {
        if (c.config.recKey != null) {
          switch (c.constructor.name) {
            case 'Button':
              if (!c.elem.hasClassName('tool-button')) {
                log({
                  "file": "./coffee/audio/recorder.coffee",
                  "class": "Recorder",
                  "line": 36,
                  "args": ["win"],
                  "method": "registerWindow",
                  "type": "."
                }, "<span class='console-type'>c.config:</span>", c.config);
                this.triggers.push(c);
                c.connect('mousedown', this.onButtonDown);
                _results.push(c.connect('mouseup', this.onButtonUp));
              } else {
                _results.push(void 0);
              }
              break;
            case 'ADSR':
              log({
                "file": "./coffee/audio/recorder.coffee",
                "class": "Recorder",
                "line": 41,
                "args": ["win"],
                "method": "registerWindow",
                "type": "."
              }, 'ADSR');
              _results.push(c.connect('onNote', this.onNote));
              break;
            default:
              this.values.push(c);
              _results.push(c.connect('valueInput', this.onValueInput));
          }
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Recorder.prototype.onValueInput = function(event) {
    return this.timeline.grid.addValue(event.target.getWidget());
  };

  Recorder.prototype.onNote = function(event) {
    return this.timeline.grid.addNote(event);
  };

  Recorder.prototype.onButtonDown = function(event) {
    return this.timeline.grid.addTrigger(event.target);
  };

  Recorder.prototype.onButtonUp = function(event) {
    return this.timeline.grid.addRelease(event.target);
  };

  Recorder.prototype.close = function() {
    var trigger, value, _i, _j, _len, _len1, _ref, _ref1;
    _ref = this.triggers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      trigger = _ref[_i];
      trigger.disconnect('mousedown', this.onButtonDown);
    }
    this.triggers.clear();
    _ref1 = this.values;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      value = _ref1[_j];
      value.disconnect('valueInput', this.onValueInput);
    }
    return this.values.clear();
  };

  return Recorder;

})();

//# sourceMappingURL=audio.js.map
