
/*

     0000000   000   000  0000000    000   0000000
    000   000  000   000  000   000  000  000   000
    000000000  000   000  000   000  000  000   000
    000   000  000   000  000   000  000  000   000
    000   000   0000000   0000000    000   0000000
 */
var Analyser, Audio, Gain, Jacks, Oscillator,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Audio = (function() {
  function Audio() {}

  Audio.init = function() {
    Audio.context = new (window.AudioContext || window.webkitAudioContext)();
    Oscillator.menu();
    Analyser.menu();
    return Gain.menu();
  };

  Audio.oscillator = function(cfg) {
    var oscillator;
    oscillator = Audio.context.createOscillator();
    oscillator.frequency.value = cfg.freq || 440;
    oscillator.start(0);
    return oscillator;
  };

  Audio.gain = function(cfg) {
    var gain;
    gain = Audio.context.createGain();
    gain.gain.value = (cfg.gain != null) && cfg.gain || 0.0;
    if (cfg.master) {
      gain.connect(Audio.context.destination);
    }
    return gain;
  };

  Audio.analyser = function(cfg) {
    var analyser;
    analyser = Audio.context.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 2048;
    return analyser;
  };

  return Audio;

})();


/*

     0000000   000   000   0000000   000      000   000  0000000   00000000  00000000
    000   000  0000  000  000   000  000       000 000  000        000       000   000
    000000000  000 0 000  000000000  000        00000    0000000   0000000   0000000
    000   000  000  0000  000   000  000         000          000  000       000   000
    000   000  000   000  000   000  000000000   000     0000000   00000000  000   000
 */

Analyser = (function(_super) {
  __extends(Analyser, _super);

  function Analyser(cfg, defs) {
    this.anim = __bind(this.anim, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.setTriggerY = __bind(this.setTriggerY, this);
    this.setScaleY = __bind(this.setScaleY, this);
    this.setScaleX = __bind(this.setScaleX, this);
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      scaleX: 1.0,
      scaleY: 1.0,
      triggerY: 0.0
    });
    this.audio = this.analyser = Audio.analyser();
    this.dataArray = new Uint8Array(this.analyser.fftSize);
    Analyser.__super__.constructor.call(this, cfg, {
      title: 'analyser',
      children: [
        {
          type: 'jacks',
          audio: this.audio
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
          onValue: this.setScaleX,
          minValue: 1.0,
          maxValue: 20.0,
          valueStep: 1
        }, {
          type: 'sliderspin',
          id: 'triggerY',
          value: cfg.triggerY,
          onValue: this.setTriggerY,
          minValue: -1.0,
          maxValue: 1.0,
          spinStep: 0.01
        }
      ]
    });
    this.canvas = this.getChild('analyser_canvas');
    knix.animate(this);
    this.sizeWindow();
  }

  Analyser.prototype.setScaleX = function(a) {
    return this.config.scaleX = _.arg(a);
  };

  Analyser.prototype.setScaleY = function(a) {
    return this.config.scaleY = _.arg(a);
  };

  Analyser.prototype.setTriggerY = function(a) {
    return this.config.triggerY = _.arg(a);
  };

  Analyser.prototype.sizeWindow = function() {
    var content, hbox, height, width;
    hbox = this.getChild('hbox');
    height = this.contentHeight();
    content = this.getChild('content');
    content.setHeight(height);
    height = content.innerHeight() - 90;
    this.canvas.setHeight(height);
    width = content.innerWidth() - 20;
    this.canvas.elem.width = width;
    this.canvas.elem.height = height;
    return this.dataArray = new Uint8Array(2 * width);
  };

  Analyser.menu = function() {
    return knix.create({
      type: 'button',
      id: 'new_analyser',
      icon: 'octicon-pulse',
      "class": 'tool-button',
      parent: 'menu',
      onClick: function() {
        return new Analyser({
          center: true
        });
      }
    });
  };

  Analyser.prototype.anim = function(timestamp) {
    var ctx, cvh, cvs, cvw, i, samples, t, th, v, x, xd, y, _i;
    this.analyser.getByteTimeDomainData(this.dataArray);
    cvs = this.canvas.elem;
    ctx = cvs.getContext("2d");
    cvw = cvs.getWidth();
    cvh = cvs.getHeight();
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(0, 0, cvw, cvh);
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.strokeRect(0, 0, cvw, cvh);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(100,0,0,0.4)';
    th = cvh * (0.5 - this.config.triggerY / 2);
    ctx.moveTo(0, th);
    ctx.lineTo(cvw, th);
    ctx.stroke();
    ctx.strokeStyle = 'rgb(255,200,0)';
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

})(Window);


/*

     0000000    0000000   000  000   000
    000        000   000  000  0000  000
    000  0000  000000000  000  000 0 000
    000   000  000   000  000  000  0000
     0000000   000   000  000  000   000
 */

