
/*

000   000   0000000   000      000   000  00000000
000   000  000   000  000      000   000  000     
 000 000   000000000  000      000   000  0000000 
   000     000   000  000      000   000  000     
    0      000   000  0000000   0000000   00000000
 */
var About, Button, Canvas, Connection, Connector, Console, Files, Handle, Hbox, Icon, Input, Pad, Path, Range, Slider, Sliderspin, Spin, Spinner, Svg, Toggle, Tooltip, Value, tag,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Value = (function(_super) {
  __extends(Value, _super);

  function Value() {
    this.round = __bind(this.round, this);
    this.clamp = __bind(this.clamp, this);
    this.steps = __bind(this.steps, this);
    this.range = __bind(this.range, this);
    this.size2value = __bind(this.size2value, this);
    this.percentage = __bind(this.percentage, this);
    this.decr = __bind(this.decr, this);
    this.incr = __bind(this.incr, this);
    this.setValue = __bind(this.setValue, this);
    this.initEvents = __bind(this.initEvents, this);
    this.onTooltip = __bind(this.onTooltip, this);
    this.init = __bind(this.init, this);
    return Value.__super__.constructor.apply(this, arguments);
  }

  Value.prototype.init = function(cfg, def) {
    cfg = _.def(cfg, def);
    return Value.__super__.init.call(this, cfg, {
      value: 0,
      minValue: -Number.MAX_VALUE / 2,
      maxValue: +Number.MAX_VALUE / 2,
      noMove: true,
      tooltip: true
    });
  };

  Value.prototype.onTooltip = function() {
    return this.elem.id;
  };

  Value.prototype.initEvents = function() {
    var win;
    if (this.config.onValue != null) {
      if (_.isString(this.config.onValue)) {
        console.log('onValue', this.config.onValue);
        log({
          "file": "./coffee/widgets/value.coffee",
          "class": "Value",
          "line": 30,
          "args": ["cfg", "def"],
          "method": "initEvents",
          "type": "."
        }, 'onValue anc', this.elem.ancestors());
        win = this.getWindow();
        console.log('onValue win', win);
        this.elem.on("onValue", win[this.config.onValue]);
      } else {
        this.elem.on("onValue", this.config.onValue);
      }
    }
    return Value.__super__.initEvents.apply(this, arguments);
  };

  Value.prototype.setValue = function(v) {
    var oldValue;
    oldValue = this.config.value;
    v = this.clamp(_.value(v));
    if (v !== oldValue) {
      this.config.value = v;
      this.emitValue(v);
    }
    return this;
  };

  Value.prototype.incr = function(d) {
    var step;
    if (d == null) {
      d = 1;
    }
    if (d === '+' || d === '++') {
      d = 1;
    } else if (d === '-' || d === '--') {
      d = -1;
    }
    step = this.config.valueStep && this.config.valueStep || 1;
    return this.setValue(this.round(this.config.value + step * d));
  };

  Value.prototype.decr = function() {
    return this.incr(-1);
  };

  Value.prototype.percentage = function(v) {
    var pct;
    pct = 100 * (v - this.config.minValue) / this.range();
    return Math.max(0, Math.min(pct, 100));
  };

  Value.prototype.size2value = function(s) {
    return this.config.minValue + this.range() * s / this.innerWidth();
  };

  Value.prototype.range = function() {
    return this.config.maxValue - this.config.minValue;
  };

  Value.prototype.steps = function() {
    return 1 + this.range() / this.config.valueStep;
  };

  Value.prototype.clamp = function(v) {
    return _.clamp(this.config.minValue, this.config.maxValue, v);
  };

  Value.prototype.round = function(v) {
    var d;
    if (this.config.valueStep) {
      d = -v + Math.round(v / this.config.valueStep) * this.config.valueStep;
      v += d;
    }
    return v;
  };

  return Value;

})(Widget);


/*

000   000  0000000     0000000   000   000
000   000  000   000  000   000   000 000 
000000000  0000000    000   000    00000  
000   000  000   000  000   000   000 000 
000   000  0000000     0000000   000   000
 */

Hbox = (function(_super) {
  __extends(Hbox, _super);

  function Hbox() {
    this.insertChild = __bind(this.insertChild, this);
    this.init = __bind(this.init, this);
    return Hbox.__super__.constructor.apply(this, arguments);
  }

  Hbox.prototype.init = function(cfg, defs) {
    var spacing;
    cfg = _.def(cfg, defs);
    spacing = (cfg.spacing != null) && cfg.spacing || 5;
    Hbox.__super__.init.call(this, cfg, {
      type: 'hbox',
      style: {
        display: 'table',
        borderSpacing: '%dpx 0px'.fmt(spacing),
        marginRight: '-%dpx'.fmt(spacing),
        marginLeft: '-%dpx'.fmt(spacing)
      }
    });
    return this;
  };

  Hbox.prototype.insertChild = function(cfg) {
    var child;
    child = Hbox.__super__.insertChild.call(this, cfg);
    child.elem.style.display = 'table-cell';
    child.elem.style.marginLeft = '10px';
    child.elem.style.verticalAlign = 'middle';
    return child;
  };

  return Hbox;

})(Widget);


/*

 0000000   0000000     0000000   000   000  000000000
000   000  000   000  000   000  000   000     000   
000000000  0000000    000   000  000   000     000   
000   000  000   000  000   000  000   000     000   
000   000  0000000     0000000    0000000      000
 */

About = (function(_super) {
  __extends(About, _super);

  function About() {
    this.init = __bind(this.init, this);
    return About.__super__.constructor.apply(this, arguments);
  }

  About.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    this.url = 'http://monsterkodi.github.io/knix/';
    return About.__super__.init.call(this, cfg, {
      title: 'about',
      id: 'about',
      resize: 'horizontal',
      width: 200,
      center: true,
      children: [
        {
          type: 'about-svg',
          text: '<svg viewBox="0 100 1100 600" height="66px" width="100px"><path class="about-svg-path" d="M 671.97461 153.66602 C 647.84887 153.75842 623.84771 163.63166 606.41211 182.95312 C 573.5922 219.3229 576.45513 275.40809 612.80859 308.24609 C 620.53294 315.22348 629.15009 320.58419 638.24414 324.36133 L 637.97852 511.20117 C 560.81033 441.59202 488.03551 367.51834 414.76367 293.89258 C 409.06942 288.42247 401.85831 285.1368 394.32812 284.25586 C 382.9265 281.82062 370.57957 285.05653 361.77344 293.91211 C 291.50652 362.08056 204.76321 455.25847 139.13477 510.65234 L 138.86523 319.25977 C 138.99507 306.54933 132.3051 294.74291 121.33594 288.32031 C 110.36678 281.89771 96.79809 281.84212 85.777344 288.17578 C 74.756593 294.50944 67.97298 306.26158 68 318.97266 C 68.0096 413.80238 68.032028 508.63329 68.017578 603.46289 C 68.452293 617.45841 77.087108 629.88453 90.052734 635.17188 C 103.01836 640.45922 117.88262 637.61638 127.98047 627.91602 L 245.27539 510.05273 L 362.08789 627.66016 C 367.94368 633.40258 375.28804 636.69048 382.85156 637.55469 C 391.36493 639.36349 400.38626 638.016 408.11914 633.48828 C 419.0883 627.06568 425.77828 615.25927 425.64844 602.54883 L 425.91797 411.1543 L 649.13477 628.46289 C 656.19683 635.24697 665.58871 638.66377 675.0332 638.30469 C 684.64495 638.71483 694.38139 635.23573 701.68164 627.89453 C 738.19192 592.47458 779.14942 550.30282 818.46875 510.1875 C 857.78815 550.30282 898.74753 592.47458 935.25781 627.89453 C 948.81591 641.52869 970.77308 641.86325 984.73828 628.64648 C 998.70348 615.42971 999.57834 593.48695 986.71094 579.19922 L 868.2207 460.60352 L 985.25586 344.67969 C 999.17946 330.95449 999.35554 308.54496 985.64844 294.60352 C 971.94134 280.66208 949.53147 280.4575 935.57227 294.14648 L 818.46875 411.75586 L 722.62109 315.49414 C 728.17633 311.66183 733.38264 307.13532 738.10547 301.91211 L 738.22461 301.78125 C 771.0084 265.37887 768.08923 209.29599 731.70312 176.49414 C 714.64714 161.11826 693.26203 153.58449 671.97461 153.66602 z M 672.16406 206.9668 C 680.66456 206.9343 689.20287 209.94212 696.01367 216.08203 C 710.54339 229.18049 711.71038 251.57511 698.61914 266.11133 L 698.57031 266.16406 C 685.4502 280.67423 663.0538 281.80626 648.53711 268.69336 C 634.02042 255.58047 632.87674 233.18531 645.98242 218.66211 C 652.94481 210.94666 662.53015 207.0037 672.16406 206.9668 z M 354.79492 401.0918 C 354.7939 440.9569 354.79438 480.82238 354.78906 520.6875 L 294.73633 461.20508 L 354.79492 401.0918 z M 709.10938 401.56055 L 768.7168 460.60352 L 709.10156 520.27148 C 709.10264 480.70103 709.1041 441.13102 709.10938 401.56055 z "/></svg>'
        }, {
          type: 'button',
          child: {
            text: 'Home',
            href: this.url
          }
        }, {
          type: 'about-svg',
          text: '<svg viewbox="48 15 27 27" height="80px" width="80px" class="about-svg-path"><path class="about-svg-path" d="M58,20.4c-0.3-0.2-0.8-0.3-1.5-0.3c-0.2,0-0.4,0-0.6,0.1c-0.2,0.1-0.3,0.2-0.3,0.4s0.1,0.3,0.4,0.4 c0.2,0.1,0.6,0.2,1,0.2c0.4,0,0.7,0,0.9-0.1c0.4-0.1,0.9-0.2,1.3-0.4l0.6-0.3c0.5-0.2,1.2-0.7,1.6-0.8c0.7-0.2,1.4-0.3,2.1-0.3 c1.3,0,2.4,0.2,3.1,0.6c0.7,0.3,0.8,1.1,0.8,1.6c0,0.6-0.5,1.1-1.5,1.3C65.4,22.9,65,23,64.5,23c-0.8,0-1.5-0.1-2-0.3 c-0.5-0.2-0.7-0.4-0.7-0.7c0-0.2,0.2-0.4,0.5-0.5c0.1,0,0.3-0.1,0.5-0.1c0,0.3,0.3,0.6,0.8,0.7c0.2,0,0.4,0.1,0.7,0.1 c0.5,0,0.8-0.1,1.1-0.2c0.3-0.1,0.5-0.3,0.5-0.5c0-0.2-0.2-0.4-0.6-0.5c-0.4-0.1-0.8-0.2-1.4-0.2c-0.6,0-1,0-1.4,0.1 c-0.4,0.1-0.7,0.2-1,0.3s-0.6,0.2-0.9,0.3c-0.3,0.1-0.6,0.2-0.9,0.3c-0.7,0.2-1.4,0.4-2,0.4c-0.8,0-1.5-0.1-2.1-0.4 s-0.8-0.7-0.8-1.1c0-0.5,0.4-0.9,1.2-1c0.2,0,0.5-0.1,0.9-0.1c0.4,0,0.7,0,1,0.1c0.3,0.1,0.5,0.2,0.5,0.4S58.3,20.3,58,20.4z"/> <path class="kitty" d="M61.4,26.6c-9.7,0-11-2.3-11-2.3c0,1.2,0.3,2.4,0.7,3.5c-0.6,0.5-2.2,2-2.2,4.2c0,2.8,3.3,4.5,5.5,3.1 c0,0-3.7-0.5-3.7-3.8c0-1.2,0.4-2,1-2.5c0.9,2,2.2,3.5,2.6,4.1c0.8,1,1,0.7,1.5,2.6c0.4,1.6,4,2.5,6,2.5v0c0,0,0,0,0,0 c0,0,0,0,0,0v0c2-0.1,5.3-0.9,5.7-2.5c0.5-2,0.5-1.6,1.3-2.6c0.8-1,3.8-4.7,3.8-8.7C72.4,24.3,71.2,26.6,61.4,26.6z"/> <path class="kitty" d="M61.7,25.2v1.5c0,0-0.4,0-0.4,0s0.4,0,0.4,0V25.2c11,0,11-3,11-3l-1.3-1.3c2.7,2.7-8.6,3-9.9,3c-1.3,0-12.7-0.3-9.9-3 l-1,1.3C50.4,22.2,49.7,25.1,61.7,25.2z"/></svg>'
        }, {
          type: 'button',
          child: {
            text: 'Credits',
            href: this.url + 'credits.html'
          }
        }, {
          type: 'about-svg',
          text: '<svg viewbox="0 0 16 16" width="80px" height="80px" class="kitty-svg"><path class="about-svg-path" d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"/></svg>'
        }, {
          type: 'button',
          child: {
            text: 'GitHub',
            href: 'https://github.com/monsterkodi/knix'
          }
        }, {
          style: {
            textAlign: 'center'
          },
          child: {
            elem: 'span',
            type: 'tiny-text',
            text: 'version %s'.fmt(knix.version)
          }
        }
      ]
    });
  };

  About.show = function() {
    log({
      "file": "./coffee/widgets/about.coffee",
      "class": "About",
      "line": 60,
      "args": ["cfg", "defs"],
      "method": "show",
      "type": "@"
    }, "about...");
    if ($('about')) {
      return $('about').raise();
    } else {
      return new About;
    }
  };

  return About;

})(Window);


