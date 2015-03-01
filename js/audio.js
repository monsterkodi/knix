
/*

 0000000   000   000  0000000    000   0000000 
000   000  000   000  000   000  000  000   000
000000000  000   000  000   000  000  000   000
000   000  000   000  000   000  000  000   000
000   000   0000000   0000000    000   0000000
 */
var Analyser, Audio, AudioWindow, Delay, Envelope, Filter, Gain, Jacks, Oscillator, Ramp,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Audio = (function() {
  function Audio() {}

  Audio.init = function() {
    Audio.context = new (window.AudioContext || window.webkitAudioContext)();
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
      _results.push(connection.config.target.getWindow().paramValuesAtConnector(paramValues, connection.config.target));
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
      freq: 440,
      minFreq: 100,
      maxFreq: 12000,
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
    filter.frequency.value = cfg.freq;
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
      freq: 0,
      minFreq: 0,
      maxFreq: 14000
    });
    oscillator = Audio.context.createOscillator();
    oscillator.frequency.value = cfg.freq;
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
    return AudioWindow.__super__.constructor.apply(this, arguments);
  }

  AudioWindow.prototype.close = function() {
    this.audio = Audio.destroy(this.audio);
    return AudioWindow.__super__.close.apply(this, arguments);
  };

  return AudioWindow;

})(Window);


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
      triggerY: 0.0
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
          id: 'analyser_canvas',
          type: 'canvas',
          style: {
            width: '100%',
            height: '100%'
          }
        }, {
          type: 'sliderspin',
          id: 'scaleX',
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
    this.sizeWindow();
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
    height = content.innerHeight() - 70;
    width = content.innerWidth() - 20;
    if ((_ref = this.canvas) != null) {
      _ref.resize(width, height);
    }
    return this.dataArray = new Uint8Array(2 * width);
  };

  Analyser.menu = function() {
    return Analyser.menuButton({
      text: 'analyser',
      icon: 'octicon-diff-modified',
      action: function() {
        return new Analyser({
          center: true
        });
      }
    });
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
      minWidth: 240,
      resize: 'horizontal',
      children: [
        {
          type: 'jacks'
        }, {
          type: 'sliderspin',
          id: 'delay',
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
      numHandles: 10
    });
    Envelope.__super__.init.call(this, cfg, {
      title: 'envelope',
      children: [
        {
          type: 'pad',
          id: 'envelope_pad',
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
              id: 'envelope_in',
              valueStep: 0.001,
              minWidth: 100,
              maxWidth: 10000,
              format: cfg.valueFormat,
              style: {
                width: '50%'
              }
            }, {
              type: 'spin',
              id: 'envelope',
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
    this.sizeWindow();
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
      height = content.innerHeight() - 50;
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
    this.setFreq = __bind(this.setFreq, this);
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
      minWidth: 240,
      resize: 'horizontal',
      children: [
        {
          type: 'jacks'
        }, {
          type: 'spinner',
          id: 'filter',
          value: cfg.filter,
          values: Filter.filters
        }, {
          type: 'sliderspin',
          id: 'frequency',
          value: cfg.freq,
          minValue: cfg.minFreq,
          maxValue: cfg.maxFreq
        }, {
          type: 'sliderspin',
          id: 'detune',
          value: cfg.detune,
          minValue: cfg.minDetune,
          maxValue: cfg.maxDetune
        }, {
          type: 'sliderspin',
          id: 'Q',
          value: cfg.Q,
          minValue: cfg.minQ,
          maxValue: cfg.maxQ,
          spinStep: 0.01
        }
      ]
    });
    this.connect('filter:onValue', this.setFilter);
    this.connect('frequency:onValue', this.setFreq);
    this.connect('detune:onValue', this.setDetune);
    this.connect('Q:onValue', this.setQ);
    this.setQ(this.config.Q);
    this.setFreq(this.config.freq);
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

  Filter.prototype.setFreq = function(v) {
    this.config.freq = _.value(v);
    return this.audio.frequency.value = this.config.freq;
  };

  Filter.prototype.setFilter = function(v) {
    this.config.filter = _.isString(v) ? v : _.value(v);
    return this.audio.type = this.config.filter;
  };

  Filter.menu = function() {
    return Filter.menuButton({
      text: 'filter',
      icon: 'octicon-gear',
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
      minWidth: 240,
      resize: 'horizontal',
      children: [
        {
          type: 'jacks',
          hasOutput: cfg.master == null
        }, {
          type: 'sliderspin',
          id: 'gain',
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
      icon: 'octicon-dashboard',
      action: function() {
        return new Gain({
          center: true
        });
      }
    });
    return Gain.menuButton({
      text: 'master',
      icon: 'octicon-unmute',
      ection: function() {
        return new Gain({
          center: true,
          master: true
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
    if (!(cfg.hasInput === false)) {
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
      children: cfg.children
    });
    if (!(cfg.hasOutput === false)) {
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
    tag('Connection');
    log({
      "file": "./coffee/audio/jacks.coffee",
      "class": "Jacks",
      "line": 50,
      "args": ["event"],
      "method": "onDisconnect",
      "type": "."
    }, 'onDisconnect', event.detail);
    return event.detail.source.getWindow().audio.disconnect(event.detail.target.getWindow().audio);
  };

  return Jacks;

})(Hbox);


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
    this.setFreq = __bind(this.setFreq, this);
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
      minWidth: 220,
      resize: 'horizontal',
      children: [
        {
          type: 'jacks',
          hasInput: false
        }, {
          type: 'spinner',
          id: 'shape',
          value: cfg.shape,
          values: Oscillator.shapes
        }, {
          type: 'sliderspin',
          id: 'frequency',
          value: cfg.freq,
          minValue: cfg.minFreq,
          maxValue: cfg.maxFreq
        }
      ]
    });
    this.connect('shape:onValue', this.setShape);
    this.connect('frequency:onValue', this.setFreq);
    this.setFreq(this.config.freq);
    this.setShape(this.config.shape);
    this.sizeWindow();
    return this;
  };

  Oscillator.prototype.setFreq = function(v) {
    this.config.freq = _.value(v);
    return this.audio.frequency.value = this.config.freq;
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
      icon: 'octicon-sync',
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
    this.triggerDown = __bind(this.triggerDown, this);
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
      valueFormat: "%0.3f",
      resize: 'horizontal'
    });
    Ramp.__super__.init.call(this, cfg, {
      type: 'ramp',
      title: 'ramp',
      children: [
        {
          type: 'sliderspin',
          id: 'ramp',
          minValue: 0.0,
          maxValue: 1.0
        }, {
          type: 'sliderspin',
          id: 'ramp_duration',
          value: cfg.duration,
          minValue: cfg.minDuration,
          maxValue: cfg.maxDuration,
          spinStep: cfg.durationStep
        }, {
          type: 'button',
          text: 'trigger'
        }
      ]
    });
    this.connect('ramp_duration:onValue', this.setDuration);
    this.connect('button:mousedown', this.triggerDown);
    return this;
  };

  Ramp.prototype.setDuration = function(v) {
    return this.config.duration = _.value(v);
  };

  Ramp.prototype.triggerDown = function() {
    if (this.config.reltime !== 0) {
      knix.deanimate(this);
    }
    Audio.sendParamValuesFromConnector({
      duration: this.config.duration
    }, this.connector('ramp:onValue'));
    this.setRelTime(0);
    return knix.animate(this);
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
      icon: 'octicon-playback-play',
      action: function() {
        return new Ramp({
          center: true
        });
      }
    });
  };

  return Ramp;

})(Window);

//# sourceMappingURL=audio.js.map
