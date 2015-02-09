
/*

    000   000  000  0000000     00000000  00000000  000000000
    000 0 000  000  000   000  000        000          000
    000000000  000  000   000  000  0000  0000000      000
    000   000  000  000   000  000   000  000          000
    00     00  000  0000000     0000000   00000000     000
 */
var Widget,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Widget = (function() {
  function Widget(config, defaults) {
    this.clamp = __bind(this.clamp, this);
    this.round = __bind(this.round, this);
    this.strip0 = __bind(this.strip0, this);
    this.format = __bind(this.format, this);
    this.absCenter = __bind(this.absCenter, this);
    this.absPos = __bind(this.absPos, this);
    this.relPos = __bind(this.relPos, this);
    this.maxHeight = __bind(this.maxHeight, this);
    this.maxWidth = __bind(this.maxWidth, this);
    this.minHeight = __bind(this.minHeight, this);
    this.minWidth = __bind(this.minWidth, this);
    this.innerHeight = __bind(this.innerHeight, this);
    this.innerWidth = __bind(this.innerWidth, this);
    this.size2value = __bind(this.size2value, this);
    this.percentage = __bind(this.percentage, this);
    this.getSize = __bind(this.getSize, this);
    this.setSize = __bind(this.setSize, this);
    this.resize = __bind(this.resize, this);
    this.getHeight = __bind(this.getHeight, this);
    this.getWidth = __bind(this.getWidth, this);
    this.setHeight = __bind(this.setHeight, this);
    this.setWidth = __bind(this.setWidth, this);
    this.moveBy = __bind(this.moveBy, this);
    this.moveTo = __bind(this.moveTo, this);
    this.setPos = __bind(this.setPos, this);
    this.clear = __bind(this.clear, this);
    this.close = __bind(this.close, this);
    this.getChild = __bind(this.getChild, this);
    this.getWindow = __bind(this.getWindow, this);
    this.getParent = __bind(this.getParent, this);
    this.slotArg = __bind(this.slotArg, this);
    this.emitMove = __bind(this.emitMove, this);
    this.emitSize = __bind(this.emitSize, this);
    this.emit = __bind(this.emit, this);
    this.insertChildren = __bind(this.insertChildren, this);
    this.insertChild = __bind(this.insertChild, this);
    this.addToParent = __bind(this.addToParent, this);
    this.resolveSlot = __bind(this.resolveSlot, this);
    this.resolveSignal = __bind(this.resolveSignal, this);
    this.connect = __bind(this.connect, this);
    this.initConnections = __bind(this.initConnections, this);
    this.initSlots = __bind(this.initSlots, this);
    this.initEvents = __bind(this.initEvents, this);
    this.init = __bind(this.init, this);
    this.init(config, defaults);
  }

  Widget.prototype.init = function(config, defaults) {
    var a, cfg, clss, k, s, style, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4;
    cfg = _.def(config, defaults);
    if (cfg.type == null) {
      console.warn("NO TYPE?");
      cfg.type = 'unknown';
    }
    if (cfg.elem == null) {
      cfg.elem = ((((_ref = cfg.attr) != null ? _ref.href : void 0) != null) || (cfg.href != null) || null) && 'a';
      if (cfg.elem == null) {
        cfg.elem = 'div';
      }
    }
    this.elem = Widget.elem(cfg.elem, cfg.type);
    this.elem.widget = this;
    this.config = cfg;
    this.elem.getWindow = this.getWindow.bind(this);
    this.elem.getChild = this.getChild.bind(this);
    this.elem.getParent = this.getParent.bind(this);
    if (this.config.id != null) {
      this.elem.writeAttribute('id', this.config.id);
    }
    _ref1 = this.config.attr;
    for (a in _ref1) {
      v = _ref1[a];
      this.elem.writeAttribute(a, v);
    }
    _ref2 = ['href'];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      k = _ref2[_i];
      if (this.config[k] != null) {
        this.elem.writeAttribute(k, this.config[k]);
      }
    }
    if (this.config["class"]) {
      _ref3 = this.config["class"].split(' ');
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        clss = _ref3[_j];
        this.elem.addClassName(clss);
      }
    }
    if (this.config.style) {
      this.elem.setStyle(this.config.style);
    }
    style = $H();
    _ref4 = ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'];
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      s = _ref4[_k];
      if (this.config[s] != null) {
        style.set(s, this.config[s] + 'px');
      }
    }
    if (style.keys().length) {
      this.elem.setStyle(style.toObject());
    }
    if (this.config.text != null) {
      this.elem.insert(this.config.text);
    }
    this.insertChildren();
    if (this.config.parent != null) {
      this.addToParent(this.config.parent);
    }
    if ((this.config.x != null) || (this.config.y != null)) {
      this.elem.style.position = 'absolute';
      this.moveTo(this.config.x, this.config.y);
    }
    if ((this.config.width != null) || (this.config.height != null)) {
      this.resize(this.config.width, this.config.height);
    }
    if (this.config.isMovable) {
      Drag.create({
        target: this.elem,
        minPos: pos(void 0, 0),
        onMove: this.emitMove.bind(this),
        cursor: null
      });
    }
    this.initSlots();
    this.initConnections();
    this.initEvents();
    if (this.config.noDown) {
      this.elem.on('mousedown', function(event, e) {
        return event.stopPropagation();
      });
    }
    return this;
  };

  Widget.nextWidgetID = 0;

  Widget.elem = function(type, clss) {
    var e;
    e = new Element(type);
    e.id = "%s.%s.%d".fmt(type, clss, Widget.nextWidgetID);
    Widget.nextWidgetID += 1;
    e.addClassName(clss);
    return e;
  };

  Widget.prototype.initEvents = function() {
    if (this.config.onClick) {
      this.elem.on("click", this.config.onClick);
    }
    if (this.config.onDown) {
      this.elem.on("mousedown", this.config.onDown);
    }
    if (this.config.onUp) {
      this.elem.on("mouseup", this.config.onUp);
    }
    if (this.config.onOver) {
      this.elem.on("mouseover", this.config.onOver);
    }
    if (this.config.onMove) {
      this.elem.on("mousemove", this.config.onMove);
    }
    if (this.config.onOut) {
      this.elem.on("mouseout", this.config.onOut);
    }
    if (this.config.onDouble) {
      this.elem.on("ondblclick", this.config.onDouble);
    }
    return this;
  };

  Widget.prototype.initSlots = function() {
    var func, slot, slots, _results;
    slots = this.config.slots;
    if (slots == null) {
      return;
    }
    _results = [];
    for (slot in slots) {
      func = slots[slot];
      _results.push(this[slot] = func);
    }
    return _results;
  };

  Widget.prototype.initConnections = function() {
    var connection, connections, _i, _len, _results;
    connections = this.config.connect;
    if (connections == null) {
      return;
    }
    _results = [];
    for (_i = 0, _len = connections.length; _i < _len; _i++) {
      connection = connections[_i];
      _results.push(this.connect(connection.signal, connection.slot));
    }
    return _results;
  };

  Widget.prototype.connect = function(signal, slot) {
    var signalEvent, signalSender, slotFunction, _ref;
    _ref = this.resolveSignal(signal), signalSender = _ref[0], signalEvent = _ref[1];
    slotFunction = this.resolveSlot(slot);
    if (signalSender == null) {
      log("    sender not found!");
      return;
    }
    if (signalEvent == null) {
      log("    event not found!");
      return;
    }
    if (slotFunction == null) {
      log("    slot not found!");
      return;
    }
    return {
      handler: signalSender.elem.on(signalEvent, slotFunction),
      sender: signalSender,
      event: signalEvent,
      receiver: slotFunction
    };
  };

  Widget.prototype.resolveSignal = function(signal) {
    var event, sender, _ref;
    _ref = signal.split(':').reverse(), event = _ref[0], sender = _ref[1];
    if (sender != null) {
      sender = this.getWindow().getChild(sender);
    }
    if (sender == null) {
      sender = this;
    }
    return [sender, event];
  };

  Widget.prototype.resolveSlot = function(slot) {
    var func, receiver, _ref;
    if (typeof slot === 'function') {
      return slot;
    }
    if (typeof slot === 'string') {
      _ref = slot.split(':').reverse(), func = _ref[0], receiver = _ref[1];
      if (receiver != null) {
        receiver = this.getWindow().getChild(receiver);
      }
      if (receiver == null) {
        receiver = this;
      }
      if (receiver[func] != null) {
        return receiver[func].bind(receiver);
      }
    }
    return null;
  };

  Widget.prototype.addToParent = function(p) {
    var parentElement;
    if (this.elem == null) {
      log('no @elem?');
      return this;
    }
    if (p == null) {
      log('no p?');
      return this;
    }
    if (p.content != null) {
      parentElement = $(p.content);
    }
    if (!parentElement) {
      parentElement = p.elem;
    }
    if (!parentElement) {
      parentElement = $(p);
    }
    if (parentElement == null) {
      log('no element?', p);
      return this;
    }
    parentElement.insert(this.elem);
    this.config.parent = parentElement.id;
    return this;
  };

  Widget.prototype.insertChild = function(config, defaults) {
    var child;
    child = knix.create(config, defaults);
    child.addToParent(this);
    return child;
  };

  Widget.prototype.insertChildren = function() {
    var cfg, _i, _len, _ref;
    if (this.config.children) {
      _ref = this.config.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cfg = _ref[_i];
        this.insertChild(cfg);
      }
    } else if (this.config.child) {
      this.insertChild(this.config.child);
    }
    return this;
  };

  Widget.prototype.emit = function(signal, args) {
    var event;
    event = new CustomEvent(signal, {
      bubbles: true,
      cancelable: true,
      detail: args
    });
    return this.elem.dispatchEvent(event);
  };

  Widget.prototype.emitSize = function() {
    return this.emit('size', {
      width: this.getWidth(),
      height: this.getHeight()
    });
  };

  Widget.prototype.emitMove = function() {
    return this.emit('move', {
      pos: this.absPos()
    });
  };

  Widget.prototype.slotArg = function(event, argname) {
    if (argname == null) {
      argname = 'value';
    }
    if (typeof event === 'object') {
      if (event.detail[argname] != null) {
        return event.detail[argname];
      } else {
        return event.detail;
      }
    }
    if (argname === 'value') {
      return parseFloat(event);
    }
    return event;
  };

  Widget.prototype.getParent = function() {
    var a, anc, args, _i, _len;
    args = $A(arguments);
    if (args.length) {
      anc = this.elem.ancestors();
      for (_i = 0, _len = anc.length; _i < _len; _i++) {
        a = anc[_i];
        if (a.match("#" + args[0]) || a.match("." + args[0])) {
          return a.widget;
        }
      }
      return;
    }
    if (this.config.parent) {
      return $(this.config.parent).widget;
    }
    return $(this.parentElement.id).wiget;
  };

  Widget.prototype.getWindow = function() {
    if (this.elem.hasClassName('window')) {
      return this;
    }
    return this.getParent('window');
  };

  Widget.prototype.getChild = function(classOrID) {
    var c;
    c = this.elem.select('#' + classOrID, '.' + classOrID);
    if (c.length) {
      return c[0].widget;
    }
    return void 0;
  };

  Widget.prototype.close = function() {
    this.emit('close');
    this.elem.remove();
    this.elem = null;
    this.config = null;
  };

  Widget.prototype.clear = function() {
    var _results;
    _results = [];
    while (this.elem.hasChildNodes()) {
      _results.push(this.elem.removeChild(this.elem.lastChild));
    }
    return _results;
  };

  Widget.prototype.setPos = function(p) {
    return this.moveTo(p.x, p.y);
  };

  Widget.prototype.moveTo = function(x, y) {
    if (x != null) {
      this.elem.style.left = "%dpx".fmt(x);
    }
    if (y != null) {
      this.elem.style.top = "%dpx".fmt(y);
    }
    this.emitMove();
  };

  Widget.prototype.moveBy = function(dx, dy) {
    var p;
    p = this.relPos();
    if (dx != null) {
      this.elem.style.left = "%dpx".fmt(p.x + dx);
    }
    if (dy != null) {
      this.elem.style.top = "%dpx".fmt(p.y + dy);
    }
    this.emitMove();
  };

  Widget.prototype.setWidth = function(w) {
    var ow;
    ow = this.elem.style.width;
    if (w != null) {
      this.elem.style.width = "%dpx".fmt(w);
    }
    if (ow !== this.elem.style.width) {
      this.emitSize();
    }
  };

  Widget.prototype.setHeight = function(h) {
    var oh;
    oh = this.elem.style.height;
    if (h != null) {
      this.elem.style.height = "%dpx".fmt(h);
    }
    if (oh !== this.elem.style.height) {
      this.emitSize();
    }
  };

  Widget.prototype.getWidth = function() {
    return this.elem.getWidth();
  };

  Widget.prototype.getHeight = function() {
    return this.elem.getHeight();
  };

  Widget.prototype.resize = function(w, h) {
    var diff;
    if (w != null) {
      this.setWidth(w);
    }
    if (h != null) {
      this.setHeight(h);
    }
    if (w != null) {
      diff = this.getWidth() - w;
      if (diff) {
        this.setWidth(w - diff);
      }
    }
    if (h != null) {
      diff = this.getHeight() - h;
      if (diff) {
        this.setHeight(h - diff);
      }
    }
  };

  Widget.prototype.setSize = function(s) {
    return this.resize(s.width, s.height);
  };

  Widget.prototype.getSize = function() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    };
  };

  Widget.prototype.percentage = function(v) {
    var cfg, pct;
    cfg = this.config;
    pct = 100 * (v - cfg.minValue) / (cfg.maxValue - cfg.minValue);
    return Math.max(0, Math.min(pct, 100));
  };

  Widget.prototype.size2value = function(s) {
    return this.config.minValue + (this.config.maxValue - this.config.minValue) * s / this.innerWidth();
  };

  Widget.prototype.innerWidth = function() {
    return this.elem.getLayout().get("padding-box-width");
  };

  Widget.prototype.innerHeight = function() {
    return this.elem.getLayout().get("padding-box-height");
  };

  Widget.prototype.minWidth = function() {
    var w;
    w = parseInt(this.elem.getStyle('min-width'));
    if (w) {
      return w;
    } else {
      return 0;
    }
  };

  Widget.prototype.minHeight = function() {
    var h;
    h = parseInt(this.elem.getStyle('min-height'));
    if (h) {
      return h;
    } else {
      return 0;
    }
  };

  Widget.prototype.maxWidth = function() {
    var w;
    w = parseInt(this.elem.getStyle('max-width'));
    if (w) {
      return w;
    } else {
      return Number.MAX_VALUE;
    }
  };

  Widget.prototype.maxHeight = function() {
    var h;
    h = parseInt(this.elem.getStyle('max-height'));
    if (h) {
      return h;
    } else {
      return Number.MAX_VALUE;
    }
  };

  Widget.prototype.relPos = function() {
    var o;
    o = this.elem.positionedOffset();
    return pos(o.left, o.top);
  };

  Widget.prototype.absPos = function() {
    var o, s;
    o = this.elem.cumulativeOffset();
    s = this.elem.cumulativeScrollOffset();
    return pos(o.left - s.left, o.top - s.top);
  };

  Widget.prototype.absCenter = function() {
    return this.absPos().add(pos(this.elem.getWidth(), this.elem.getHeight()).mul(0.5));
  };

  Widget.prototype.format = function(s) {
    if (this.config.format != null) {
      return this.config.format.fmt(s);
    }
    return String(s);
  };

  Widget.prototype.strip0 = function(s) {
    if (s.indexOf('.') > -1) {
      return s.replace(/(0+)$/, '').replace(/([\.]+)$/, '');
    }
    return String(s);
  };

  Widget.prototype.round = function(v) {
    var d, r;
    r = v;
    if (this.config.valueStep != null) {
      d = v - Math.round(v / this.config.valueStep) * this.config.valueStep;
      r -= d;
    }
    return r;
  };

  Widget.prototype.clamp = function(v) {
    var c;
    c = v;
    if (this.config.maxValue != null) {
      c = Math.min(c, this.config.maxValue);
    }
    if (this.config.minValue != null) {
      c = Math.max(c, this.config.minValue);
    }
    return c;
  };

  return Widget;

})();

//# sourceMappingURL=widget.js.map