/*

0000000    000   000  000000000  000000000   0000000   000   000
000   000  000   000     000        000     000   000  0000  000
0000000    000   000     000        000     000   000  000 0 000
000   000  000   000     000        000     000   000  000  0000
0000000     0000000      000        000      0000000   000   000
 */

Button = (function(_super) {
  __extends(Button, _super);

  function Button() {
    this.init = __bind(this.init, this);
    return Button.__super__.constructor.apply(this, arguments);
  }

  Button.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    if (cfg.icon != null) {
      if (cfg.text != null) {
        cfg.child = {
          elem: 'span',
          type: 'octicon',
          "class": cfg.icon
        };
      } else {
        cfg.child = {
          type: 'icon',
          icon: cfg.icon
        };
      }
    }
    return Button.__super__.init.call(this, cfg, {
      type: 'button',
      noMove: true
    });
  };

  return Button;

})(Widget);


/*

 0000000   0000000   000   000  000   000   0000000    0000000
000       000   000  0000  000  000   000  000   000  000     
000       000000000  000 0 000   000 000   000000000  0000000 
000       000   000  000  0000     000     000   000       000
 0000000  000   000  000   000      0      000   000  0000000
 */

Canvas = (function(_super) {
  __extends(Canvas, _super);

  function Canvas() {
    this.resize = __bind(this.resize, this);
    this.init = __bind(this.init, this);
    return Canvas.__super__.constructor.apply(this, arguments);
  }

  Canvas.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg.width = void 0;
    cfg.height = void 0;
    return Canvas.__super__.init.call(this, cfg, {
      elem: 'canvas',
      noMove: true
    });
  };

  Canvas.prototype.resize = function(width, height) {
    this.setHeightNoEmit(height);
    this.elem.width = width;
    return this.elem.height = height;
  };

  return Canvas;

})(Widget);


/*

 0000000   0000000   000   000  000   000  00000000   0000000  000000000  000   0000000   000   000
000       000   000  0000  000  0000  000  000       000          000     000  000   000  0000  000
000       000   000  000 0 000  000 0 000  0000000   000          000     000  000   000  000 0 000
000       000   000  000  0000  000  0000  000       000          000     000  000   000  000  0000
 0000000   0000000   000   000  000   000  00000000   0000000     000     000   0000000   000   000
 */

Connection = (function() {
  function Connection(cfg, defs) {
    this.shaded = __bind(this.shaded, this);
    this.close = __bind(this.close, this);
    this.update = __bind(this.update, this);
    this.outInConnector = __bind(this.outInConnector, this);
    this.disconnect = __bind(this.disconnect, this);
    this.connect = __bind(this.connect, this);
    this.onOut = __bind(this.onOut, this);
    this.onMove = __bind(this.onMove, this);
    this.onOver = __bind(this.onOver, this);
    this.dragStop = __bind(this.dragStop, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.closestConnectors = __bind(this.closestConnectors, this);
    this.toJSON = __bind(this.toJSON, this);
    var c, e, w, _i, _len, _ref;
    if (_.isArray(cfg)) {
      cfg = {
        source: $(cfg[0]).widget,
        target: $(cfg[1]).widget
      };
    }
    this.config = _.def(cfg, defs);
    _ref = [this.config.source, this.config.target];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c.addConnection(this);
      e = c.elem;
      w = c.getWindow().elem;
      w.addEventListener('size', this.update);
      w.addEventListener('move', this.update);
      w.addEventListener('shade', this.shaded);
      w.addEventListener('close', this.close);
    }
    this.path = new Path({
      "class": 'connection',
      parent: 'stage_content',
      startDir: this.config.source.isOut() ? pos(100, 1) : pos(-100, -1),
      endDir: this.config.target.isOut() ? pos(100, 1) : pos(-100, -1),
      onOver: this.onOver,
      onOut: this.onOut,
      onMove: this.onMove
    });
    this.path.connection = this;
    this.drag = Drag.create({
      target: this.path.path.node,
      cursor: 'grab',
      doMove: false,
      onStart: this.dragStart,
      onMove: this.dragMove,
      onStop: this.dragStop
    });
    this.path.setStart(this.config.source.absCenter());
    this.path.setEnd(this.config.target.absCenter());
    this.connection = this.connect();
  }

  Connection.prototype.toJSON = function() {
    if ((this.config.source != null) && (this.config.target != null)) {
      return [this.config.source.elem.id, this.config.target.elem.id];
    } else {
      return [];
    }
  };

  Connection.prototype.closestConnectors = function(p) {
    var ds, dt;
    ds = p.distSquare(this.config.source.absPos());
    dt = p.distSquare(this.config.target.absPos());
    if (ds < dt) {
      return [this.config.source, this.config.target];
    } else {
      return [this.config.target, this.config.source];
    }
  };

  Connection.prototype.dragStart = function(drag, event) {
    var target, _ref;
    _ref = this.closestConnectors(drag.absPos(event)), target = _ref[0], drag.connector = _ref[1];
    drag.connector.dragStart(drag, event);
    target.delConnection(this);
    this.disconnect();
    return this.path.path.hide();
  };

  Connection.prototype.dragMove = function(drag, event) {
    return drag.connector.dragMove(drag, event);
  };

  Connection.prototype.dragStop = function(drag, event) {
    drag.connector.dragStop(drag, event);
    return this.close();
  };

  Connection.prototype.onOver = function(event) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.addClassName('highlight');
    farther.elem.removeClassName('highlight');
    return this.path.path.addClass('highlight');
  };

  Connection.prototype.onMove = function(event) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.addClassName('highlight');
    return farther.elem.removeClassName('highlight');
  };

  Connection.prototype.onOut = function(event) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.removeClassName('highlight');
    farther.elem.removeClassName('highlight');
    return this.path.path.removeClass('highlight');
  };

  Connection.prototype.connect = function() {
    var connection, inConnector, outConnector, signal, signalEvent, signalSender, slot, slotFunction, _ref, _ref1;
    _ref = this.outInConnector(), outConnector = _ref[0], inConnector = _ref[1];
    outConnector.emit('onConnect', {
      source: outConnector,
      target: inConnector
    });
    connection = {
      out: outConnector,
      "in": inConnector
    };
    signal = outConnector.config.signal;
    slot = inConnector.config.slot;
    if ((signal != null) && (slot != null)) {
      _ref1 = outConnector.resolveSignal(signal), signalSender = _ref1[0], signalEvent = _ref1[1];
      slotFunction = inConnector.resolveSlot(slot);
      connection.handler = signalSender.elem.on(signalEvent, slotFunction);
      connection.sender = signalSender;
      connection.event = signalEvent;
      connection.signal = signal;
      connection.slot = slot;
      connection.receiver = slotFunction;
    }
    return connection;
  };

  Connection.prototype.disconnect = function() {
    var _ref;
    if (this.connection) {
      this.connection.out.emit('onDisconnect', {
        source: this.connection.out,
        target: this.connection["in"]
      });
      if (((_ref = this.connection) != null ? _ref.handler : void 0) != null) {
        this.connection.handler.stop();
      }
      return this.connection = null;
    }
  };

  Connection.prototype.outInConnector = function() {
    return [(this.config.source.isOut() != null ? this.config.source : void 0) || this.config.target, (this.config.source.isIn() != null ? this.config.source : void 0) || this.config.target];
  };

  Connection.prototype.update = function() {
    if (this.path != null) {
      this.path.setStart(this.config.source.absCenter());
      return this.path.setEnd(this.config.target.absCenter());
    }
  };

  Connection.prototype.close = function() {
    this.disconnect();
    if (this.config != null) {
      this.config.source.delConnection(this);
      this.config.target.delConnection(this);
      this.config = null;
    }
    if (this.path != null) {
      this.path.close();
      return this.path = null;
    }
  };

  Connection.prototype.shaded = function(event) {
    var visible;
    visible = !event.detail.shaded && this.config.source.elem.visible() && this.config.target.elem.visible() && this.config.source.getWindow().config.isShaded === false && this.config.target.getWindow().config.isShaded === false;
    if (visible) {
      this.path.setStart(this.config.source.absCenter());
      this.path.setEnd(this.config.target.absCenter());
    }
    return this.path.setVisible(visible);
  };

  return Connection;

})();


