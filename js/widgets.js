
/*

000   000   0000000   000      000   000  00000000
000   000  000   000  000      000   000  000     
 000 000   000000000  000      000   000  0000000 
   000     000   000  000      000   000  000     
    0      000   000  0000000   0000000   00000000
 */
var Button, Canvas, Connection, Connector, Handle, Hbox, Icon, Input, Menu, Pad, Path, Range, Selectangle, Slider, Sliderspin, Spin, Spinner, Svg, Toggle, Tooltip, Value,
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
    this.init = __bind(this.init, this);
    return Value.__super__.constructor.apply(this, arguments);
  }

  Value.prototype.init = function(cfg, def) {
    cfg = _.def(cfg, def);
    return Value.__super__.init.call(this, cfg, {
      value: 0,
      minValue: -Number.MAX_VALUE / 2,
      maxValue: +Number.MAX_VALUE / 2,
      noMove: true
    });
  };

  Value.prototype.initEvents = function() {
    var win;
    if (this.config.onValue != null) {
      if (_.isString(this.config.onValue)) {
        win = this.getWindow();
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


  /*
  000000000   0000000    0000000   000       0000000
     000     000   000  000   000  000      000     
     000     000   000  000   000  000      0000000 
     000     000   000  000   000  000           000
     000      0000000    0000000   0000000  0000000
   */

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
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      valign: 'middle',
      spacing: 5
    });
    Hbox.__super__.init.call(this, cfg, {
      type: 'hbox',
      style: {
        display: 'table',
        borderSpacing: '%dpx 0px'.fmt(cfg.spacing),
        marginRight: '-%dpx'.fmt(cfg.spacing),
        marginLeft: '-%dpx'.fmt(cfg.spacing)
      }
    });
    return this;
  };

  Hbox.prototype.insertChild = function(cfg) {
    var child;
    child = Hbox.__super__.insertChild.call(this, cfg);
    child.elem.style.display = 'table-cell';
    child.elem.style.verticalAlign = (cfg.valign != null) && cfg.valign || this.config.valign;
    return child;
  };

  return Hbox;

})(Widget);


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
    this.release = __bind(this.release, this);
    this.trigger = __bind(this.trigger, this);
    this.insertText = __bind(this.insertText, this);
    this.init = __bind(this.init, this);
    return Button.__super__.constructor.apply(this, arguments);
  }

  Button.prototype.init = function(cfg, defs) {
    var children;
    cfg = _.def(cfg, defs);
    children = [];
    if (cfg.icon != null) {
      children.push({
        type: 'icon',
        icon: cfg.icon
      });
    }
    Button.__super__.init.call(this, cfg, {
      keys: [],
      type: 'button',
      noMove: true,
      children: children
    });
    this.connect('mousedown', this.trigger);
    return this.connect('mouseup', this.release);
  };

  Button.prototype.insertText = function() {
    if (this.config.menu !== 'menu') {
      return Button.__super__.insertText.apply(this, arguments);
    }
  };

  Button.prototype.trigger = function(event) {
    var id, _base, _ref;
    id = _.isString(event) && event || (event != null ? (_ref = event.target) != null ? _ref.id : void 0 : void 0) || this.config.recKey;
    if (typeof (_base = this.config).action === "function") {
      _base.action(event);
    }
    this.emit('trigger', id);
    if (event != null) {
      if (typeof event.stop === "function") {
        event.stop();
      }
    }
    return this;
  };

  Button.prototype.release = function(event) {
    var id, _ref;
    id = _.isString(event) && event || (event != null ? (_ref = event.target) != null ? _ref.id : void 0 : void 0) || this.config.recKey;
    this.emit('release', id);
    return this;
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
    this.drag = new Drag({
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
      _ref1 = outConnector.getWindow().resolveSignal(signal), signalSender = _ref1[0], signalEvent = _ref1[1];
      slotFunction = inConnector.getWindow().resolveSlot(slot);
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
    if (this.connection != null) {
      this.connection.out.emit('onDisconnect', {
        source: this.connection.out,
        target: this.connection["in"]
      });
      if (((_ref = this.connection) != null ? _ref.handler : void 0) != null) {
        this.connection.handler.stop();
      }
      return delete this.connection;
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
      delete this.config;
    }
    if (this.path != null) {
      this.path.close();
      return delete this.path;
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
    new Drag({
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
    elem = Stage.elementAtPos(p);
    this.handle.elem.style.pointerEvents = 'auto';
    if (elem.getWidget()) {
      if (elem.getWidget().constructor === Connector && this.canConnectTo(elem.getWidget())) {
        return elem.getWidget();
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
    this.handle = new Widget({
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
      if (this.conn != null) {
        this.conn.elem.removeClassName('highlight');
        delete this.conn;
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
    this.move = __bind(this.move, this);
    this.absPos = __bind(this.absPos, this);
    this.relPos = __bind(this.relPos, this);
    this.constrain = __bind(this.constrain, this);
    this.close = __bind(this.close, this);
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

  Handle.prototype.close = function() {
    var _ref;
    if ((_ref = this.circle) != null) {
      _ref.remove();
    }
    this.circle = void 0;
    return Handle.__super__.close.call(this);
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

  Handle.prototype.move = function(p) {
    return this.setPos(this.absPos().plus(p));
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
    this.setIcon = __bind(this.setIcon, this);
    this.init = __bind(this.init, this);
    return Icon.__super__.constructor.apply(this, arguments);
  }

  Icon.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      type: 'icon',
      elem: 'span'
    });
    return Icon.__super__.init.call(this, cfg, {
      child: {
        elem: 'i',
        "class": (cfg.icon.startsWith('fa') && 'fa ' || 'octicon ') + cfg.icon
      }
    });
  };

  Icon.prototype.setIcon = function(icon) {
    var e;
    e = this.elem.firstChild;
    e.removeClassName(this.config.icon);
    this.config.icon = icon;
    return e.addClassName(this.config.icon);
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

00     00  00000000  000   000  000   000
000   000  000       0000  000  000   000
000000000  0000000   000 0 000  000   000
000 0 000  000       000  0000  000   000
000   000  00000000  000   000   0000000
 */

Menu = (function(_super) {
  __extends(Menu, _super);

  function Menu() {
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.isSubmenu = __bind(this.isSubmenu, this);
    this.init = __bind(this.init, this);
    return Menu.__super__.constructor.apply(this, arguments);
  }

  Menu.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    Menu.__super__.init.call(this, cfg, {
      type: 'menu'
    });
    return this;
  };

  Menu.prototype.isSubmenu = function() {
    return this.elem.hasClassName('submenu');
  };

  Menu.prototype.show = function() {
    var parent;
    if (this.isSubmenu()) {
      $('stage_content').appendChild(this.elem);
      parent = $(this.config.parentID).widget;
      this.setPos(parent.absPos().plus(pos(0, parent.getHeight())));
    }
    this.elem.addEventListener('click', this.hide);
    this.elem.addEventListener('mouseleave', this.hide);
    return Menu.__super__.show.apply(this, arguments);
  };

  Menu.prototype.hide = function() {
    if (this.isSubmenu()) {
      this.elem.removeEventListener('mousedown', this.hide);
      this.elem.removeEventListener('mouseleave', this.hide);
    }
    return Menu.__super__.hide.apply(this, arguments);
  };


  /*
   0000000  000000000   0000000   000000000  000   0000000
  000          000     000   000     000     000  000     
  0000000      000     000000000     000     000  000     
       000     000     000   000     000     000  000     
  0000000      000     000   000     000     000   0000000
   */

  Menu.menu = function(id) {
    var _ref;
    return (_ref = $(id)) != null ? _ref.getWidget() : void 0;
  };

  Menu.addButton = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    return Menu.menu(cfg.menu).insertChild(cfg, {
      type: 'button',
      "class": 'tool-button',
      id: cfg.menu + '_button_' + cfg.text,
      tooltip: cfg.text
    });
  };

  Menu.showContextMenu = function(event) {
    var btn, children, e, m, _i, _len, _ref, _ref1, _ref2;
    event.preventDefault();
    m = Menu.menu('context-menu');
    if (m != null) {
      m.setPos(Stage.absPos(event));
      return;
    }
    children = [];
    _ref2 = (_ref = $('audio')) != null ? (_ref1 = _ref.getWidget()) != null ? _ref1.elem.childNodes : void 0 : void 0;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      e = _ref2[_i];
      btn = _.clone(e.widget.config);
      btn.id = void 0;
      btn.parent = 'context-menu';
      btn.menu = 'context-menu';
      btn["class"] = 'tool-button';
      btn.func = e.widget.config.action;
      btn.action = Menu.onContextAction;
      delete btn.tooltip;
      children.push(btn);
    }
    return m = knix.get({
      title: 'audio',
      "class": 'context-menu',
      id: 'context-menu',
      isMovable: true,
      hasClose: true,
      hasMaxi: false,
      resize: false,
      hasShade: true,
      pos: Stage.absPos(event),
      children: children
    });
  };

  Menu.onContextAction = function(event) {
    var m, w;
    w = event.target.getWidget().getUp('button').config.func(event);
    m = Menu.menu('context-menu');
    w.setPos(m.absPos());
    return m.close();
  };

  return Menu;

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
    this.setSVGSize = __bind(this.setSVGSize, this);
    this.getHeight = __bind(this.getHeight, this);
    this.getWidth = __bind(this.getWidth, this);
    this.hideRuler = __bind(this.hideRuler, this);
    this.showRuler = __bind(this.showRuler, this);
    this.valAtRel = __bind(this.valAtRel, this);
    this.updateHandles = __bind(this.updateHandles, this);
    this.constrainHandles = __bind(this.constrainHandles, this);
    this.onHandleUp = __bind(this.onHandleUp, this);
    this.onHandlePos = __bind(this.onHandlePos, this);
    this.handleDoubleClick = __bind(this.handleDoubleClick, this);
    this.removeHandleAtIndex = __bind(this.removeHandleAtIndex, this);
    this.createHandle = __bind(this.createHandle, this);
    this.pathDragMove = __bind(this.pathDragMove, this);
    this.pathDoubleClick = __bind(this.pathDoubleClick, this);
    this.splitPathAtIndex = __bind(this.splitPathAtIndex, this);
    this.createPathAtIndex = __bind(this.createPathAtIndex, this);
    this.init = __bind(this.init, this);
    return Pad.__super__.constructor.apply(this, arguments);
  }

  Pad.prototype.init = function(cfg, defs) {
    var h, hp, i, v, _i, _j, _k, _ref, _ref1, _ref2;
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
    } else {
      this.config.vals = [];
      for (i = _i = 0, _ref = this.config.numHandles; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        hp = pos(i.toFixed(3) / (this.config.numHandles - 1), i.toFixed(3) / (this.config.numHandles - 1));
        this.config.vals.push(hp);
      }
    }
    this.handles = [];
    for (i = _j = 0, _ref1 = this.config.numHandles; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      h = this.createHandle();
      this.handles.push(h);
      if (i === this.config.sustainIndex) {
        h.circle.addClass('sustain');
      } else if (i === 0 || i === this.config.numHandles - 1) {
        h.circle.back();
      }
    }
    if (this.config.hasPaths) {
      this.paths = [];
      for (i = _k = 0, _ref2 = this.config.numHandles - 1; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
        this.createPathAtIndex(i);
      }
    }
    this.setSVGSize(cfg.minWidth, cfg.minHeight);
    this.updateHandles();
    return this;
  };


  /*
  00000000    0000000   000000000  000   000
  000   000  000   000     000     000   000
  00000000   000000000     000     000000000
  000        000   000     000     000   000
  000        000   000     000     000   000
   */

  Pad.prototype.createPathAtIndex = function(i) {
    var p;
    p = new Path({
      svg: this.svg.svg,
      "class": 'pad-path',
      startHandle: this.handles[i],
      endHandle: this.handles[i + 1]
    });
    p.path.node.addEventListener('dblclick', this.pathDoubleClick);
    p.path.back();
    new Drag({
      target: p.path.node,
      cursor: 'grab',
      doMove: false,
      onMove: this.pathDragMove
    });
    return this.paths.splice(i, 0, p);
  };

  Pad.prototype.splitPathAtIndex = function(i) {
    var h;
    if (i < this.config.sustainIndex) {
      this.config.sustainIndex += 1;
    }
    this.config.vals.splice(i + 1, 0, this.config.vals[i].mid(this.config.vals[i + 1]));
    h = this.createHandle();
    this.handles.splice(i + 1, 0, h);
    this.handles[i].circle.center(-1, -1);
    this.createPathAtIndex(i);
    this.paths[i + 1].swapStartHandle(this.handles[i + 1]);
    this.updateHandles();
    return this.constrainHandles();
  };

  Pad.prototype.pathDoubleClick = function(event) {
    var eh, i, sh;
    sh = event.target.getWidget().config.startHandle;
    eh = event.target.getWidget().config.endHandle;
    i = this.handles.indexOf(sh);
    return this.splitPathAtIndex(i);
  };

  Pad.prototype.pathDragMove = function(drag) {
    var eh, sh;
    sh = drag.target.getWidget().config.startHandle;
    sh.move(drag.delta);
    eh = drag.target.getWidget().config.endHandle;
    eh.move(drag.delta);
    return this.constrainHandles();
  };


  /*
  000   000   0000000   000   000  0000000    000      00000000
  000   000  000   000  0000  000  000   000  000      000     
  000000000  000000000  000 0 000  000   000  000      0000000 
  000   000  000   000  000  0000  000   000  000      000     
  000   000  000   000  000   000  0000000    0000000  00000000
   */

  Pad.prototype.createHandle = function() {
    var h;
    h = new Handle({
      svg: this.svg.svg,
      "class": 'pad-handle',
      onPos: this.onHandlePos,
      onUp: this.onHandleUp
    });
    h.elem.addEventListener('dblclick', this.handleDoubleClick);
    return h;
  };

  Pad.prototype.removeHandleAtIndex = function(i) {
    if (i < this.config.sustainIndex) {
      this.config.sustainIndex -= 1;
    }
    this.paths[i].swapStartHandle(this.handles[i - 1]);
    this.handles[i - 1].circle.center(-1, -1);
    this.config.vals.splice(i, 1);
    this.paths.splice(i - 1, 1)[0].close();
    this.handles.splice(i, 1)[0].close();
    this.updateHandles();
    return this.constrainHandles();
  };

  Pad.prototype.handleDoubleClick = function(event) {
    var h, i;
    h = event.target.getWidget();
    i = this.handles.indexOf(h);
    if (i > 0 && i < this.handles.length - 1 && i !== this.config.sustainIndex) {
      return this.removeHandleAtIndex(i);
    }
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
    var h, i, maxX, minX, minY, w, _i, _ref, _ref1, _ref2, _ref3, _results;
    _ref = [this.getWidth() - 2 * this.o, this.getHeight() - 2 * this.o], w = _ref[0], h = _ref[1];
    _results = [];
    for (i = _i = 0, _ref1 = this.config.vals.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      minY = this.o;
      if (i === 0) {
        minY = this.o + h;
        _ref2 = [this.o, this.o], minX = _ref2[0], maxX = _ref2[1];
      } else if (i === this.config.vals.length - 1) {
        minY = this.o + h;
        _ref3 = [this.o + w, this.o + w], minX = _ref3[0], maxX = _ref3[1];
      } else {
        minX = this.handles[i - 1].relPos().x;
        maxX = this.handles[i + 1].relPos().x;
      }
      _results.push(this.handles[i].constrain(minX, minY, maxX, this.o + h));
    }
    return _results;
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


  /*
  000   000   0000000   000    
  000   000  000   000  000    
   000 000   000000000  000    
     000     000   000  000    
      0      000   000  0000000
   */

  Pad.prototype.valAtRel = function(rel) {
    var dl, dp, ei, ep, i, p, si, sp, _i, _ref, _ref1;
    if (this.config.numHandles < 2 || rel <= 0) {
      return this.config.vals[0].y;
    }
    if (rel >= 1) {
      return this.config.vals[this.config.vals.length - 1].y;
    }
    si = 0;
    ei = 1;
    for (i = _i = 0, _ref = this.config.vals.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
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
        "line": 203,
        "args": ["rel"],
        "method": "valAtRel",
        "type": "."
      }, 'null', "<span class='console-type'>rel:</span>", rel, "<span class='console-type'>si:</span>", si, "<span class='console-type'>ei:</span>", ei, "<span class='console-type'>dl:</span>", dl, "<span class='console-type'>dp.x:</span>", dp.x);
      return sp.y;
    } else {
      p = sp.plus(dp.times((rel - this.config.vals[si].x) / dp.x));
      return p.y;
    }
  };


  /*
  00000000   000   000  000      00000000  00000000 
  000   000  000   000  000      000       000   000
  0000000    000   000  000      0000000   0000000  
  000   000  000   000  000      000       000   000
  000   000   0000000   0000000  00000000  000   000
   */

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
      delete this.rulerx;
    }
    if (this.rulery) {
      this.rulery.close();
      return delete this.rulery;
    }
  };


  /*
   0000000  000  0000000  00000000
  000       000     000   000     
  0000000   000    000    0000000 
       000  000   000     000     
  0000000   000  0000000  00000000
   */

  Pad.prototype.getWidth = function() {
    return this.svg.elem.width;
  };

  Pad.prototype.getHeight = function() {
    return this.svg.elem.height;
  };

  Pad.prototype.setSVGSize = function(width, height) {
    this.svg.setWidth(width);
    this.svg.setHeight(height);
    this.svg.elem.width = width;
    return this.svg.elem.height = height;
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
    this.swapStartHandle = __bind(this.swapStartHandle, this);
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
    this.config.endHead = this.config.end.plus(this.config.endDir);
    this.config.startHead = this.config.start.plus(this.config.startDir);
    this.setStart(this.config.start);
    this.setEnd(this.config.end);
    this.initEvents();
    return this;
  };

  Path.prototype.close = function() {
    var _ref;
    if (this.config.startHandle != null) {
      this.config.startHandle.elem.removeEventListener('onpos', this.setStart);
    }
    if (this.config.endHandle != null) {
      this.config.endHandle.elem.removeEventListener('onpos', this.setEnd);
    }
    if ((_ref = this.path) != null) {
      _ref.remove();
    }
    this.path = void 0;
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
    return this.setEndDir(p.minus(this.config.end));
  };

  Path.prototype.setStartHead = function(p) {
    return this.setStartDir(p.minus(this.config.start));
  };

  Path.prototype.swapStartHandle = function(h) {
    this.config.startHandle.elem.removeEventListener('onpos', this.setStart);
    this.config.startHandle = h;
    return this.config.startHandle.elem.addEventListener('onpos', this.setStart);
  };

  Path.prototype.setStart = function() {
    var p;
    p = _.arg();
    this.config.start = pos(p.x, p.y);
    this.config.startHead = this.config.start.plus(this.config.startDir);
    this.config.mid = this.config.startHead.mid(this.config.endHead);
    this.setCtrl(0, this.config.start);
    this.setCtrl(1, this.config.startHead);
    return this.setCtrl(2, this.config.mid);
  };

  Path.prototype.setEnd = function() {
    var p;
    p = _.arg();
    this.config.end = pos(p.x, p.y);
    this.config.endHead = this.config.end.plus(this.config.endDir);
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
      width: 300,
      minWidth: 240,
      minHigh: -10000,
      maxHigh: 10000,
      highStep: 0.1,
      valueFormat: "%1.3f",
      resize: 'horizontal'
    });
    Range.__super__.init.call(this, cfg, {
      type: 'range',
      title: 'range',
      children: [
        {
          type: 'sliderspin',
          "class": 'range_low',
          recKey: 'low',
          tooltip: 'minimum',
          value: cfg.low,
          minValue: cfg.minLow,
          maxValue: cfg.maxLow,
          spinStep: cfg.lowStep
        }, {
          type: 'sliderspin',
          "class": 'range_high',
          tooltip: 'maximum',
          recKey: 'high',
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
              "class": 'range_in',
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
              "class": 'range_out',
              tooltip: 'output',
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
    return Range.menuButton({
      text: 'range',
      icon: 'fa-sliders',
      action: function() {
        return new Range({
          center: true
        });
      }
    });
  };

  return Range;

})(Window);


/*

 0000000  00000000  000      00000000   0000000  000000000   0000000   000   000   0000000   000      00000000
000       000       000      000       000          000     000   000  0000  000  000        000      000     
0000000   0000000   000      0000000   000          000     000000000  000 0 000  000  0000  000      0000000 
     000  000       000      000       000          000     000   000  000  0000  000   000  000      000     
0000000   00000000  0000000  00000000   0000000     000     000   000  000   000   0000000   0000000  00000000
 */

Selectangle = (function(_super) {
  __extends(Selectangle, _super);

  function Selectangle() {
    this.onMove = __bind(this.onMove, this);
    this.close = __bind(this.close, this);
    this.init = __bind(this.init, this);
    return Selectangle.__super__.constructor.apply(this, arguments);
  }

  Selectangle.start = function(wid) {
    return Selectangle.selectangle = new Selectangle({
      parent: wid
    });
  };

  Selectangle.stop = function() {
    var _ref;
    return (_ref = Selectangle.selectangle) != null ? _ref.close() : void 0;
  };

  Selectangle.toggle = function() {
    if (Selectangle.selectangle != null) {
      return Selectangle.stop();
    } else {
      return Selectangle.start();
    }
  };

  Selectangle.prototype.init = function(cfg, defs) {
    var pos, stage, _ref;
    cfg = _.def(cfg, defs);
    window.document.documentElement.style.cursor = 'crosshair';
    pos = ((_ref = cfg.parent) != null ? _ref.absPos : void 0) != null ? cfg.parent.absPos().to(Stage.mousePos) : Stage.mousePos;
    this.wid = cfg.parent;
    Selectangle.__super__.init.call(this, cfg, {
      type: 'selectangle',
      parent: 'stage_content',
      pos: pos,
      width: 0,
      height: 0
    });
    stage = $('stage_content');
    stage.addEventListener('mousemove', this.onMove);
    stage.addEventListener('mouseup', this.close);
    stage.addEventListener('mousedown', this.close);
    return this;
  };

  Selectangle.prototype.close = function(event) {
    var stage, wid, _i, _len, _ref;
    if (this.sizePos().square() === 0 && !event.shiftKey) {
      _ref = (this.wid != null) && this.wid.allChildren() || knix.allWindows();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wid = _ref[_i];
        wid.elem.removeClassName('selected');
      }
    }
    stage = $('stage_content');
    stage.removeEventListener('mousemove', this.onMove);
    stage.removeEventListener('mouseup', this.done);
    stage.removeEventListener('mousedown', this.done);
    window.document.documentElement.style.cursor = 'auto';
    return Selectangle.__super__.close.apply(this, arguments);
  };

  Selectangle.prototype.onMove = function(event) {
    var br, ep, rect, tl, wid, widgets, _i, _len, _ref, _ref1, _results;
    ep = Stage.absPos(event);
    if (((_ref = this.wid) != null ? _ref.absPos : void 0) != null) {
      ep = this.wid.absPos().to(ep);
    }
    tl = ep.min(this.config.pos);
    br = ep.max(this.config.pos);
    this.setPos(tl);
    this.resize(br.x - tl.x, br.y - tl.y);
    if ((_ref1 = this.wid) != null) {
      if (typeof _ref1.scrollToPos === "function") {
        _ref1.scrollToPos(ep);
      }
    }
    widgets = (this.wid != null) && this.wid.allChildren() || knix.allWindows();
    window.document.documentElement.style.cursor = 'crosshair';
    rect = this.absRect();
    _results = [];
    for (_i = 0, _len = widgets.length; _i < _len; _i++) {
      wid = widgets[_i];
      if (rect.contains(wid.absCenter())) {
        if (!wid.config.noSelect) {
          _results.push(wid.elem.addClassName('selected'));
        } else {
          _results.push(void 0);
        }
      } else if (!event.shiftKey) {
        _results.push(wid.elem.removeClassName('selected'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Selectangle;

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

  function Slider() {
    this.setBarValue = __bind(this.setBarValue, this);
    this.setValue = __bind(this.setValue, this);
    this.valueToPercentOfWidth = __bind(this.valueToPercentOfWidth, this);
    this.onWindowSize = __bind(this.onWindowSize, this);
    this.onDrag = __bind(this.onDrag, this);
    this.init = __bind(this.init, this);
    return Slider.__super__.constructor.apply(this, arguments);
  }

  Slider.prototype.init = function(cfg, defs) {
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
    new Drag({
      cursor: 'ew-resize',
      target: this.elem,
      doMove: false,
      onMove: this.onDrag,
      onStart: this.onDrag
    });
    return this;
  };

  Slider.prototype.onDrag = function(drag) {
    var oldValue;
    oldValue = this.config.value;
    this.setValue(this.size2value(drag.pos.x - this.absPos().x));
    if (oldValue !== this.config.value) {
      return this.emit('valueInput', {
        value: this.config.value
      });
    }
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
    var children;
    cfg = _.def(cfg, defs);
    children = [];
    if (cfg.hasInput !== false) {
      children.push({
        type: 'connector',
        slot: cfg["class"] + ':setValue'
      });
    }
    children.push({
      type: 'slider',
      value: cfg.value,
      minValue: cfg.minValue,
      maxValue: cfg.maxValue,
      valueStep: cfg.sliderStep,
      hasKnob: cfg.sliderKnob,
      style: {
        width: '90%'
      }
    });
    children.push({
      type: 'spin',
      value: cfg.value,
      recKey: cfg.recKey,
      minValue: cfg.minValue,
      maxValue: cfg.maxValue,
      valueStep: cfg.spinStep,
      minWidth: 100,
      format: cfg.spinFormat || "%3.2f",
      style: {
        width: '10%'
      }
    });
    if (cfg.hasOutput !== false) {
      children.push({
        type: 'connector',
        signal: cfg["class"] + ':onValue'
      });
    }
    Sliderspin.__super__.init.call(this, cfg, {
      children: children
    });
    this.connect('slider:onValue', 'spin:setValue');
    this.connect('spin:onValue', 'slider:setValue');
    this.connect('spin:onValue', this.onSpinValue);
    return this;
  };

  Sliderspin.prototype.onSpinValue = function(v) {
    return this.emitValue(_.value(v));
  };

  Sliderspin.prototype.setValue = function(v) {
    this.config.value = _.value(v);
    return this.getChild('slider').setValue(this.config.value);
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
    this.onWindowSize = __bind(this.onWindowSize, this);
    this.stopTimer = __bind(this.stopTimer, this);
    this.startDecr = __bind(this.startDecr, this);
    this.startIncr = __bind(this.startIncr, this);
    this.incr = __bind(this.incr, this);
    this.updateKnob = __bind(this.updateKnob, this);
    this.setValue = __bind(this.setValue, this);
    this.onInputDown = __bind(this.onInputDown, this);
    this.onInputChange = __bind(this.onInputChange, this);
    this.onKey = __bind(this.onKey, this);
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
              "class": 'decr spin-td',
              elem: 'td',
              keys: [],
              child: {
                type: 'icon',
                icon: 'octicon-triangle-left',
                style: {
                  position: 'relative',
                  top: '-1px'
                }
              }
            }, {
              "class": 'spin-content',
              elem: 'td',
              children: [
                {
                  type: 'input',
                  "class": 'spin-input'
                }, {
                  type: 'spin-knob'
                }
              ]
            }, {
              "class": 'incr spin-td',
              elem: 'td',
              keys: [],
              child: {
                type: 'icon',
                icon: 'octicon-triangle-right',
                style: {
                  position: 'relative',
                  top: '-1px'
                }
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
    this.connect('input:mousedown', this.onInputDown);
    this.connect('input:click', this.onInputDown);
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


  /*
  000   000  00000000  000   000
  000  000   000        000 000 
  0000000    0000000     00000  
  000  000   000          000   
  000   000  00000000     000
   */

  Spin.prototype.onKey = function(event, e) {
    var s, _ref, _ref1, _ref2, _ref3, _ref4;
    if ((_ref = event.key) === 'Esc') {
      this.setValue(this.config.value);
      return;
    }
    if ((_ref1 = event.key) === 'Up' || _ref1 === 'Down') {
      this.setValue(this.input.value);
      this.incr(event.key === 'Up' && '+' || '-');
      event.stop();
      return;
    }
    if ((_ref2 = event.key) === 'Left' || _ref2 === 'Right' || _ref2 === ' ' || _ref2 === 'Tab') {
      if (event.key === ' ') {
        Keys.onKey(event);
        event.stop();
      } else if (event.key === 'Left') {
        this.config.knobIndex += 1;
      } else if (event.key === 'Right') {
        this.config.knobIndex -= 1;
      }
      this.onInputChange();
      this.updateKnob();
      return;
    }
    if (_ref3 = event.key, __indexOf.call('0123456789-.', _ref3) < 0) {
      if (event.key.length === 1) {
        Keys.onKey(event);
        event.stop();
        return;
      }
    }
    if (_ref4 = event.key, __indexOf.call('-.', _ref4) >= 0) {
      if (this.input.value.indexOf(event.key) > -1) {
        s = this.input.value.slice(this.input.selectionStart, this.input.selectionEnd);
        if (s.indexOf(event.key) < 0) {
          Keys.onKey(event);
          event.stop();
        }
      }
    }
  };

  Spin.prototype.onInputChange = function() {
    var oldValue;
    oldValue = this.config.value;
    this.setValue(this.input.value);
    if (this.config.value !== oldValue) {
      return this.emit('valueInput', {
        value: this.config.value
      });
    }
  };

  Spin.prototype.onInputDown = function(event) {
    this.config.knobIndex = -(this.input.selectionStart - this.input.value.length + 1);
    this.updateKnob();
    return event.stopPropagation();
  };

  Spin.prototype.setValue = function(a) {
    var end, start, _ref, _ref1;
    Spin.__super__.setValue.call(this, _.value(a));
    _ref = [this.input.selectionStart, this.input.selectionEnd], start = _ref[0], end = _ref[1];
    if (this.input != null) {
      this.input.value = this.format(this.config.value);
    }
    if (this.config.knobIndex == null) {
      this.config.knobIndex = this.config.maxValue <= 1 ? 1 : 3;
    }
    this.updateKnob();
    return _ref1 = [start, end], this.input.selectionStart = _ref1[0], this.input.selectionEnd = _ref1[1], _ref1;
  };

  Spin.prototype.updateKnob = function() {
    var i;
    this.config.knobIndex = _.clamp(this.config.knobIndex, 0, this.format(this.config.maxValue).length - 1);
    i = this.config.knobIndex;
    if (i === 2) {
      i = 3;
    }
    return this.getChild('spin-knob').moveTo(this.getChild('spin-content').getWidth() - (8 + i * 7.5));
  };

  Spin.prototype.incr = function(d) {
    var dotindex, oldValue, saveStep, start, tempStep, valueLength, _ref;
    if (d == null) {
      d = 1;
    }
    oldValue = this.config.value;
    valueLength = this.input.value.length;
    start = this.input.value.length - this.config.knobIndex - 1;
    dotindex = this.input.value.indexOf('.');
    if (dotindex >= 0 && start >= dotindex) {
      tempStep = 1.0 / (Math.pow(10, start - dotindex));
    } else {
      if (dotindex >= 0) {
        valueLength = dotindex;
      }
      tempStep = Math.pow(10, valueLength - start - 1);
    }
    _ref = [this.config.valueStep, tempStep], saveStep = _ref[0], this.config.valueStep = _ref[1];
    Spin.__super__.incr.apply(this, arguments);
    this.config.valueStep = saveStep;
    if (oldValue !== this.config.value) {
      this.emit('valueInput', {
        value: this.config.value
      });
    }
    return this.updateKnob();
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

  Spin.prototype.onWindowSize = function() {
    return this.setValue(this.config.value);
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
    this.size2value = __bind(this.size2value, this);
    this.incr = __bind(this.incr, this);
    this.index = __bind(this.index, this);
    this.setValue = __bind(this.setValue, this);
    this.sliderFunc = __bind(this.sliderFunc, this);
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
    new Drag({
      cursor: 'ew-resize',
      target: this.getChild('spin-content').elem,
      doMove: false,
      onMove: this.sliderFunc,
      onStart: this.sliderFunc
    });
    delete this.input;
    return this;
  };

  Spinner.prototype.sliderFunc = function(drag, event) {
    var d, i, oldValue, pos, v, width;
    oldValue = this.config.value;
    pos = this.getChild('spin-content').absPos();
    width = event.clientX - pos.x;
    v = this.size2value(width);
    d = v - this.range() / 2;
    i = this.range() / 2 + d * this.config.valueStep * this.steps() / this.range();
    i = this.clamp(this.round(i));
    this.setValue(this.config.values[i]);
    if (oldValue !== this.config.value) {
      return this.emit('valueInput', {
        value: this.config.value
      });
    }
  };

  Spinner.prototype.setValue = function(a) {
    var c, i, offset, v, w;
    v = _.arg(a);
    i = this.config.values.indexOf(v);
    c = this.getChild('spin-content');
    c.clear();
    w = Math.max(3, c.getWidth() / this.steps());
    offset = i * this.getChild('spin-content').getWidth() / this.config.values.length;
    c.elem.insert('<div class="spinner-knob" style="width:%dpx; left:%dpx"/>'.fmt(w, offset));
    this.config.value = this.config.values[i];
    c.elem.insert(String(this.config.value));
    return this.emitValue(this.config.value);
  };

  Spinner.prototype.index = function() {
    return this.config.values.indexOf(this.config.value);
  };

  Spinner.prototype.incr = function(d) {
    var i, oldValue;
    if (d == null) {
      d = 1;
    }
    oldValue = this.config.value;
    if (d === '+' || d === '++') {
      d = 1;
    } else if (d === '-' || d === '--') {
      d = -1;
    }
    i = this.clamp(this.index() + d);
    this.setValue(this.config.values[i]);
    if (oldValue !== this.config.value) {
      return this.emit('valueInput', this.config.value);
    }
  };

  Spinner.prototype.size2value = function(s) {
    return this.config.minValue + this.range() * s / this.getChild('spin-content').getWidth();
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
    this.toggle = __bind(this.toggle, this);
    this.getIndex = __bind(this.getIndex, this);
    this.setState = __bind(this.setState, this);
    this.init = __bind(this.init, this);
    return Toggle.__super__.constructor.apply(this, arguments);
  }

  Toggle.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      states: ['off', 'on'],
      icons: ['octicon-x', 'octicon-check']
    });
    if (cfg.state == null) {
      cfg.state = cfg.states[0];
    }
    if (cfg.icon == null) {
      cfg.icon = cfg.icons[cfg.states.indexOf(cfg.state)];
    }
    Toggle.__super__.init.call(this, cfg, {
      "class": 'button'
    });
    this.connect('trigger', this.toggle);
    if (this.config.onState != null) {
      this.connect('onState', this.config.onState);
    }
    this.setState(this.config.state);
    return this;
  };

  Toggle.prototype.setState = function(state) {
    var _ref;
    this.elem.removeClassName(this.config.state);
    this.config.state = state;
    this.elem.addClassName(this.config.state);
    if ((_ref = this.getChild('icon')) != null) {
      _ref.setIcon(this.config.icons[this.getIndex()]);
    }
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
      if (((e != null ? (_ref1 = e.widget) != null ? _ref1.tooltip : void 0 : void 0) != null) && Settings.get('tooltips', false)) {
        tooltip = e.widget.tooltip;
        if (tooltip.window != null) {
          tooltip.window.close();
          delete tooltip.window;
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
    var text, tooltip, _ref, _ref1, _ref2;
    if (!((_ref = e.widget.getWindow()) != null ? (_ref1 = _ref.elem) != null ? _ref1.visible : void 0 : void 0)) {
      if (((_ref2 = e.widget.tooltip) != null ? _ref2.timer : void 0) != null) {
        clearInterval(e.widget.tooltip.timer);
        delete e.widget.tooltip.timer;
      }
      return;
    }
    tooltip = e.widget.tooltip;
    if (tooltip.timer != null) {
      clearInterval(tooltip.timer);
      delete tooltip.timer;
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
        delete tooltip.timer;
      }
      if (w = tooltip.window) {
        w.close();
        return delete e.widget.tooltip.window;
      }
    }
  };

  return Tooltip;

})();

//# sourceMappingURL=widgets.js.map