Gain = (function(_super) {
  __extends(Gain, _super);

  function Gain(config) {
    if (config == null) {
      config = {};
    }
    this.setValue = __bind(this.setValue, this);
    this.audio = Audio.gain(config);
    Gain.__super__.constructor.call(this, config, {
      title: config.master && 'master' || 'gain',
      minWidth: 240,
      minHeight: 60,
      children: [
        {
          type: 'jacks',
          audio: this.audio,
          hasOutput: config.master == null
        }, {
          type: 'sliderspin',
          id: 'gain',
          value: this.audio.gain.value,
          onValue: this.setValue,
          minValue: 0.0,
          maxValue: 1.0
        }
      ]
    });
  }

  Gain.prototype.setValue = function(arg) {
    return this.audio.gain.value = _.arg(arg);
  };

  Gain.menu = function() {
    knix.create({
      type: 'button',
      id: 'new_gain',
      icon: 'octicon-dashboard',
      "class": 'tool-button',
      parent: 'menu',
      onClick: function() {
        return new Gain({
          center: true
        });
      }
    });
    return knix.create({
      type: 'button',
      id: 'new_master',
      icon: 'octicon-unmute',
      "class": 'tool-button',
      parent: 'menu',
      onClick: function() {
        return new Gain({
          center: true,
          master: true
        });
      }
    });
  };

  return Gain;

})(Window);


/*

          000   0000000    0000000  000   000   0000000
          000  000   000  000       000  000   000
          000  000000000  000       0000000     0000000
    000   000  000   000  000       000  000         000
     0000000   000   000   0000000  000   000   0000000
 */

Jacks = (function(_super) {
  __extends(Jacks, _super);

  function Jacks(cfg, defs) {
    var children;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      onConnect: function(source, target) {
        return source.config.audio.connect(target.config.audio);
      },
      onDisconnect: function(source, target) {
        return source.config.audio.disconnect(target.config.audio);
      }
    });
    children = [];
    if (!(cfg.hasInput === false)) {
      children.push({
        type: 'connector',
        "in": 'audio',
        audio: cfg.audio
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
        out: 'audio',
        audio: cfg.audio,
        onConnect: cfg.onConnect,
        onDisconnect: cfg.onDisconnect
      });
    }
    Jacks.__super__.constructor.call(this, cfg, {
      children: children
    });
  }

  return Jacks;

})(Hbox);


/*

     0000000    0000000    0000000  000  000       000        0000000  000000000   0000000   00000000
    000   000  000        000       000  000       000       000   000    000     000   000  000   000
    000   000   0000000   000       000  000       000       000000000    000     000   000  0000000
    000   000        000  000       000  000       000       000   000    000     000   000  000   000
     0000000    0000000    0000000  000  000000000 000000000 000   000    000      0000000   000   000
 */

Oscillator = (function(_super) {
  __extends(Oscillator, _super);

  Oscillator.shapes = ['sine', 'triangle', 'sawtooth', 'square'];

  function Oscillator(config) {
    var cfg;
    if (config == null) {
      config = {};
    }
    this.setShape = __bind(this.setShape, this);
    this.setFreq = __bind(this.setFreq, this);
    cfg = _.def(config, {
      freq: 0,
      minFreq: 0,
      maxFreq: 14000
    });
    this.audio = Audio.oscillator(cfg);
    Oscillator.__super__.constructor.call(this, cfg, {
      title: 'oscillator',
      minWidth: 150,
      minHeight: 60,
      children: [
        {
          type: 'jacks',
          audio: this.audio,
          hasInput: false
        }, {
          type: 'sliderspin',
          id: 'frequency',
          value: cfg.freq,
          minValue: cfg.minFreq,
          maxValue: cfg.maxFreq,
          onValue: this.setFreq
        }, {
          type: 'sliderspin',
          id: 'shape',
          value: (cfg.shape != null) && Oscillator.shapes.indexOf(cfg.shape) || 0,
          minValue: 0,
          maxValue: 3,
          sliderStep: 1,
          sliderKnob: true,
          onValue: this.setShape
        }
      ]
    });
    if (cfg.shape != null) {
      this.setShape(Oscillator.shapes.indexOf(cfg.shape));
    }
  }

  Oscillator.prototype.setFreq = function(arg) {
    return this.audio.frequency.value = _.arg(arg);
  };

  Oscillator.prototype.setShape = function(arg) {
    return this.audio.type = Oscillator.shapes[_.arg(arg)];
  };

  Oscillator.menu = function() {
    return knix.create({
      type: 'button',
      id: 'new_oscillator',
      icon: 'octicon-sync',
      "class": 'tool-button',
      parent: 'menu',
      onClick: function() {
        return new Oscillator({
          center: true
        });
      }
    });
  };

  return Oscillator;

})(Window);

//# sourceMappingURL=audio.js.map