/*

 0000000   0000000   000   000  000   000  00000000   0000000  000000000   0000000   00000000 
000       000   000  0000  000  0000  000  000       000          000     000   000  000   000
000       000   000  000 0 000  000 0 000  0000000   000          000     000   000  0000000  
000       000   000  000  0000  000  0000  000       000          000     000   000  000   000
 0000000   0000000   000   000  000   000  00000000   0000000     000      0000000   000   000
 */

Connector = (function(_super) {
  __extends(Connector, _super);

  function Connector() {
    this._str = __bind(this._str, this);
    this.dragStop = __bind(this.dragStop, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.onOut = __bind(this.onOut, this);
    this.onOver = __bind(this.onOver, this);
    this.connectorAtPos = __bind(this.connectorAtPos, this);
    this.canConnectTo = __bind(this.canConnectTo, this);
    this.delConnection = __bind(this.delConnection, this);
    this.addConnection = __bind(this.addConnection, this);
    this.name = __bind(this.name, this);
    this.isOut = __bind(this.isOut, this);
    this.isIn = __bind(this.isIn, this);
    this.isSlot = __bind(this.isSlot, this);
    this.isSignal = __bind(this.isSignal, this);
    this.close = __bind(this.close, this);
    this.init = __bind(this.init, this);
    return Connector.__super__.constructor.apply(this, arguments);
  }

  Connector.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    if (cfg.slot != null) {
      cfg["class"] = 'slot';
    }
    if (cfg.signal != null) {
      cfg["class"] = 'signal';
    }
    if (cfg["in"] != null) {
      cfg["class"] = 'in';
    }
    if (cfg.out != null) {
      cfg["class"] = 'out';
    }
    Connector.__super__.init.call(this, cfg, {
      type: 'connector',
      onOver: this.onOver,
      onOut: this.onOut,
      noMove: true
    });
    Drag.create({
      target: this.elem,
      minPos: pos(void 0, 0),
      cursor: 'grab',
      doMove: false,
      onStart: this.dragStart,
      onMove: this.dragMove,
      onStop: this.dragStop
    });
    this.connections = [];
    return this;
  };

  Connector.prototype.close = function() {
    this.connections = [];
    return Connector.__super__.close.call(this);
  };

  Connector.prototype.isSignal = function() {
    return this.config.signal != null;
  };

  Connector.prototype.isSlot = function() {
    return this.config.slot != null;
  };

  Connector.prototype.isIn = function() {
    return this.isSlot() || this.config["in"];
  };

  Connector.prototype.isOut = function() {
    return this.isSignal() || this.config.out;
  };

  Connector.prototype.name = function() {
    var n, _ref;
    n = this.config[this.config["class"]];
    if ((_ref = this.config["class"]) === 'in' || _ref === 'out') {
      n += ":" + this.config["class"];
    }
    return n;
  };

  Connector.prototype.addConnection = function(c) {
    if (__indexOf.call(this.connections, c) < 0) {
      this.connections.push(c);
    }
    return this.elem.addClassName('connected');
  };

  Connector.prototype.delConnection = function(c) {
    _.del(this.connections, c);
    if (this.connections.length === 0) {
      return this.elem.removeClassName('connected');
    }
  };

  Connector.prototype.canConnectTo = function(other) {
    if (this.isSignal() && other.isSlot() || this.isSlot() && other.isSignal()) {
      return true;
    }
    return (this.config["in"] != null) && this.config["in"] === other.config.out || (this.config.out != null) && this.config.out === other.config["in"];
  };

  Connector.prototype.connectorAtPos = function(p) {
    var elem;
    this.handle.elem.style.pointerEvents = 'none';
    elem = document.elementFromPoint(p.x, p.y);
    this.handle.elem.style.pointerEvents = 'auto';
    if ((elem != null ? elem.widget : void 0) != null) {
      if (elem.widget.constructor === Connector && this.canConnectTo(elem.widget)) {
        return elem.widget;
      }
    }
    return void 0;
  };

  Connector.prototype.onOver = function(event) {
    var p;
    p = Stage.absPos(event);
    if (this.elem === document.elementFromPoint(p.x, p.y)) {
      return this.elem.addClassName('highlight');
    }
  };

  Connector.prototype.onOut = function() {
    return this.elem.removeClassName('highlight');
  };

  Connector.prototype.dragStart = function(drag, event) {
    var p;
    p = drag.absPos(event);
    this.handle = new Window({
      type: 'connector-handle',
      parent: 'stage_content',
      style: {
        cursor: 'grabbing'
      }
    });
    this.handle.setPos(p);
    this.elem.addClassName('connected');
    this.path = new Path({
      "class": 'connector',
      parent: 'stage_content',
      start: this.absCenter(),
      end: p,
      startDir: this.isOut() ? pos(100, -10) : pos(-100, -10)
    });
    return this.elem.style.cursor = 'grabbing';
  };

  Connector.prototype.dragMove = function(drag, event) {
    var conn, p;
    p = drag.absPos(event);
    if (conn = this.connectorAtPos(p)) {
      this.path.path.addClass('connectable');
      this.path.setStartDir(this.isOut() ? pos(100, 1) : pos(-100, -1));
      this.path.setEndDir(conn.isOut() ? pos(100, 1) : pos(-100, -1));
      this.conn = conn;
      this.conn.elem.addClassName('highlight');
      this.handle.elem.addClassName('highlight');
    } else {
      this.path.path.removeClass('connectable');
      this.path.setStartDir(this.isOut() ? pos(100, -10) : pos(-100, -10));
      this.path.setEndDir(pos(0, 0));
      if (this.conn) {
        this.conn.elem.removeClassName('highlight');
        this.conn = null;
      }
      this.handle.elem.removeClassName('highlight');
    }
    this.handle.setPos(p);
    return this.path.setEnd(p);
  };

  Connector.prototype.dragStop = function(drag, event) {
    var conn, p;
    p = drag.absPos(event);
    if (conn = this.connectorAtPos(p)) {
      new Connection({
        source: this,
        target: conn
      });
      conn.elem.removeClassName('highlight');
    } else if (this.connections.length === 0) {
      this.elem.removeClassName('connected');
    }
    tag('Drag');
    log({
      "file": "./coffee/widgets/connector.coffee",
      "class": "Connector",
      "line": 140,
      "args": ["drag", "event"],
      "method": "dragStop",
      "type": "."
    }, 'stop');
    this.handle.close();
    return this.path.path.remove();
  };

  Connector.prototype._str = function() {
    var s;
    s = this.elem.id + " ";
    if (this.isSignal()) {
      s += "signal: " + this.config.signal;
    }
    if (this.isSlot()) {
      s += "slot: " + this.config.slot;
    }
    if (this.config["in"] != null) {
      s += this.config["in"];
    }
    if (this.config.out != null) {
      s += this.config.out;
    }
    return s;
  };

  return Connector;

})(Widget);


/*

 0000000   0000000   000   000   0000000   0000000   000      00000000
000       000   000  0000  000  000       000   000  000      000     
000       000   000  000 0 000  0000000   000   000  000      0000000 
000       000   000  000  0000       000  000   000  000      000     
 0000000   0000000   000   000  0000000    0000000   0000000  00000000
 */

