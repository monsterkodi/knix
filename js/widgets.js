
/*

     0000000   0000000     0000000   000   000  000000000
    000   000  000   000  000   000  000   000     000
    000000000  0000000    000   000  000   000     000
    000   000  000   000  000   000  000   000     000
    000   000  0000000     0000000    0000000      000
 */
var About, Connection, Connector, Console, Hbox, Path, Slider, Value,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

About = (function(_super) {
  __extends(About, _super);

  function About(cfg, defs) {
    if (cfg == null) {
      cfg = {};
    }
    About.__super__.constructor.call(this, _.def(cfg, defs), {
      title: 'about',
      id: 'about',
      width: 240,
      minWidth: 100,
      minHeight: 240,
      center: true,
      child: {
        style: {
          paddingTop: '20px',
          textAlign: 'center',
          width: '100%'
        },
        children: [
          {
            text: 'Home',
            href: 'http://monsterkodi.github.io/knix/',
            style: {
              width: '100%',
              display: 'inline-block'
            }
          }, {
            text: '<svg viewbox="0 0 16 16" height="80" width="80" class="kitty-svg" style="margin-bottom:0"><path d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z" class="kitty"></path></svg>'
          }, {
            text: 'GitHub',
            href: 'https://github.com/monsterkodi/knix',
            style: {
              width: '100%',
              display: 'inline-block'
            }
          }, {
            type: 'tiny-text',
            style: {
              position: 'absolute',
              left: '1%',
              right: '1%',
              bottom: 0
            },
            text: 'version %s'.fmt(knix.version)
          }
        ]
      }
    });
  }

  About.show = function() {
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

Connection = (function() {
  function Connection(config) {
    this.shaded = __bind(this.shaded, this);
    this.close = __bind(this.close, this);
    this.update = __bind(this.update, this);
    this.signalSlotConnector = __bind(this.signalSlotConnector, this);
    this.disconnect = __bind(this.disconnect, this);
    this.connect = __bind(this.connect, this);
    var c, e, _i, _len, _ref;
    _ref = [config.source, config.target];
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
      startDir: config.source.isSignal() ? pos(100, 0) : pos(-100, 0),
      endDir: config.target.isSignal() ? pos(100, 0) : pos(-100, 0)
    });
    this.path.setStart(config.source.absCenter());
    this.path.setEnd(config.target.absCenter());
    this.config = config;
    this.connection = this.connect();
  }

  Connection.prototype.connect = function() {
    var signal, signalConnector, signalEvent, signalSender, slot, slotConnector, slotFunction, _ref, _ref1;
    _ref = this.signalSlotConnector(), signalConnector = _ref[0], slotConnector = _ref[1];
    signal = signalConnector.config.signal;
    slot = slotConnector.config.slot;
    log(this.path.path.id(), "connect", signal, slot);
    _ref1 = signalConnector.resolveSignal(signal), signalSender = _ref1[0], signalEvent = _ref1[1];
    slotFunction = slotConnector.resolveSlot(slot);
    return {
      handler: signalSender.elem.on(signalEvent, slotFunction),
      sender: signalSender,
      event: signalEvent,
      signal: signal,
      slot: slot,
      receiver: slotFunction
    };
  };

  Connection.prototype.disconnect = function() {
    log(this.path.path.id(), "disconnect", this.connection.signal, this.connection.slot);
    this.connection.handler.stop();
    return this.conncetion = null;
  };

  Connection.prototype.signalSlotConnector = function() {
    return [(this.config.source.config.signal != null ? this.config.source : void 0) || this.config.target, (this.config.source.config.slot != null ? this.config.source : void 0) || this.config.target];
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

Connector = (function(_super) {
  __extends(Connector, _super);

  function Connector(config) {
    this.dragStop = __bind(this.dragStop, this);
    this.dragStart = __bind(this.dragStart, this);
    this.dragMove = __bind(this.dragMove, this);
    this.connectorAtPos = __bind(this.connectorAtPos, this);
    this.delConnection = __bind(this.delConnection, this);
    this.addConnection = __bind(this.addConnection, this);
    this.isSlot = __bind(this.isSlot, this);
    this.isSignal = __bind(this.isSignal, this);
    this.close = __bind(this.close, this);
    if (config.slot != null) {
      config["class"] = 'slot';
    }
    if (config.signal != null) {
      config["class"] = 'signal';
    }
    Connector.__super__.constructor.call(this, config, {
      type: 'connector'
    });
    Drag.create({
      target: this.elem,
      minPos: pos(void 0, 0),
      cursor: 'grab',
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
    return this.elem.hasClassName('signal');
  };

  Connector.prototype.isSlot = function() {
    return this.elem.hasClassName('slot');
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

  Connector.prototype.connectorAtPos = function(p) {
    var elem;
    elem = document.elementFromPoint(p.x, p.y);
    if ((elem != null ? elem.widget : void 0) != null) {
      if (elem.widget.constructor === Connector && elem.widget.isSignal() !== this.isSignal()) {
        return elem.widget;
      }
    }
    return void 0;
  };

  Connector.prototype.dragMove = function(drag, event) {
    var conn, p;
    p = drag.absPos(event);
    if (conn = this.connectorAtPos(p)) {
      this.path.path.addClass('connectable');
      this.path.setStartDir(this.isSignal() ? pos(100, 0) : pos(-100, 0));
      this.path.setEndDir(conn.isSignal() ? pos(100, 0) : pos(-100, 0));
    } else {
      this.path.path.removeClass('connectable');
      this.path.setStartDir(this.isSignal() ? pos(200, 0) : pos(-200, 0));
      this.path.setEndDir(pos(0, 0));
    }
    this.handle.setPos(p);
    return this.path.setEnd(p);
  };

  Connector.prototype.dragStart = function(drag, event) {
    var p;
    p = drag.absPos(event);
    this.handle = knix.get({
      type: 'handle',
      style: {
        pointerEvents: 'none',
        cursor: 'grabbing'
      }
    });
    this.path = knix.get({
      type: 'path',
      "class": 'connector',
      startDir: this.isSignal() ? pos(200, 0) : pos(-200, 0)
    });
    this.elem.style.cursor = 'grabbing';
    this.path.setStart(p);
    this.path.setEnd(p);
    return this.handle.setPos(p);
  };

  Connector.prototype.dragStop = function(drag, event) {
    var conn, p;
    p = drag.absPos(event);
    if (conn = this.connectorAtPos(p)) {
      this.path.path.stroke({
        color: "rgba(0,100,255,1)"
      });
      new Connection({
        source: this,
        target: conn
      });
    }
    if (1) {
      this.handle.close();
      return this.path.path.remove();
    }
  };

  return Connector;

})(Widget);


/*

     0000000   0000000   000   000    000000    0000000   000      00000000
    000       000   000  0000  000  000        000   000  000      000
    000       000   000  000 0 000   0000000   000   000  000      0000000
    000       000   000  000  0000        000  000   000  000      000
     0000000   0000000   000   000   0000000    0000000   0000000  00000000
 */

Console = (function(_super) {
  __extends(Console, _super);

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
    }).apply(this, arguments)).join(" ");
    return html.replace(/[<]([^>]+)[>]/g, '<span class="console-type">&lt;$1&gt;</span>').replace(/([:,\.\{\}\(\)\[\]])/g, '<span class="console-punct">$1</span>').replace(/->/g, '<span class="octicon octicon-arrow-small-right"></span>');
  };

  Console.log = function() {
    var s;
    s = Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0));
    return Console.insert(s);
  };

  Console.error = function() {
    var s;
    s = '<span class="console-error">%s</span> '.fmt(str(arguments[0])) + Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 1));
    return Console.insert(s);
  };

  Console.insert = function(s) {
    $$(".console").each(function(e) {
      e.insert("<pre>" + s + "</pre>");
      return e.getWindow().scrollToBottom();
    });
    return this;
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

  function Console(cfg) {
    var h, w;
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
  }

  return Console;

})(Window);

