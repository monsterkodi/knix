
/*

000   000   0000000   000      000   000  00000000
000   000  000   000  000      000   000  000     
 000 000   000000000  000      000   000  0000000 
   000     000   000  000      000   000  000     
    0      000   000  0000000   0000000   00000000
 */
var About, Button, Connection, Connector, Console, Hbox, Path, Slider, Sliderspin, Spin, Toggle, Tooltip, Value, tag,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Value = (function(_super) {
  __extends(Value, _super);

  function Value(cfg, def) {
    this.round = __bind(this.round, this);
    this.clamp = __bind(this.clamp, this);
    this.decr = __bind(this.decr, this);
    this.incr = __bind(this.incr, this);
    this.setValue = __bind(this.setValue, this);
    this.initEvents = __bind(this.initEvents, this);
    this.onTooltip = __bind(this.onTooltip, this);
    Value.__super__.constructor.call(this, _.def(cfg, def), {
      value: 0,
      minValue: 0,
      maxValue: 100
    });
    Tooltip.create({
      target: this,
      onTooltip: this.onTooltip
    });
  }

  Value.prototype.onTooltip = function() {
    return this.elem.id;
  };

  Value.prototype.initEvents = function() {
    if (this.config.onValue != null) {
      this.elem.on("onValue", this.config.onValue);
    }
    return Value.__super__.initEvents.apply(this, arguments);
  };

  Value.prototype.setValue = function(arg) {
    var oldValue, v;
    oldValue = this.config.value;
    v = this.round(this.clamp(_.arg(arg)));
    if (v !== oldValue) {
      this.config.value = v;
      this.emit('onValue', {
        value: v
      });
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
    if (this.config.valueStep != null) {
      step = this.config.valueStep;
    } else {
      step = 1;
    }
    return this.setValue(this.input.getValue() + step * d);
  };

  Value.prototype.decr = function() {
    return this.incr(-1);
  };

  Value.prototype.clamp = function(v) {
    return _.clamp(this.config.minValue, this.config.maxValue, v);
  };

  Value.prototype.round = function(v) {
    var d, r;
    r = v;
    if (this.config.valueStep != null) {
      d = v - Math.round(v / this.config.valueStep) * this.config.valueStep;
      r -= d;
    }
    return r;
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

  function Hbox(cfg, defs) {
    this.insertChild = __bind(this.insertChild, this);
    var spacing;
    cfg = _.def(cfg, defs);
    spacing = (cfg.spacing != null) && cfg.spacing || 5;
    Hbox.__super__.constructor.call(this, cfg, {
      spacing: 5,
      type: 'hbox',
      style: {
        display: 'table',
        borderSpacing: '%dpx 0px'.fmt(spacing),
        marginRight: '-%dpx'.fmt(spacing),
        marginLeft: '-%dpx'.fmt(spacing)
      }
    });
  }

  Hbox.prototype.insertChild = function(cfg) {
    var child;
    child = Hbox.__super__.insertChild.call(this, cfg);
    child.elem.style.display = 'table-cell';
    child.elem.style.marginLeft = '10px';
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

  function About(cfg, defs) {
    if (cfg == null) {
      cfg = {};
    }
    this.url = 'http://monsterkodi.github.io/knix/';
    About.__super__.constructor.call(this, _.def(cfg, defs), {
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
  }

  About.show = function() {
    log({
      "file": "./coffee/widgets/about.coffee",
      "line": 58,
      "class": "About",
      "args": ["cfg={}", "defs"],
      "method": "show",
      "type": "@"
    }, "about...");
    if ($('about')) {
      return $('about').raise();
    } else {
      return new About;
    }
  };

  About.menu = function() {
    return knix.create({
      type: 'button',
      id: 'show_about',
      icon: 'octicon-info',
      "class": 'tool-button',
      parent: 'tool',
      onClick: function() {
        return About.show();
      }
    });
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

  function Button(cfg, defs) {
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
    Button.__super__.constructor.call(this, cfg, {
      type: 'button',
      noDown: true
    });
  }

  return Button;

})(Widget);


/*

 0000000   0000000   000   000  000   000  00000000   0000000  000000000  000   0000000   000   000
000       000   000  0000  000  0000  000  000       000          000     000  000   000  0000  000
000       000   000  000 0 000  000 0 000  0000000   000          000     000  000   000  000 0 000
000       000   000  000  0000  000  0000  000       000          000     000  000   000  000  0000
 0000000   0000000   000   000  000   000  00000000   0000000     000     000   0000000   000   000
 */

Connection = (function() {
  function Connection(config) {
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
    var c, e, _i, _len, _ref;
    log({
      "file": "./coffee/widgets/connection.coffee",
      "line": 15,
      "class": "Connection",
      "args": ["config"],
      "method": "constructor",
      "type": "."
    }, config.source.elem.id, config.target.elem.id);
    this.config = config;
    _ref = [this.config.source, this.config.target];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c.addConnection(this);
      e = c.elem;
      c.getWindow().elem.on('size', this.update);
      c.getWindow().elem.on('move', this.update);
      c.getWindow().elem.on('shade', this.shaded);
      c.getWindow().elem.on('close', this.close);
    }
    this.path = knix.get({
      type: 'path',
      "class": 'connection',
      startDir: this.config.source.isOut() ? pos(100, 1) : pos(-100, -1),
      endDir: this.config.target.isOut() ? pos(100, 1) : pos(-100, -1),
      onOver: this.onOver,
      onOut: this.onOut,
      onMove: this.onMove
    });
    this.drag = Drag.create({
      target: this.path.path,
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

  Connection.prototype.onOver = function(event, e) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.addClassName('highlight');
    farther.elem.removeClassName('highlight');
    return this.path.path.addClass('highlight');
  };

  Connection.prototype.onMove = function(event, e) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.addClassName('highlight');
    return farther.elem.removeClassName('highlight');
  };

  Connection.prototype.onOut = function(event, e) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.removeClassName('highlight');
    farther.elem.removeClassName('highlight');
    return this.path.path.removeClass('highlight');
  };

  Connection.prototype.connect = function() {
    var connection, inConnector, outConnector, signal, signalEvent, signalSender, slot, slotFunction, _ref, _ref1;
    _ref = this.outInConnector(), outConnector = _ref[0], inConnector = _ref[1];
    if (outConnector.config.onConnect != null) {
      outConnector.config.onConnect(outConnector, inConnector);
    }
    if (inConnector.config.onConnect != null) {
      inConnector.config.onConnect(inConnector, outConnector);
    }
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
      log({
        "file": "./coffee/widgets/connection.coffee",
        "line": 116,
        "class": "Connection",
        "args": ["event", "e"],
        "method": "disconnect",
        "type": "."
      }, "disconnect", this.connection.out.elem.id, this.connection["in"].elem.id);
      if (this.connection.out.config.onDisconnect != null) {
        this.connection.out.config.onDisconnect(this.connection.out, this.connection["in"]);
      }
      if (this.connection["in"].config.onDisconnect != null) {
        this.connection["in"].config.onDisconnect(this.connection["in"], this.connection.out);
      }
      if (((_ref = this.connection) != null ? _ref.handler : void 0) != null) {
        this.connection.handler.stop();
      }
      return this.connection = null;
    }
  };

  Connection.prototype.outInConnector = function() {
    return [(this.config.source.isOut() != null ? this.config.source : void 0) || this.config.target, (this.config.source.isIn() != null ? this.config.source : void 0) || this.config.target];
  };

  Connection.prototype.update = function(event, e) {
    this.path.setStart(this.config.source.absCenter());
    return this.path.setEnd(this.config.target.absCenter());
  };

  Connection.prototype.close = function() {
    this.disconnect();
    this.config.source.delConnection(this);
    this.config.target.delConnection(this);
    this.path.close();
    this.path = null;
    return this.config = null;
  };

  Connection.prototype.shaded = function(event, e) {
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

  function Connector(config) {
    this.dragStop = __bind(this.dragStop, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.onOut = __bind(this.onOut, this);
    this.onOver = __bind(this.onOver, this);
    this.connectorAtPos = __bind(this.connectorAtPos, this);
    this.canConnectTo = __bind(this.canConnectTo, this);
    this.delConnection = __bind(this.delConnection, this);
    this.addConnection = __bind(this.addConnection, this);
    this.isOut = __bind(this.isOut, this);
    this.isIn = __bind(this.isIn, this);
    this.isSlot = __bind(this.isSlot, this);
    this.isSignal = __bind(this.isSignal, this);
    this.close = __bind(this.close, this);
    if (config.slot != null) {
      config["class"] = 'slot';
    }
    if (config.signal != null) {
      config["class"] = 'signal';
    }
    if (config["in"] != null) {
      config["class"] = 'in';
    }
    if (config.out != null) {
      config["class"] = 'out';
    }
    Connector.__super__.constructor.call(this, config, {
      type: 'connector',
      onOver: this.onOver,
      onOut: this.onOut
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
    this.connections = new Set();
  }

  Connector.prototype.close = function() {
    this.connections.clear();
    this.connections = null;
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

  Connector.prototype.addConnection = function(c) {
    this.connections.add(c);
    return this.elem.addClassName('connected');
  };

  Connector.prototype.delConnection = function(c) {
    this.connections["delete"](c);
    if (this.connections.size === 0) {
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
    this.handle = knix.get({
      type: 'handle',
      style: {
        cursor: 'grabbing'
      }
    });
    this.handle.setPos(p);
    this.elem.addClassName('connected');
    this.path = knix.get({
      type: 'path',
      "class": 'connector',
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
    } else if (this.connections.size === 0) {
      this.elem.removeClassName('connected');
    }
    if (1) {
      this.handle.close();
      return this.path.path.remove();
    }
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

  Console.scopeTags = [];

  function Console(cfg) {
    this.toggleMethods = __bind(this.toggleMethods, this);
    this.toggleClasses = __bind(this.toggleClasses, this);
    this.addLogTag = __bind(this.addLogTag, this);
    this.updateTags = __bind(this.updateTags, this);
    this.logInfo = __bind(this.logInfo, this);
    this.insert = __bind(this.insert, this);
    this.onTagState = __bind(this.onTagState, this);
    this.onContextMenu = __bind(this.onContextMenu, this);
    var h, w;
    this.logTags = {
      'knix': 'off',
      'Stage': 'off',
      'Widget': 'off',
      'Window': 'off',
      'layout': 'off',
      'todo': 'off',
      'Connection': 'off'
    };
    w = Stage.size().width / 2;
    h = Stage.size().height - $('menu').getHeight() - 2;
    Console.__super__.constructor.call(this, cfg, {
      title: 'console',
      "class": 'console-window',
      x: w,
      y: $('menu').getHeight() + 2,
      width: w,
      height: h,
      content: 'scroll',
      showMethods: true,
      showClasses: true,
      buttons: [
        {
          "class": 'window-button-right',
          child: {
            type: 'icon',
            icon: 'octicon-trashcan'
          },
          onClick: function(event, e) {
            return e.getWindow().getChild('console').clear();
          }
        }, {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-diff-added'
          },
          onClick: function(event, e) {
            return e.getWindow().maximize();
          }
        }
      ],
      child: {
        "class": 'console',
        text: '<span class="tiny-text" style="vertical-align:top">console - knix version ' + knix.version + '</span>',
        noDown: true
      }
    });
    this.elem.on('contextmenu', this.onContextMenu);
  }

  Console.prototype.onContextMenu = function(event, e) {
    var children, tag;
    children = [];
    for (tag in this.logTags) {
      if (!tag.startsWith('@') && !tag.startsWith('.')) {
        children.push({
          type: 'toggle',
          text: tag,
          state: this.logTags[tag],
          onState: this.onTagState
        });
      }
    }
    children.push({
      type: 'button',
      text: 'ok',
      onClick: function(event, e) {
        return e.getWindow().close();
      }
    });
    knix.get({
      hasClose: false,
      hasMaxi: false,
      title: 'tags',
      resize: false,
      hasShade: false,
      popup: true,
      pos: Stage.absPos(event),
      console: this,
      children: children,
      buttons: [
        {
          "class": 'window-button-left',
          child: {
            type: 'icon',
            icon: 'octicon-x'
          },
          onClick: function(event, e) {
            var t, _i, _len, _ref, _results;
            _ref = e.getWindow().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('off'));
            }
            return _results;
          }
        }, {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-check'
          },
          onClick: function(event, e) {
            var t, _i, _len, _ref, _results;
            _ref = e.getWindow().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('on'));
            }
            return _results;
          }
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

  Console.prototype.onTagState = function(event, e) {
    var tag;
    tag = e.widget.config.text;
    this.logTags[tag] = event.detail.state;
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

  Console.prototype.updateTags = function(tags) {
    var tag, tagElem, tagElems, tclass, _i, _len, _results;
    tagElems = this.elem.select('pre');
    for (_i = 0, _len = tagElems.length; _i < _len; _i++) {
      tagElem = tagElems[_i];
      tagElem.style.display = 'none';
    }
    _results = [];
    for (tag in this.logTags) {
      if ((this.logTags[tag] != null) && (this.logTags[tag] === true || this.logTags[tag] === 'on')) {
        tclass = '.log_' + tag.replace(/[\/@]/g, '_');
        tagElems = this.elem.select(tclass);
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = tagElems.length; _j < _len1; _j++) {
            tagElem = tagElems[_j];
            _results1.push(tagElem.style.display = '');
          }
          return _results1;
        })());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Console.prototype.addLogTag = function(tag) {
    if (this.logTags[tag] == null) {
      return this.logTags[tag] = true;
    }
  };

  Console.prototype.toggleClasses = function() {
    var t, _i, _len, _ref, _results;
    this.config.showClasses = !this.config.showClasses;
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

  Console.menu = function() {
    return knix.create({
      type: 'button',
      id: 'open_console',
      icon: 'octicon-terminal',
      "class": 'tool-button',
      parent: 'tool',
      onClick: function() {
        return new Console();
      }
    });
  };

  return Console;

})(Window);

tag = Console.setScopeTags;


/*

00000000    0000000   000000000  000   000
000   000  000   000     000     000   000
00000000   000000000     000     000000000
000        000   000     000     000   000
000        000   000     000     000   000
 */

Path = (function(_super) {
  __extends(Path, _super);

  function Path(config, defaults) {
    this.setCtrl = __bind(this.setCtrl, this);
    this.setEnd = __bind(this.setEnd, this);
    this.setStart = __bind(this.setStart, this);
    this.setStartHead = __bind(this.setStartHead, this);
    this.setEndHead = __bind(this.setEndHead, this);
    this.setStartDir = __bind(this.setStartDir, this);
    this.setEndDir = __bind(this.setEndDir, this);
    this.setVisible = __bind(this.setVisible, this);
    this.close = __bind(this.close, this);
    var clss, _i, _len, _ref;
    this.config = _.def(config, _.def(defaults, {
      start: pos(0, 0),
      startDir: pos(0, 0),
      end: pos(0, 0),
      endDir: pos(0, 0),
      svg: knix.svg
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
    this.elem = this.path;
    this.config.endHead = this.config.end.add(this.config.endDir);
    this.config.startHead = this.config.start.add(this.config.startDir);
    this.setStart(this.config.start);
    this.setEnd(this.config.end);
    this.initEvents();
  }

  Path.prototype.close = function() {
    this.path.remove();
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

  Path.prototype.setStart = function(p) {
    this.config.start = p;
    this.config.startHead = this.config.start.add(this.config.startDir);
    this.config.mid = this.config.startHead.mid(this.config.endHead);
    this.setCtrl(0, this.config.start);
    this.setCtrl(1, this.config.startHead);
    return this.setCtrl(2, this.config.mid);
  };

  Path.prototype.setEnd = function(p) {
    this.config.end = p;
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

 0000000  000      000  0000000    00000000  00000000 
000       000      000  000   000  000       000   000
0000000   000      000  000   000  0000000   0000000  
     000  000      000  000   000  000       000   000
0000000   0000000  000  0000000    00000000  000   000
 */

Slider = (function(_super) {
  __extends(Slider, _super);

  function Slider(cfg) {
    this.setBarValue = __bind(this.setBarValue, this);
    this.setValue = __bind(this.setValue, this);
    this.valueToPercentOfWidth = __bind(this.valueToPercentOfWidth, this);
    this.onWindowSize = __bind(this.onWindowSize, this);
    var sliderFunc;
    sliderFunc = function(drag, event) {
      var pos, slider, v, width;
      slider = drag.target.widget;
      pos = slider.absPos();
      width = event.clientX - pos.x;
      v = slider.size2value(width);
      return slider.setValue(v);
    };
    Slider.__super__.constructor.call(this, cfg, {
      type: 'slider',
      value: 0,
      minValue: 0,
      maxValue: 100,
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
  }

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

  function Sliderspin(cfg, defs) {
    cfg = _.def(cfg, defs);
    Sliderspin.__super__.constructor.call(this, cfg, {
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
          id: cfg.id,
          value: cfg.value,
          minValue: cfg.minValue,
          maxValue: cfg.maxValue,
          onValue: cfg.onValue,
          valueStep: cfg.spinStep,
          minWidth: 80,
          format: "%3.2f",
          style: {
            width: '10%'
          }
        }, {
          type: 'connector',
          signal: cfg.id + ':onValue'
        }
      ]
    });
    this.connect(cfg.id + '_slider:onValue', cfg.id + ':setValue');
    this.connect(cfg.id + ':onValue', cfg.id + '_slider:setValue');
  }

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

  function Spin(cfg) {
    this.strip0 = __bind(this.strip0, this);
    this.format = __bind(this.format, this);
    this.stopTimer = __bind(this.stopTimer, this);
    this.startDecr = __bind(this.startDecr, this);
    this.startIncr = __bind(this.startIncr, this);
    this.setValue = __bind(this.setValue, this);
    var range;
    Spin.__super__.constructor.call(this, cfg, {
      type: 'spin',
      horizontal: true,
      child: {
        elem: 'table',
        type: 'spin-table',
        onDown: function(event, e) {
          return event.stopPropagation();
        },
        child: {
          elem: 'tr',
          type: 'spin-row',
          children: [
            {
              elem: 'td',
              type: 'spin-td',
              onDown: this.startDecr,
              onUp: this.stopTimer,
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
              elem: 'td',
              type: 'spin-td',
              onDown: this.startIncr,
              onUp: this.stopTimer,
              child: {
                type: 'icon',
                icon: 'octicon-triangle-right'
              }
            }
          ]
        }
      }
    });
    if (this.config.valueStep == null) {
      range = this.config.maxValue - this.config.minValue;
      this.config.valueStep = range > 1 && 1 || range / 100;
    }
    this.input = this.getChild('spin-input').elem;
    this.elem.on('keypress', function(event, e) {
      var _ref, _ref1, _ref2;
      if ((_ref = event.key) === 'Up' || _ref === 'Down') {
        this.widget.incr(event.key === 'Up' && '+' || '-');
        event.stop();
        return;
      }
      if (_ref1 = event.key, __indexOf.call('0123456789-.', _ref1) < 0) {
        if (event.key.length === 1) {
          event.stop();
          return;
        }
      }
      if (_ref2 = event.key, __indexOf.call('-.', _ref2) >= 0) {
        if (this.widget.input.value.indexOf(event.key) > -1) {
          event.stop();
        }
      }
    });
    this.input.on('change', function(event, e) {
      return this.getParent('spin').setValue(this.getValue());
    });
    this.input.value = this.config.value;
    this.setValue(this.config.value);
  }

  Spin.prototype.setValue = function() {
    Spin.__super__.setValue.apply(this, arguments);
    return this.input.value = this.strip0(this.format(this.config.value));
  };

  Spin.prototype.startIncr = function() {
    this.incr();
    return this.timer = setInterval(this.incr, 80);
  };

  Spin.prototype.startDecr = function() {
    this.decr();
    return this.timer = setInterval(this.decr, 80);
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

000000000   0000000    0000000    0000000   000      00000000
   000     000   000  000        000        000      000     
   000     000   000  000  0000  000  0000  000      0000000 
   000     000   000  000   000  000   000  000      000     
   000      0000000    0000000    0000000   0000000  00000000
 */

Toggle = (function(_super) {
  __extends(Toggle, _super);

  function Toggle(cfg, defs) {
    this.onClick = __bind(this.onClick, this);
    this.toggle = __bind(this.toggle, this);
    this.setState = __bind(this.setState, this);
    this.getState = __bind(this.getState, this);
    Toggle.__super__.constructor.call(this, cfg, _.def(defs, {
      "class": 'button',
      icon: 'octicon-x',
      iconon: 'octicon-check',
      onClick: this.onClick,
      state: 'off'
    }));
    if (this.config.onState != null) {
      this.elem.on('onState', this.config.onState);
    }
    this.setState(cfg.state);
  }

  Toggle.prototype.getState = function() {
    return ((!this.config.state) || this.config.state === 'off') && 'off' || 'on';
  };

  Toggle.prototype.setState = function(state) {
    var e;
    this.elem.removeClassName(this.getState());
    e = this.getChild('octicon').elem;
    if ((state == null) || !state || state === 'off') {
      e.removeClassName(this.config.iconon);
      e.addClassName(this.config.icon);
      this.config.state = 'off';
    } else {
      e.removeClassName(this.config.icon);
      e.addClassName(this.config.iconon);
      this.config.state = 'on';
    }
    this.elem.addClassName(this.config.state);
    return this.emit('onState', {
      state: this.config.state
    });
  };

  Toggle.prototype.toggle = function() {
    return this.setState(this.getState() === 'on' && 'off' || 'on');
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
    return cfg.target.elem.on('mouseleave', Tooltip.onLeave);
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
      x: pos.x,
      y: pos.y,
      text: text,
      hasClose: false,
      hasShade: false,
      hasTitle: false
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