Console = (function(_super) {
  __extends(Console, _super);

  function Console() {
    this.clear = __bind(this.clear, this);
    this.toggleMethods = __bind(this.toggleMethods, this);
    this.toggleClasses = __bind(this.toggleClasses, this);
    this.addLogTag = __bind(this.addLogTag, this);
    this.updateTags = __bind(this.updateTags, this);
    this.logInfo = __bind(this.logInfo, this);
    this.insert = __bind(this.insert, this);
    this.onTagState = __bind(this.onTagState, this);
    this.trashSettings = __bind(this.trashSettings, this);
    this.onContextMenu = __bind(this.onContextMenu, this);
    this.init = __bind(this.init, this);
    return Console.__super__.constructor.apply(this, arguments);
  }

  Console.scopeTags = [];

  Console.prototype.init = function(cfg, defs) {
    var h, w;
    this.logTags = Settings.get('logTags', {});
    w = Stage.size().width / 2;
    h = Stage.size().height - $('menu').getHeight() - 2;
    Console.__super__.init.call(this, cfg, {
      title: 'console',
      "class": 'console-window',
      x: w,
      y: $('menu').getHeight() + 2,
      width: w,
      height: h,
      content: 'scroll',
      showMethods: Settings.get('logMethods', true),
      showClasses: Settings.get('logClasses', true),
      buttons: [
        {
          "class": 'window-button-right',
          child: {
            type: 'icon',
            icon: 'octicon-trashcan'
          },
          onClick: this.clear
        }, {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-diff-added'
          },
          onClick: this.maximize
        }
      ],
      child: {
        "class": 'console',
        text: '<span class="tiny-text" style="vertical-align:top">console - knix version ' + knix.version + '</span>',
        noMove: true
      }
    });
    this.elem.addEventListener('contextmenu', this.onContextMenu);
    return this;
  };

  Console.prototype.onContextMenu = function(event) {
    var children, tag;
    children = [];
    for (tag in this.logTags) {
      if (!tag.startsWith('@') && !tag.startsWith('.')) {
        children.push({
          type: 'toggle',
          text: tag,
          states: ['on', 'unset', 'off'],
          icons: ['octicon-check', 'octicon-dash', 'octicon-x'],
          state: this.logTags[tag],
          onState: this.onTagState
        });
      }
    }
    children.push({
      type: 'button',
      text: 'ok',
      onClick: function() {
        return _.win().close();
      }
    });
    knix.get({
      hasClose: true,
      hasMaxi: false,
      title: ' ',
      resize: false,
      hasShade: false,
      popup: true,
      pos: Stage.absPos(event),
      console: this,
      children: children,
      buttons: [
        {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-check'
          },
          onClick: function() {
            var t, _i, _len, _ref, _results;
            _ref = _.win().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('on'));
            }
            return _results;
          }
        }, {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-dash'
          },
          onClick: function() {
            var t, _i, _len, _ref, _results;
            _ref = _.win().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('unset'));
            }
            return _results;
          }
        }, {
          "class": 'window-button-left',
          child: {
            type: 'icon',
            icon: 'octicon-x'
          },
          onClick: function() {
            var t, _i, _len, _ref, _results;
            _ref = _.win().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('off'));
            }
            return _results;
          }
        }, {
          type: "window-button-right",
          child: {
            type: 'icon',
            icon: 'octicon-trashcan'
          },
          onClick: this.trashSettings
        }, {
          type: "window-button-right",
          child: {
            type: 'icon',
            icon: 'octicon-list-unordered'
          },
          onClick: this.toggleMethods
        }, {
          "class": 'window-button-right',
          child: {
            type: 'icon',
            icon: 'octicon-three-bars'
          },
          onClick: this.toggleClasses
        }
      ]
    });
    return event.preventDefault();
  };

  Console.prototype.trashSettings = function() {
    Settings.set('logTags', {});
    Settings.set('logMethods', void 0);
    return Settings.set('logClasses', void 0);
  };

  Console.prototype.onTagState = function(event) {
    var tag;
    tag = _.wid().config.text;
    this.logTags[tag] = event.detail.state;
    Settings.set('logTags', this.logTags);
    return this.updateTags();
  };

  Console.prototype.insert = function(s) {
    this.getChild('console').elem.insert(s);
    return this.scrollToBottom();
  };

  Console.prototype.logInfo = function(info, url, s) {
    var infoStr, styles, t, tags;
    this.addLogTag(info["class"]);
    if ((info["class"] != null) && (info.type != null) && (info.method != null)) {
      infoStr = info["class"] + info.type + info.method;
    } else {
      infoStr = '';
    }
    tags = [info["class"]].concat(Console.scopeTags);
    styles = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        t = tags[_i];
        if (t != null) {
          _results.push("log_" + t.replace(/[\/@]/g, '_'));
        }
      }
      return _results;
    })()).join(' ');
    this.insert('<pre class="' + styles + '">' + '<a onClick=\'' + url + '\' class="console-link" title="' + infoStr + ' ' + tags.join(' ') + '">' + '<span class="console-class" ' + (!this.config.showClasses && 'style="display:none;"' || '') + '>' + ((info["class"] != null) && info["class"] || '') + '</span>' + '<span class="console-method-type" ' + (!this.config.showMethods && 'style="display:none;"' || '') + '>' + ((info.type != null) && info.type || '') + '</span>' + '<span class="console-method" ' + (!this.config.showMethods && 'style="display:none;"' || '') + '>' + ((info.method != null) && info.method || '') + '</span>' + '<span class="octicon octicon-playback-play"></span>' + '</a> ' + s + '</pre>');
    return this.updateTags();
  };

  Console.prototype.updateTags = function() {
    var show, tag, tagElem, tagElems, tclass, v, _i, _len, _ref, _results;
    tagElems = this.elem.select('pre');
    _results = [];
    for (_i = 0, _len = tagElems.length; _i < _len; _i++) {
      tagElem = tagElems[_i];
      show = -1;
      _ref = this.logTags;
      for (tag in _ref) {
        v = _ref[tag];
        tclass = 'log_' + tag.replace(/[\/@]/g, '_');
        if (__indexOf.call(tagElem.classList, tclass) >= 0) {
          if (v === 'off') {
            show = 0;
          } else if (v === 'on' && show !== 0) {
            show = 1;
          }
        }
      }
      _results.push(tagElem.style.display = show === 0 && 'none' || '');
    }
    return _results;
  };

  Console.prototype.addLogTag = function(tag) {
    if (this.logTags[tag] == null) {
      return this.logTags[tag] = 'unset';
    }
  };

  Console.prototype.toggleClasses = function() {
    var t, _i, _len, _ref, _results;
    this.config.showClasses = !this.config.showClasses;
    Settings.set('logClasses', this.config.showClasses);
    _ref = this.elem.select('.console-class');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (this.config.showClasses) {
        _results.push(t.show());
      } else {
        _results.push(t.hide());
      }
    }
    return _results;
  };

  Console.prototype.toggleMethods = function() {
    var t, _i, _len, _ref, _results;
    this.config.showMethods = !this.config.showMethods;
    Settings.set('logMethods', this.config.showMethods);
    _ref = this.elem.select('.console-method', '.console-method-type');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (this.config.showMethods) {
        _results.push(t.show());
      } else {
        _results.push(t.hide());
      }
    }
    return _results;
  };

  Console.prototype.clear = function() {
    return this.getChild('console').clear();
  };

  Console.setScopeTags = function() {
    var t, _i, _len, _ref, _results;
    Console.scopeTags = Array.prototype.slice.call(arguments, 0);
    _ref = Console.scopeTags;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      _results.push(Console.allConsoles().each(function(c) {
        return c.addLogTag(t);
      }));
    }
    return _results;
  };

  Console.logInfo = function(info) {
    var args, s, url;
    args = Array.prototype.slice.call(arguments, 1);
    if (__indexOf.call(Console.scopeTags, 'error') >= 0) {
      s = '<span class="console-error">%s</span> '.fmt(str(args[0])) + Console.toHtml.apply(Console, args.slice(1));
    } else if (__indexOf.call(Console.scopeTags, 'warning') >= 0) {
      s = '<span class="console-warning">%s</span> '.fmt(str(args[0])) + Console.toHtml.apply(Console, args.slice(1));
    } else {
      s = Console.toHtml.apply(Console, args);
    }
    if ((info.file != null) && (info.line != null)) {
      url = 'window.open("https://github.com/monsterkodi/knix/blob/master/%s#L%d");'.fmt(info.file, info.line);
      info.file = info.file.slice(9, -7);
    }
    Console.allConsoles().each(function(c) {
      return c.logInfo(info, url, s);
    });
    return Console.scopeTags = [];
  };

  Console.allConsoles = function() {
    var e, _i, _len, _ref, _results;
    _ref = $$(".console");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      _results.push(e.getWindow());
    }
    return _results;
  };

  Console.log = function() {
    return Console.allConsoles().each(function(c) {
      return c.insert(Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0)));
    });
  };

  Console.toHtml = function() {
    var arg, html;
    html = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        _results.push(str(arg));
      }
      return _results;
    }).apply(Console, arguments)).join(" ");
    return html.replace(/[<]([^>]+)[>]/g, '<span class="console-type">&lt;$1&gt;</span>').replace(/([:,\.\{\}\(\)\[\]])/g, '<span class="console-punct">$1</span>').replace(/->/g, '<span class="octicon octicon-arrow-small-right"></span>');
  };

  return Console;

})(Window);

tag = Console.setScopeTags;


/*

00000000  000  000      00000000   0000000
000       000  000      000       000     
000000    000  000      0000000   0000000 
000       000  000      000            000
000       000  0000000  00000000  0000000
 */