Hbox = (function(_super) {
  __extends(Hbox, _super);

  function Hbox(config) {
    var cfg;
    cfg = _.def(config, {
      spacing: 5
    });
    Hbox.__super__.constructor.call(this, cfg, {
      type: 'hbox',
      style: {
        display: 'table',
        borderSpacing: '%dpx 0px'.fmt(cfg.spacing),
        marginRight: '-%dpx'.fmt(cfg.spacing),
        marginLeft: '-%dpx'.fmt(cfg.spacing)
      },
      child: {
        type: 'content',
        style: {
          display: 'table-row',
          width: '100%'
        }
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
      startDir: pos(100, 0),
      end: pos(200, 200),
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
    this.config.endHead = this.config.end.add(this.config.endDir);
    this.setStart(this.config.start);
    this.setEnd(this.config.end);
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

Slider = (function(_super) {
  __extends(Slider, _super);

  function Slider(cfg) {
    this.setValue = __bind(this.setValue, this);
    this.setBarValue = __bind(this.setBarValue, this);
    this.valueToPercentOfWidth = __bind(this.valueToPercentOfWidth, this);
    var sizeCB, sliderFunc;
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
      child: {
        type: 'slider-bar',
        child: {
          type: 'slider-knob'
        }
      }
    });
    this.setBarValue(this.config.value);
    sizeCB = function(event, e) {
      return this.setValue(this.config.value);
    };
    if (this.getWindow()) {
      this.getWindow().elem.on("size", sizeCB.bind(this));
    }
    Drag.create({
      cursor: 'ew-resize',
      target: this.elem,
      doMove: false,
      onMove: sliderFunc,
      onStart: sliderFunc
    });
  }

  Slider.prototype.valueToPercentOfWidth = function(value) {
    var barFactor, barPercent, borderWidth, cfg, knobMinPercent, knobWidth;
    cfg = this.config;
    knobWidth = this.getChild('slider-knob').getWidth();
    borderWidth = this.getChild('slider-bar').getHeight() - this.getChild('slider-bar').innerHeight();
    knobMinPercent = 100 * (knobWidth + borderWidth) / Math.max(1, this.getWidth());
    barFactor = (value - cfg.minValue) / (cfg.maxValue - cfg.minValue);
    barPercent = knobMinPercent + ((100 - knobMinPercent) * barFactor);
    return barPercent;
  };

  Slider.prototype.setBarValue = function(barValue) {
    var pct;
    pct = this.valueToPercentOfWidth(barValue);
    return this.getChild('slider-bar').elem.style.width = "%.2f%%".fmt(pct);
  };

  Slider.prototype.setValue = function(arg) {
    var oldValue, v;
    oldValue = this.config.value;
    v = this.round(this.clamp(this.slotArg(arg, 'value')));
    if (v !== oldValue) {
      this.config.value = v;
      this.setBarValue(v);
      this.emit('onValue', {
        value: v
      });
    }
    return this;
  };

  return Slider;

})(Widget);


/*

    000   000   0000000   000      000   000  00000000
    000   000  000   000  000      000   000  000
    000   000  000000000  000      000   000  0000000
     00   00   000   000  000      000   000  000
       000     000   000  0000000   0000000   00000000
 */

Value = (function(_super) {
  __extends(Value, _super);

  function Value(cfg) {
    this.incr = __bind(this.incr, this);
    this.setValue = __bind(this.setValue, this);
    Value.__super__.constructor.call(this, cfg, {
      type: 'value',
      value: 0,
      minValue: 0,
      maxValue: 100,
      horizontal: true,
      child: {
        elem: 'table',
        type: 'value-table',
        onDown: function(event, e) {
          return event.stopPropagation();
        },
        child: {
          elem: 'tr',
          type: 'value-row',
          children: [
            {
              elem: 'td',
              type: 'value-td',
              child: {
                type: 'icon',
                icon: 'octicon-triangle-left',
                onClick: function(event, e) {
                  var value;
                  value = e.getParent('value');
                  return value.incr('-');
                }
              }
            }, {
              elem: 'td',
              type: 'value-content',
              child: {
                type: 'input',
                "class": 'value-input'
              }
            }, {
              elem: 'td',
              type: 'value-td',
              child: {
                type: 'icon',
                icon: 'octicon-triangle-right'
              },
              onClick: function(event, e) {
                return e.getParent('value').incr('+');
              }
            }
          ]
        }
      }
    });
    this.input = this.getChild('value-input').elem;
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
      return this.getParent('value').setValue(this.getValue());
    });
    this.input.value = this.config.value;
    this.setValue(this.config.value);
  }

  Value.prototype.setValue = function(arg) {
    var oldValue, v;
    oldValue = this.config.value;
    v = this.round(this.clamp(this.slotArg(arg, 'value')));
    this.input.value = this.strip0(this.format(v));
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

  return Value;

})(Widget);

//# sourceMappingURL=widgets.js.map
