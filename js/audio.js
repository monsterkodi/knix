
/*

     0000000   000   000  0000000    000   0000000
    000   000  000   000  000   000  000  000   000
    000000000  000   000  000   000  000  000   000
    000   000  000   000  000   000  000  000   000
    000   000   0000000   0000000    000   0000000
 */
var Analyser, Audio, Gain, Oscillator,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    oscillator.frequency.value = 50;
    oscillator.start(0);
    return oscillator;
  };

  Audio.gain = function(cfg) {
    var gain;
    gain = Audio.context.createGain();
    gain.gain.value = 0.0;
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

Analyser = (function() {
  function Analyser(config) {
    if (config == null) {
      config = {};
    }
    this.anim = __bind(this.anim, this);
    this.initWindow = __bind(this.initWindow, this);
    this.analyser = Audio.analyser();
    this.dataArray = new Uint8Array(this.analyser.fftSize);
    this.initWindow(config);
    knix.animate(this);
  }

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

  Analyser.prototype.initWindow = function(cfg) {
    this.window = knix.get(cfg, {
      title: 'analyser',
      child: {
        id: 'analyser_canvas',
        type: 'canvas'
      }
    });
    return this.canvas = this.window.getChild('analyser_canvas').elem;
  };

  Analyser.prototype.anim = function(timestamp) {
    var ctx, cvh, cvw, i, v, x, xd, y, _i, _ref;
    this.analyser.getByteTimeDomainData(this.dataArray);
    ctx = this.canvas.getContext("2d");
    cvw = this.canvas.getWidth();
    cvh = this.canvas.getHeight();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.beginPath();
    xd = cvw * 1.0 / this.analyser.fftSize;
    x = 0;
    for (i = _i = 0, _ref = this.analyser.fftSize; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      v = this.dataArray[i] / 128.0;
      y = v * cvh / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += xd;
    }
    return ctx.stroke();
  };

  return Analyser;

})();


/*

     0000000    0000000   000  000   000
    000        000   000  000  0000  000
    000  0000  000000000  000  000 0 000
    000   000  000   000  000  000  0000
     0000000   000   000  000  000   000
 */

Gain = (function() {
  function Gain(config) {
    if (config == null) {
      config = {};
    }
    this.initWindow = __bind(this.initWindow, this);
    this.gain = Audio.gain(config);
    this.initWindow(config);
  }

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

  Gain.prototype.initWindow = function(cfg) {
    var children;
    children = [
      {
        type: 'connector',
        slot: 'input'
      }, {
        type: 'label',
        text: 'gain',
        style: {
          width: '100%'
        }
      }
    ];
    if (!cfg.master) {
      children.push({
        type: 'connector',
        signal: 'output'
      });
    }
    return this.window = knix.get(cfg, {
      title: cfg.master && 'master' || 'gain',
      minWidth: 150,
      minHeight: 60,
      children: [
        {
          type: 'hbox',
          children: children
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'slider_gain:setValue'
            }, {
              id: 'slider_gain',
              type: 'slider',
              value: 0,
              minValue: 0.0,
              maxValue: 1.0,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              signal: 'slider_gain:onValue'
            }
          ]
        }
      ]
    });
  };

  return Gain;

})();


/*

     0000000    0000000    0000000  000  000       000        0000000  000000000   0000000   00000000
    000   000  000        000       000  000       000       000   000    000     000   000  000   000
    000   000   0000000   000       000  000       000       000000000    000     000   000  0000000
    000   000        000  000       000  000       000       000   000    000     000   000  000   000
     0000000    0000000    0000000  000  000000000 000000000 000   000    000      0000000   000   000
 */

Oscillator = (function() {
  function Oscillator(config) {
    if (config == null) {
      config = {};
    }
    this.initWindow = __bind(this.initWindow, this);
    this.gain = Audio.oscillator();
    this.initWindow(config);
  }

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

  Oscillator.prototype.initWindow = function(cfg) {
    return this.window = knix.get(cfg, {
      title: 'oscillator',
      minWidth: 150,
      minHeight: 60,
      children: [
        {
          type: 'hbox',
          children: [
            {
              type: 'label',
              text: 'oscillator',
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              signal: 'slider_frequency:onValue'
            }
          ]
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'slider_frequency:setValue'
            }, {
              id: 'slider_frequency',
              type: 'slider',
              value: 50,
              minValue: 0,
              maxValue: 18000,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              signal: 'slider_frequency:onValue'
            }
          ]
        }
      ]
    });
  };

  return Oscillator;

})();

//# sourceMappingURL=audio.js.map