Files = (function() {
  function Files() {}

  Files.saveWindows = function() {
    var files, json, w, windows;
    windows = knix.allWindows();
    if (_.isEmpty(windows)) {
      return;
    }
    json = JSON.stringify({
      'windows': (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = windows.length; _i < _len; _i++) {
          w = windows[_i];
          _results.push(w.config);
        }
        return _results;
      })(),
      'connections': knix.allConnections()
    }, null, '    ');
    log({
      "file": "./coffee/widgets/files.coffee",
      "class": "Files",
      "line": 20,
      "method": "saveWindows",
      "type": "@"
    }, json);
    files = Files.allFiles();
    files[uuid.v4()] = json;
    return localStorage.setItem('files', JSON.stringify(files));
  };

  Files.loadMenu = function(event) {
    var children, data, file, files;
    files = Files.allFiles();
    if (_.isEmpty(files)) {
      return;
    }
    children = [];
    for (file in files) {
      data = files[file];
      log({
        "file": "./coffee/widgets/files.coffee",
        "class": "Files",
        "line": 33,
        "method": "loadMenu",
        "type": "@",
        "args": ["event"]
      }, 'file', file, data.length);
      children.push({
        type: 'button',
        text: file,
        onClick: Files.fileSelected
      });
    }
    return knix.get({
      hasClose: true,
      hasMaxi: false,
      title: ' ',
      resize: false,
      hasShade: false,
      popup: true,
      pos: Stage.absPos(event),
      children: children,
      buttons: [
        {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-trashcan'
          },
          onClick: Files.trashFiles
        }
      ]
    });
  };

  Files.trashFiles = function() {
    localStorage.setItem('files', "{}");
    return knix.closePopups();
  };

  Files.allFiles = function() {
    if (localStorage.getItem('files') != null) {
      return JSON.parse(localStorage.getItem('files'));
    }
    return {};
  };

  Files.loadLast = function() {
    return Files.loadFile(_.keys(Files.allFiles()).last());
  };

  Files.fileSelected = function(event) {
    return Files.loadFile(event.target.getWidget().config.text);
  };

  Files.loadFile = function(filename) {
    var data, state;
    log({
      "file": "./coffee/widgets/files.coffee",
      "class": "Files",
      "line": 71,
      "method": "loadFile",
      "type": "@",
      "args": ["filename"]
    }, filename);
    if (filename) {
      data = Files.allFiles()[filename];
      knix.closeWindows();
      state = JSON.parse(data);
      return knix.restore(state);
    }
  };

  return Files;

})();


/*

000   000   0000000   000   000  0000000    000      00000000
000   000  000   000  0000  000  000   000  000      000     
000000000  000000000  000 0 000  000   000  000      0000000 
000   000  000   000  000  0000  000   000  000      000     
000   000  000   000  000   000  0000000    0000000  00000000
 */

Handle = (function(_super) {
  __extends(Handle, _super);

  function Handle() {
    this.setPos = __bind(this.setPos, this);
    this.absPos = __bind(this.absPos, this);
    this.relPos = __bind(this.relPos, this);
    this.constrain = __bind(this.constrain, this);
    this.initEvents = __bind(this.initEvents, this);
    this.init = __bind(this.init, this);
    return Handle.__super__.constructor.apply(this, arguments);
  }

  Handle.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    this.config = _.def(cfg, {
      radius: 16,
      noMove: true
    });
    this.circle = this.config.svg.circle(this.config.radius);
    this.circle.addClass(this.config["class"]);
    this.elem = this.circle.node;
    this.elem.getWidget = this.returnThis;
    this.initElem();
    this.initEvents();
    this.elem.relPos = this.relPos;
    this.drag = new Drag({
      target: this.elem,
      onStop: this.config.onUp
    });
    return this;
  };

  Handle.prototype.initEvents = function() {
    if (this.config.onPos != null) {
      return this.elem.addEventListener('onpos', this.config.onPos);
    }
  };

  Handle.prototype.constrain = function(minX, minY, maxX, maxY) {
    return this.drag.constrain(minX, minY, maxX, maxY);
  };

  Handle.prototype.relPos = function() {
    return pos(this.circle.cx(), this.circle.cy());
  };

  Handle.prototype.absPos = function() {
    return pos(this.circle.cx(), this.circle.cy());
  };

  Handle.prototype.setPos = function() {
    var o, p;
    p = _.arg();
    o = this.relPos();
    if (o.notSame(p)) {
      this.circle.center(p.x, p.y);
      return this.elem.dispatchEvent(new CustomEvent('onpos', {
        'detail': p
      }));
    }
  };

  return Handle;

})(Widget);


/*

000   0000000   0000000   000   000
000  000       000   000  0000  000
000  000       000   000  000 0 000
000  000       000   000  000  0000
000   0000000   0000000   000   000
 */

Icon = (function(_super) {
  __extends(Icon, _super);

  function Icon() {
    this.init = __bind(this.init, this);
    return Icon.__super__.constructor.apply(this, arguments);
  }

  Icon.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    return Icon.__super__.init.call(this, cfg, {
      child: {
        elem: 'span',
        type: 'octicon',
        "class": cfg.icon
      }
    });
  };

  return Icon;

})(Widget);


/*

000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000
 */

Input = (function(_super) {
  __extends(Input, _super);

  function Input() {
    this.init = __bind(this.init, this);
    return Input.__super__.constructor.apply(this, arguments);
  }

  Input.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    Input.__super__.init.call(this, cfg, {
      type: 'input',
      elem: 'input'
    });
    this.elem.setAttribute('size', 6);
    this.elem.setAttribute('type', 'text');
    this.elem.setAttribute('inputmode', 'numeric');
    this.elem.getValue = function() {
      return parseFloat(this.value);
    };
    return this;
  };

  return Input;

})(Widget);


/*

00000000    0000000   0000000  
000   000  000   000  000   000
00000000   000000000  000   000
000        000   000  000   000
000        000   000  0000000
 */

Pad = (function(_super) {
  __extends(Pad, _super);

  function Pad() {
    this.setSize = __bind(this.setSize, this);
    this.updateHandles = __bind(this.updateHandles, this);
    this.setSVGSize = __bind(this.setSVGSize, this);
    this.constrainHandles = __bind(this.constrainHandles, this);
    this.onHandleUp = __bind(this.onHandleUp, this);
    this.onHandlePos = __bind(this.onHandlePos, this);
    this.getHeight = __bind(this.getHeight, this);
    this.getWidth = __bind(this.getWidth, this);
    this.hideRuler = __bind(this.hideRuler, this);
    this.showRuler = __bind(this.showRuler, this);
    this.valAtRel = __bind(this.valAtRel, this);
    this.init = __bind(this.init, this);
    return Pad.__super__.constructor.apply(this, arguments);
  }

  Pad.prototype.init = function(cfg, defs) {
    var hp, i, p, v, _i, _j, _k, _ref, _ref1, _ref2;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      minWidth: 100,
      minHeight: 100,
      numHandles: 1,
      hasPaths: true
    });
    this.o = 8;
    Pad.__super__.init.call(this, cfg, {
      type: 'pad',
      noMove: true,
      minWidth: cfg.minWidth,
      minHeight: cfg.minHeight,
      child: {
        type: 'svg',
        noMove: true
      }
    });
    this.svg = this.getChild('svg');
    if (this.config.vals != null) {
      this.config.vals = (function() {
        var _i, _len, _ref, _results;
        _ref = this.config.vals;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          _results.push(pos(v.x, v.y));
        }
        return _results;
      }).call(this);
      this.config.numHandles = this.config.vals.length;
    }
    this.handles = [];
    for (i = _i = 0, _ref = this.config.numHandles; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.handles.push(new Handle({
        svg: this.svg.svg,
        "class": 'pad_handle',
        onPos: this.onHandlePos,
        onUp: this.onHandleUp
      }));
    }
    if (this.config.hasPaths) {
      for (i = _j = 1, _ref1 = this.config.numHandles; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        p = new Path({
          svg: this.svg.svg,
          "class": 'pad-path',
          startHandle: this.handles[i - 1],
          endHandle: this.handles[i]
        });
        p.path.back();
      }
    }
    if (this.config.vals == null) {
      this.config.vals = [];
      for (i = _k = 0, _ref2 = this.config.numHandles; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
        hp = pos(i.toFixed(3) / (this.config.numHandles - 1), i.toFixed(3) / (this.config.numHandles - 1));
        this.config.vals.push(hp);
      }
    }
    this.setSVGSize(cfg.minWidth, cfg.minHeight);
    this.updateHandles();
    return this;
  };

  Pad.prototype.valAtRel = function(rel) {
    var dl, dp, ei, ep, i, p, si, sp, _i, _ref, _ref1;
    if (this.config.numHandles < 2) {
      return this.config.vals[0].y;
    }
    si = 0;
    ei = 1;
    for (i = _i = 0, _ref = this.config.numHandles; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (this.config.vals[i].x <= rel) {
        si = i;
      } else {
        ei = i;
        break;
      }
    }
    _ref1 = [this.config.vals[si], this.config.vals[ei]], sp = _ref1[0], ep = _ref1[1];
    dp = sp.to(ep);
    dl = dp.length();
    if (dl === 0 || dp.x === 0) {
      log({
        "file": "./coffee/widgets/pad.coffee",
        "class": "Pad",
        "line": 81,
        "args": ["rel"],
        "method": "valAtRel",
        "type": "."
      }, 'null', rel, si, ei, dl, dp.x);
      return sp.y;
    } else {
      p = sp.add(dp.times((rel - this.config.vals[si].x) / dp.x));
      return p.y;
    }
  };

  Pad.prototype.showRuler = function(x, y) {
    var h, w, _ref;
    _ref = [this.getWidth() - 2 * this.o, this.getHeight() - 2 * this.o], w = _ref[0], h = _ref[1];
    if (x != null) {
      if (this.rulerx == null) {
        this.rulerx = new Path({
          svg: this.svg.svg,
          "class": 'pad-ruler'
        });
        this.rulerx.path.back();
      }
      this.rulerx.setStart(pos(x * w + this.o, 0));
      this.rulerx.setEnd(pos(x * w + this.o, h + 2 * this.o));
    }
    if (y != null) {
      if (this.rulery == null) {
        this.rulery = new Path({
          svg: this.svg.svg,
          "class": 'pad-ruler'
        });
        this.rulery.path.back();
      }
      this.rulery.setStart(pos(0, h - y * h + this.o));
      return this.rulery.setEnd(pos(w + 2 * this.o, h - y * h + this.o));
    }
  };

  Pad.prototype.hideRuler = function() {
    if (this.rulerx) {
      this.rulerx.close();
      this.rulerx = null;
    }
    if (this.rulery) {
      this.rulery.close();
      return this.rulery = null;
    }
  };

  Pad.prototype.getWidth = function() {
    return this.svg.elem.width;
  };

  Pad.prototype.getHeight = function() {
    return this.svg.elem.height;
  };

  Pad.prototype.onHandlePos = function(event) {
    var h, i, p, w, x, y, _ref;
    if (this.config.vals == null) {
      return;
    }
    _ref = [this.getWidth() - 2 * this.o, this.getHeight() - 2 * this.o], w = _ref[0], h = _ref[1];
    if ((w == null) || (h == null)) {
      return;
    }
    p = _.arg();
    i = this.handles.indexOf(event.target.getWidget());
    x = (p.x - this.o) / w;
    y = 1.0 - (p.y - this.o) / h;
    this.config.vals[i].x = x;
    return this.config.vals[i].y = y;
  };

  Pad.prototype.onHandleUp = function() {
    return this.constrainHandles();
  };

  Pad.prototype.constrainHandles = function() {
    var h, i, maxX, minX, w, _i, _ref, _ref1, _ref2, _ref3, _results;
    _ref = [this.getWidth() - 2 * this.o, this.getHeight() - 2 * this.o], w = _ref[0], h = _ref[1];
    _results = [];
    for (i = _i = 0, _ref1 = this.config.vals.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (i === 0) {
        _ref2 = [this.o, this.o], minX = _ref2[0], maxX = _ref2[1];
      } else if (i === this.config.vals.length - 1) {
        _ref3 = [this.o + w, this.o + w], minX = _ref3[0], maxX = _ref3[1];
      } else {
        minX = this.handles[i - 1].relPos().x;
        maxX = this.handles[i + 1].relPos().x;
      }
      _results.push(this.handles[i].constrain(minX, this.o, maxX, this.o + h));
    }
    return _results;
  };

  Pad.prototype.setSVGSize = function(width, height) {
    this.svg.setWidth(width);
    this.svg.setHeight(height);
    this.svg.elem.width = width;
    return this.svg.elem.height = height;
  };

  Pad.prototype.updateHandles = function() {
    var h, hp, i, w, _i, _ref, _ref1, _results;
    _ref = [this.getWidth() - 2 * this.o, this.getHeight() - 2 * this.o], w = _ref[0], h = _ref[1];
    _results = [];
    for (i = _i = 0, _ref1 = this.config.vals.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      hp = pos(this.o + this.config.vals[i].x * w, h - this.config.vals[i].y * h + this.o);
      _results.push(this.handles[i].setPos(hp));
    }
    return _results;
  };

  Pad.prototype.setSize = function(width, height) {
    this.setSVGSize(width, height);
    this.updateHandles();
    return this.constrainHandles();
  };

  return Pad;

})(Widget);


/*

00000000    0000000   000000000  000   000
000   000  000   000     000     000   000
00000000   000000000     000     000000000
000        000   000     000     000   000
000        000   000     000     000   000
 */

Path = (function(_super) {
  __extends(Path, _super);

  function Path() {
    this.setCtrl = __bind(this.setCtrl, this);
    this.setEnd = __bind(this.setEnd, this);
    this.setStart = __bind(this.setStart, this);
    this.setStartHead = __bind(this.setStartHead, this);
    this.setEndHead = __bind(this.setEndHead, this);
    this.setStartDir = __bind(this.setStartDir, this);
    this.setEndDir = __bind(this.setEndDir, this);
    this.setVisible = __bind(this.setVisible, this);
    this.close = __bind(this.close, this);
    this.init = __bind(this.init, this);
    return Path.__super__.constructor.apply(this, arguments);
  }

  Path.prototype.init = function(cfg, defs) {
    var clss, _i, _len, _ref;
    this.config = _.def(cfg, _.def(defs, {
      type: 'path',
      start: pos(0, 0),
      startDir: pos(0, 0),
      end: pos(0, 0),
      endDir: pos(0, 0),
      svg: knix.svg,
      noMove: true
    }));
    this.path = this.config.svg.path();
    this.path.M(0, 0).Q(0, 0, 0, 0).Q(0, 0, 0, 0);
    this.path.attr({
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    this.path.style({
      cursor: 'grabbing'
    });
    this.path.stroke({
      width: 4
    });
    this.path.addClass('path');
    if (this.config["class"] != null) {
      _ref = this.config["class"].split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clss = _ref[_i];
        this.path.addClass(clss);
      }
    }
    this.path.fill('none');
    this.elem = this.path.node;
    this.elem.getWidget = this.returnThis;
    if (this.config.startHandle != null) {
      this.config.startHandle.elem.addEventListener('onpos', this.setStart);
    }
    if (this.config.endHandle != null) {
      this.config.endHandle.elem.addEventListener('onpos', this.setEnd);
    }
    this.config.endHead = this.config.end.add(this.config.endDir);
    this.config.startHead = this.config.start.add(this.config.startDir);
    this.setStart(this.config.start);
    this.setEnd(this.config.end);
    this.initEvents();
    return this;
  };

  Path.prototype.close = function() {
    var _ref;
    if ((_ref = this.path) != null) {
      _ref.remove();
    }
    this.path = null;
    return Path.__super__.close.call(this);
  };

  Path.prototype.setVisible = function(v) {
    if (v) {
      return this.path.show();
    } else {
      return this.path.hide();
    }
  };

  Path.prototype.setEndDir = function(p) {
    this.config.endDir = p;
    return this.setEnd(this.config.end);
  };

  Path.prototype.setStartDir = function(p) {
    this.config.startDir = p;
    return this.setStart(this.config.start);
  };

  Path.prototype.setEndHead = function(p) {
    return this.setEndDir(p.sub(this.config.end));
  };

  Path.prototype.setStartHead = function(p) {
    return this.setStartDir(p.sub(this.config.start));
  };

  Path.prototype.setStart = function() {
    var p;
    p = _.arg();
    this.config.start = pos(p.x, p.y);
    this.config.startHead = this.config.start.add(this.config.startDir);
    this.config.mid = this.config.startHead.mid(this.config.endHead);
    this.setCtrl(0, this.config.start);
    this.setCtrl(1, this.config.startHead);
    return this.setCtrl(2, this.config.mid);
  };

  Path.prototype.setEnd = function() {
    var p;
    p = _.arg();
    this.config.end = pos(p.x, p.y);
    this.config.endHead = this.config.end.add(this.config.endDir);
    this.config.mid = this.config.startHead.mid(this.config.endHead);
    this.setCtrl(2, this.config.mid);
    this.setCtrl(3, this.config.endHead);
    return this.setCtrl(4, this.config.end);
  };

  Path.prototype.setCtrl = function(c, p) {
    var o, s, si;
    si = [0, 1, 1, 2, 2][c];
    o = [0, 0, 2, 0, 2][c];
    s = this.path.getSegment(si);
    s.coords[0 + o] = p.x;
    s.coords[1 + o] = p.y;
    return this.path.replaceSegment(si, s);
  };

  return Path;

})(Widget);


/*

00000000    0000000   000   000   0000000   00000000
000   000  000   000  0000  000  000        000     
0000000    000000000  000 0 000  000  0000  0000000 
000   000  000   000  000  0000  000   000  000     
000   000  000   000  000   000   0000000   00000000
 */

Range = (function(_super) {
  __extends(Range, _super);

  function Range() {
    this.setValue = __bind(this.setValue, this);
    this.range = __bind(this.range, this);
    this.setLow = __bind(this.setLow, this);
    this.setHigh = __bind(this.setHigh, this);
    this.paramValuesAtConnector = __bind(this.paramValuesAtConnector, this);
    this.init = __bind(this.init, this);
    return Range.__super__.constructor.apply(this, arguments);
  }

  Range.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      low: 0.0,
      minLow: -10000,
      maxLow: 10000,
      lowStep: 0.1,
      high: 1.0,
      minHigh: -10000,
      maxHigh: 10000,
      highStep: 0.1,
      valueFormat: "%0.3f",
      resize: 'horizontal'
    });
    Range.__super__.init.call(this, cfg, {
      type: 'range',
      title: 'range',
      children: [
        {
          type: 'sliderspin',
          id: 'range_low',
          value: cfg.low,
          minValue: cfg.minLow,
          maxValue: cfg.maxLow,
          spinStep: cfg.lowStep
        }, {
          type: 'sliderspin',
          id: 'range_high',
          value: cfg.high,
          minValue: cfg.minHigh,
          maxValue: cfg.maxHigh,
          spinStep: cfg.highStep
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'range_in:setValue'
            }, {
              type: 'spin',
              id: 'range_in',
              valueStep: 0.001,
              minWidth: 100,
              maxWidth: 10000,
              format: cfg.valueFormat,
              style: {
                width: '50%'
              }
            }, {
              type: 'spin',
              id: 'range_out',
              valueStep: 0.001,
              minWidth: 100,
              maxWidth: 10000,
              format: cfg.valueFormat,
              style: {
                width: '50%'
              }
            }, {
              type: 'connector',
              signal: 'range_out:onValue'
            }
          ]
        }
      ]
    });
    this.connect('range_in:onValue', this.setValue);
    this.connect('range_low:onValue', this.setLow);
    this.connect('range_high:onValue', this.setHigh);
    return this;
  };

  Range.prototype.paramValuesAtConnector = function(paramValues, connector) {
    if (connector.config.slot === 'range_in:setValue') {
      paramValues.offset = this.config.low;
      paramValues.range = this.config.high - this.config.low;
      return Audio.sendParamValuesFromConnector(paramValues, this.connector("range_out:onValue"));
    }
  };

  Range.prototype.setHigh = function(v) {
    this.config.high = Math.max(this.config.low, _.value(v));
    return this.getChild('range_high').setValue(Math.max(this.config.low, this.config.high));
  };

  Range.prototype.setLow = function(v) {
    this.config.low = _.value(v);
    return this.getChild('range_low').setValue(Math.min(this.config.low, this.config.high));
  };

  Range.prototype.range = function() {
    return this.config.high - this.config.low;
  };

  Range.prototype.setValue = function(v) {
    this.config.value = this.config.low + _.clamp(0.0, 1.0, _.value(v)) * this.range();
    return this.getChild('range_out').setValue(this.config.value);
  };

  Range.menu = function() {
    return knix.create({
      type: 'button',
      tooltip: 'range',
      id: 'new_range',
      icon: 'octicon-settings',
      "class": 'tool-button',
      parent: 'menu',
      onClick: function() {
        return new Range({
          center: true
        });
      }
    });
  };

  return Range;

})(Window);


/*

 0000000  000      000  0000000    00000000  00000000 
000       000      000  000   000  000       000   000
0000000   000      000  000   000  0000000   0000000  
     000  000      000  000   000  000       000   000
0000000   0000000  000  0000000    00000000  000   000
 */

Slider = (function(_super) {
  __extends(Slider, _super);

  function Slider() {
    this.setBarValue = __bind(this.setBarValue, this);
    this.setValue = __bind(this.setValue, this);
    this.valueToPercentOfWidth = __bind(this.valueToPercentOfWidth, this);
    this.onWindowSize = __bind(this.onWindowSize, this);
    this.init = __bind(this.init, this);
    return Slider.__super__.constructor.apply(this, arguments);
  }

  Slider.prototype.init = function(cfg, defs) {
    var sliderFunc;
    sliderFunc = function(drag, event) {
      var pos, slider, v, width;
      slider = drag.target.widget;
      pos = slider.absPos();
      width = event.clientX - pos.x;
      v = slider.size2value(width);
      return slider.setValue(v);
    };
    Slider.__super__.init.call(this, cfg, {
      type: 'slider',
      minWidth: 50,
      child: {
        type: 'slider-bar',
        child: {
          type: 'slider-knob'
        }
      }
    });
    if (!this.config.hasKnob) {
      this.getChild('slider-knob').elem.hide();
    }
    this.setBarValue(this.config.value);
    Drag.create({
      cursor: 'ew-resize',
      target: this.elem,
      doMove: false,
      onMove: sliderFunc,
      onStart: sliderFunc
    });
    return this;
  };

  Slider.prototype.onWindowSize = function() {
    return this.setValue(this.config.value);
  };

  Slider.prototype.valueToPercentOfWidth = function(value) {
    var barFactor, barPercent, borderWidth, cfg, knobMinPercent, knobWidth;
    cfg = this.config;
    knobWidth = this.config.hasKnob && this.getChild('slider-knob').getWidth() || 0;
    borderWidth = this.getChild('slider-bar').getHeight() - this.getChild('slider-bar').innerHeight();
    knobMinPercent = 100 * (knobWidth + borderWidth) / Math.max(1, this.getWidth());
    barFactor = (value - cfg.minValue) / (cfg.maxValue - cfg.minValue);
    barPercent = knobMinPercent + ((100 - knobMinPercent) * barFactor);
    return barPercent;
  };

  Slider.prototype.setValue = function(v) {
    Slider.__super__.setValue.apply(this, arguments);
    return this.setBarValue(this.config.value);
  };

  Slider.prototype.setBarValue = function(barValue) {
    var pct;
    pct = this.valueToPercentOfWidth(barValue);
    return this.getChild('slider-bar').elem.style.width = "%.2f%%".fmt(pct);
  };

  return Slider;

})(Value);


/*

 0000000  000      000  0000000    00000000  00000000    0000000  00000000   000  000   000
000       000      000  000   000  000       000   000  000       000   000  000  0000  000
0000000   000      000  000   000  0000000   0000000    0000000   00000000   000  000 0 000
     000  000      000  000   000  000       000   000       000  000        000  000  0000
0000000   0000000  000  0000000    00000000  000   000  0000000   000        000  000   000
 */

Sliderspin = (function(_super) {
  __extends(Sliderspin, _super);

  function Sliderspin() {
    this.setValue = __bind(this.setValue, this);
    this.onSpinValue = __bind(this.onSpinValue, this);
    this.init = __bind(this.init, this);
    return Sliderspin.__super__.constructor.apply(this, arguments);
  }

  Sliderspin.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    Sliderspin.__super__.init.call(this, cfg, {
      children: [
        {
          type: 'connector',
          slot: cfg.id + ':setValue'
        }, {
          type: 'slider',
          id: cfg.id + '_slider',
          value: cfg.value,
          minValue: cfg.minValue,
          maxValue: cfg.maxValue,
          valueStep: cfg.sliderStep,
          hasKnob: cfg.sliderKnob,
          style: {
            width: '90%'
          }
        }, {
          type: 'spin',
          id: cfg.id + '_spin',
          value: cfg.value,
          minValue: cfg.minValue,
          maxValue: cfg.maxValue,
          valueStep: cfg.spinStep,
          minWidth: 100,
          format: cfg.spinFormat || "%3.2f",
          style: {
            width: '10%'
          }
        }, {
          type: 'connector',
          signal: cfg.id + ':onValue'
        }
      ]
    });
    this.connect(cfg.id + '_slider:onValue', cfg.id + '_spin:setValue');
    this.connect(cfg.id + '_spin:onValue', cfg.id + '_slider:setValue');
    this.connect(cfg.id + '_spin:onValue', this.onSpinValue);
    return this;
  };

  Sliderspin.prototype.onSpinValue = function(v) {
    return this.emitValue(_.value(v));
  };

  Sliderspin.prototype.setValue = function(v) {
    this.config.value = _.value(v);
    return this.getChild(this.config.id + '_slider').setValue(this.config.value);
  };

  return Sliderspin;

})(Hbox);


/*

 0000000  00000000   000  000   000
000       000   000  000  0000  000
0000000   00000000   000  000 0 000
     000  000        000  000  0000
0000000   000        000  000   000
 */

Spin = (function(_super) {
  __extends(Spin, _super);

  function Spin() {
    this.strip0 = __bind(this.strip0, this);
    this.format = __bind(this.format, this);
    this.stopTimer = __bind(this.stopTimer, this);
    this.startDecr = __bind(this.startDecr, this);
    this.startIncr = __bind(this.startIncr, this);
    this.setValue = __bind(this.setValue, this);
    this.onKey = __bind(this.onKey, this);
    this.onInputChange = __bind(this.onInputChange, this);
    this.init = __bind(this.init, this);
    return Spin.__super__.constructor.apply(this, arguments);
  }

  Spin.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    Spin.__super__.init.call(this, cfg, {
      type: 'spin',
      horizontal: true,
      child: {
        elem: 'table',
        type: 'spin-table',
        child: {
          elem: 'tr',
          type: 'spin-row',
          children: [
            {
              id: 'decr',
              elem: 'td',
              type: 'spin-td',
              child: {
                type: 'icon',
                icon: 'octicon-triangle-left'
              }
            }, {
              elem: 'td',
              type: 'spin-content',
              child: {
                type: 'input',
                "class": 'spin-input'
              }
            }, {
              id: 'incr',
              elem: 'td',
              type: 'spin-td',
              child: {
                type: 'icon',
                icon: 'octicon-triangle-right'
              }
            }
          ]
        }
      }
    });
    this.connect('decr:mousedown', this.startDecr);
    this.connect('decr:mouseup', this.stopTimer);
    this.connect('incr:mousedown', this.startIncr);
    this.connect('incr:mouseup', this.stopTimer);
    this.connect('input:mousedown', function(event) {
      return event.stopPropagation();
    });
    if (this.config.valueStep == null) {
      this.config.valueStep = this.range() > 1 && 1 || this.range() / 100;
    }
    this.elem.on('keypress', this.onKey);
    this.input = this.getChild('spin-input').elem;
    this.input.addEventListener('change', this.onInputChange);
    this.input.value = this.config.value;
    this.setValue(this.config.value);
    return this;
  };

  Spin.prototype.onInputChange = function() {
    log({
      "file": "./coffee/widgets/spin.coffee",
      "class": "Spin",
      "line": 71,
      "args": ["cfg", "defs"],
      "method": "onInputChange",
      "type": "."
    }, 'input change');
    return this.setValue(this.input.value);
  };

  Spin.prototype.onKey = function(event, e) {
    var _ref, _ref1, _ref2, _ref3;
    if ((_ref = event.key) === 'Up' || _ref === 'Down') {
      this.incr(event.key === 'Up' && '+' || '-');
      event.stop();
      return;
    }
    if ((_ref1 = event.key) === 'Return' || _ref1 === 'Enter' || _ref1 === 'Tab') {
      this.setValue(parseFloat(this.input.value));
      return;
    }
    if (_ref2 = event.key, __indexOf.call('0123456789-.', _ref2) < 0) {
      if (event.key.length === 1) {
        event.stop();
        return;
      }
    }
    if (_ref3 = event.key, __indexOf.call('-.', _ref3) >= 0) {
      if (this.input.value.indexOf(event.key) > -1) {
        event.stop();
      }
    }
  };

  Spin.prototype.setValue = function(a) {
    Spin.__super__.setValue.call(this, a);
    if (this.input != null) {
      return this.input.value = this.strip0(this.format(this.config.value));
    }
  };

  Spin.prototype.startIncr = function() {
    this.incr();
    return this.timer = setInterval(this.incr, Math.max(80, 2000 / this.steps()));
  };

  Spin.prototype.startDecr = function() {
    this.decr();
    return this.timer = setInterval(this.decr, Math.max(80, 2000 / this.steps()));
  };

  Spin.prototype.stopTimer = function() {
    return clearInterval(this.timer);
  };

  Spin.prototype.format = function(s) {
    if (this.config.format != null) {
      return this.config.format.fmt(s);
    }
    return String(s);
  };

  Spin.prototype.strip0 = function(s) {
    if (s.indexOf('.') > -1) {
      return s.replace(/(0+)$/, '').replace(/([\.]+)$/, '');
    }
    return String(s.strip());
  };

  return Spin;

})(Value);


/*

 0000000  00000000   000  000   000  000   000  00000000  00000000 
000       000   000  000  0000  000  0000  000  000       000   000
0000000   00000000   000  000 0 000  000 0 000  0000000   0000000  
     000  000        000  000  0000  000  0000  000       000   000
0000000   000        000  000   000  000   000  00000000  000   000
 */

Spinner = (function(_super) {
  __extends(Spinner, _super);

  function Spinner() {
    this.setValue = __bind(this.setValue, this);
    this.incr = __bind(this.incr, this);
    this.index = __bind(this.index, this);
    this.sliderFunc = __bind(this.sliderFunc, this);
    this.size2value = __bind(this.size2value, this);
    this.onWindowSize = __bind(this.onWindowSize, this);
    this.init = __bind(this.init, this);
    return Spinner.__super__.constructor.apply(this, arguments);
  }

  Spinner.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    Spinner.__super__.init.call(this, cfg, {
      tooltip: false,
      valueStep: 1,
      minValue: 0,
      maxValue: cfg.values.length - 1
    });
    Drag.create({
      cursor: 'ew-resize',
      target: this.getChild('spin-content').elem,
      doMove: false,
      onMove: this.sliderFunc,
      onStart: this.sliderFunc
    });
    this.input = null;
    return this;
  };

  Spinner.prototype.onWindowSize = function() {
    log({
      "file": "./coffee/widgets/spinner.coffee",
      "class": "Spinner",
      "line": 34,
      "args": ["cfg", "defs"],
      "method": "onWindowSize",
      "type": "."
    }, 'onWindowSize');
    return this.setValue(this.config.value);
  };

  Spinner.prototype.size2value = function(s) {
    return this.config.minValue + this.range() * s / this.getChild('spin-content').getWidth();
  };

  Spinner.prototype.sliderFunc = function(drag, event) {
    var d, i, pos, v, width;
    pos = this.getChild('spin-content').absPos();
    width = event.clientX - pos.x;
    v = this.size2value(width);
    d = v - this.range() / 2;
    i = this.range() / 2 + d * this.config.valueStep * this.steps() / this.range();
    i = this.clamp(this.round(i));
    return this.setValue(this.config.values[i]);
  };

  Spinner.prototype.index = function() {
    return this.config.values.indexOf(this.config.value);
  };

  Spinner.prototype.incr = function(d) {
    var i;
    if (d == null) {
      d = 1;
    }
    log({
      "file": "./coffee/widgets/spinner.coffee",
      "class": "Spinner",
      "line": 53,
      "args": ["d=1"],
      "method": "incr",
      "type": "."
    }, d);
    if (d === '+' || d === '++') {
      d = 1;
    } else if (d === '-' || d === '--') {
      d = -1;
    }
    i = this.clamp(this.index() + d);
    return this.setValue(this.config.values[i]);
  };

  Spinner.prototype.setValue = function(a) {
    var c, i, v, w;
    v = _.arg(a);
    i = this.config.values.indexOf(v);
    c = this.getChild('spin-content');
    log({
      "file": "./coffee/widgets/spinner.coffee",
      "class": "Spinner",
      "line": 63,
      "args": ["a"],
      "method": "setValue",
      "type": "."
    }, c.getWidth());
    c.clear();
    w = c.getWidth() / this.steps();
    log({
      "file": "./coffee/widgets/spinner.coffee",
      "class": "Spinner",
      "line": 66,
      "args": ["a"],
      "method": "setValue",
      "type": "."
    }, i, w);
    c.elem.insert('<div class="spinner-knob" style="width:%dpx; left:%dpx"/>'.fmt(w, i * w));
    this.config.value = this.config.values[i];
    c.elem.insert(String(this.config.value));
    return this.emitValue(this.config.value);
  };

  return Spinner;

})(Spin);


/*

 0000000  000   000   0000000 
000       000   000  000      
0000000    000 000   000  0000
     000     000     000   000
0000000       0       0000000
 */

Svg = (function(_super) {
  __extends(Svg, _super);

  function Svg() {
    this.init = __bind(this.init, this);
    return Svg.__super__.constructor.apply(this, arguments);
  }

  Svg.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    Svg.__super__.init.call(this, cfg, {
      type: 'svg'
    });
    this.svg = SVG(this.elem);
    this.svg.node.getWidget = this.returnThis;
    return this;
  };

  return Svg;

})(Widget);


/*

000000000   0000000    0000000    0000000   000      00000000
   000     000   000  000        000        000      000     
   000     000   000  000  0000  000  0000  000      0000000 
   000     000   000  000   000  000   000  000      000     
   000      0000000    0000000    0000000   0000000  00000000
 */

Toggle = (function(_super) {
  __extends(Toggle, _super);

  function Toggle() {
    this.onClick = __bind(this.onClick, this);
    this.toggle = __bind(this.toggle, this);
    this.getIndex = __bind(this.getIndex, this);
    this.setState = __bind(this.setState, this);
    this.init = __bind(this.init, this);
    return Toggle.__super__.constructor.apply(this, arguments);
  }

  Toggle.prototype.init = function(cfg, defs) {
    Toggle.__super__.init.call(this, cfg, _.def(defs, {
      "class": 'button',
      onClick: this.onClick,
      state: 'off',
      states: ['on', 'off'],
      icon: 'octicon-check',
      icons: ['octicon-check', 'octicon-x']
    }));
    if (this.config.onState != null) {
      this.elem.on('onState', this.config.onState);
    }
    this.setState(this.config.state);
    return this;
  };

  Toggle.prototype.setState = function(state) {
    var e;
    e = this.getChild('octicon').elem;
    e.removeClassName(this.config.icons[this.getIndex()]);
    this.elem.removeClassName(this.config.state);
    this.config.state = state;
    e.addClassName(this.config.icons[this.getIndex()]);
    this.elem.addClassName(this.config.state);
    return this.emit('onState', {
      state: this.config.state
    });
  };

  Toggle.prototype.getIndex = function() {
    return this.config.states.indexOf(this.config.state);
  };

  Toggle.prototype.toggle = function() {
    return this.setState(this.config.states[(this.getIndex() + 1) % this.config.states.length]);
  };

  Toggle.prototype.onClick = function() {
    return this.toggle();
  };

  return Toggle;

})(Button);


/*

000000000   0000000    0000000   000      000000000  000  00000000 
   000     000   000  000   000  000         000     000  000   000
   000     000   000  000   000  000         000     000  00000000 
   000     000   000  000   000  000         000     000  000      
   000      0000000    0000000   0000000     000     000  000
 */

Tooltip = (function() {
  function Tooltip() {}

  Tooltip.create = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      delay: 700
    });
    cfg.target.tooltip = cfg;
    cfg.target.elem.on('mousemove', Tooltip.onHover);
    cfg.target.elem.on('mouseleave', Tooltip.onLeave);
    return cfg.target.elem.on('mousedown', Tooltip.onLeave);
  };

  Tooltip.onHover = function(event, d) {
    var e, popup, tooltip, _i, _len, _ref, _ref1;
    _ref = [d, d.ancestors()].flatten();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      if ((e != null ? (_ref1 = e.widget) != null ? _ref1.tooltip : void 0 : void 0) != null) {
        tooltip = e.widget.tooltip;
        if (tooltip.window != null) {
          tooltip.window.close();
          tooltip.window = null;
        }
        if (tooltip.timer != null) {
          clearInterval(tooltip.timer);
        }
        popup = function() {
          return Tooltip.popup(e, Stage.absPos(event));
        };
        tooltip.timer = setInterval(popup, tooltip.delay);
        return;
      }
    }
  };

  Tooltip.popup = function(e, pos) {
    var text, tooltip;
    tooltip = e.widget.tooltip;
    if (tooltip.timer != null) {
      clearInterval(tooltip.timer);
      tooltip.timer = null;
    }
    if (tooltip.onTooltip != null) {
      text = tooltip.onTooltip();
    } else if (tooltip.text != null) {
      text = tooltip.text;
    } else {
      text = e.id;
    }
    return tooltip.window = new Window({
      "class": 'tooltip',
      parent: 'stage_content',
      isMovable: false,
      x: pos.x + 12,
      y: pos.y + 12,
      hasClose: false,
      hasShade: false,
      hasTitle: false,
      child: {
        text: text
      }
    });
  };

  Tooltip.onLeave = function(event, e) {
    var tooltip, w, _ref;
    if (tooltip = e != null ? (_ref = e.widget) != null ? _ref.tooltip : void 0 : void 0) {
      if (tooltip.timer != null) {
        clearInterval(tooltip.timer);
        tooltip.timer = null;
      }
      if (w = tooltip.window) {
        w.close();
        return e.widget.tooltip.window = null;
      }
    }
  };

  return Tooltip;

})();

//# sourceMappingURL=widgets.js.map
