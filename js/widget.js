var Widget;

Widget = (function() {
  function Widget() {}

  Widget.create = function(config, defaults) {
    return knix.create(config, defaults);
  };

  Widget.setup = function(config, defaults) {
    var a, cfg, clss, s, style, v, w, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    cfg = config;
    if (defaults != null) {
      cfg = Object.extend(defaults, config);
    }
    if (cfg.type == null) {
      console.warn("NO TYPE?");
      cfg.type = 'unknown';
    }
    w = this.elem(cfg.elem || "div", cfg.type);
    w.config = Object.clone(cfg);
    knix.mixin(w);
    if (w.config.id != null) {
      w.writeAttribute('id', w.config.id);
    }
    _ref = w.config.attr;
    for (a in _ref) {
      v = _ref[a];
      w.writeAttribute(a, v);
    }
    if (w.config["class"]) {
      _ref1 = w.config["class"].split(' ');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        clss = _ref1[_i];
        w.addClassName(clss);
      }
    }
    if (w.config.style) {
      w.setStyle(w.config.style);
    }
    style = $H();
    _ref2 = ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      s = _ref2[_j];
      if (w.config[s] != null) {
        style.set(s, w.config[s] + 'px');
      }
    }
    if (style.keys().length) {
      w.setStyle(style.toObject());
    }
    if (w.config.text) {
      w.insert(w.config.text);
    }
    w.addToParent(w.config.parent);
    w.insertChildren();
    if ((w.config.x != null) || (w.config.y != null)) {
      w.style.position = 'absolute';
      w.moveTo(w.config.x, w.config.y);
    }
    if ((w.config.width != null) || (w.config.height != null)) {
      w.resize(w.config.width, w.config.height);
    }
    if (w.config.isMovable) {
      Drag.create({
        target: w,
        minPos: pos(void 0, 0),
        cursor: null
      });
    }
    this.initSlots(w);
    this.initConnections(w);
    this.initEvents(w);
    if (w.config.noDown) {
      w.on('mousedown', function(event, e) {
        return event.stopPropagation();
      });
    }
    return w;
  };

  Widget.nextWidgetID = 0;

  Widget.elem = function(type, clss) {
    var e;
    e = new Element(type);
    e.id = "knix_%d".fmt(this.nextWidgetID);
    this.nextWidgetID += 1;
    e.addClassName(clss);
    return e;
  };

  Widget.initEvents = function(w) {
    if (w.config.onClick) {
      w.on("click", w.config.onClick);
    }
    if (w.config.onDown) {
      w.on("mousedown", w.config.onDown);
    }
    if (w.config.onUp) {
      w.on("mouseup", w.config.onUp);
    }
    if (w.config.onOver) {
      w.on("mouseover", w.config.onOver);
    }
    if (w.config.onMove) {
      w.on("mousemove", w.config.onMove);
    }
    if (w.config.onOut) {
      w.on("mouseout", w.config.onOut);
    }
    if (w.config.onDouble) {
      w.on("ondblclick", w.config.onDouble);
    }
    return this;
  };

  Widget.initSlots = function(w) {
    var func, slot, slots, _results;
    slots = w.config.slots;
    if (slots == null) {
      return;
    }
    _results = [];
    for (slot in slots) {
      func = slots[slot];
      _results.push(w[slot] = func);
    }
    return _results;
  };

  Widget.initConnections = function(w) {
    var connection, connections, _i, _len, _results;
    connections = w.config.connect;
    if (connections == null) {
      return;
    }
    _results = [];
    for (_i = 0, _len = connections.length; _i < _len; _i++) {
      connection = connections[_i];
      _results.push(this.connect(w, connection.signal, connection.slot));
    }
    return _results;
  };

  Widget.connect = function(w, signal, slot) {
    var signalEvent, signalSender, slotFunction, _ref;
    _ref = this.resolveSignal(w, signal), signalSender = _ref[0], signalEvent = _ref[1];
    slotFunction = this.resolveSlot(w, slot);
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
      handler: signalSender.on(signalEvent, slotFunction),
      sender: signalSender,
      event: signalEvent,
      receiver: slotFunction
    };
  };

  Widget.resolveSignal = function(w, signal) {
    var event, sender, _ref;
    _ref = signal.split(':').reverse(), event = _ref[0], sender = _ref[1];
    if (sender != null) {
      sender = w.getWindow().getChild(sender);
    }
    if (sender == null) {
      sender = w;
    }
    return [sender, event];
  };

  Widget.resolveSlot = function(w, slot) {
    var func, receiver, _ref;
    if (typeof slot === 'function') {
      return slot;
    }
    if (typeof slot === 'string') {
      _ref = slot.split(':').reverse(), func = _ref[0], receiver = _ref[1];
      if (receiver != null) {
        receiver = w.getWindow().getChild(receiver);
      }
      if (receiver == null) {
        receiver = w;
      }
      if (receiver[func] != null) {
        return receiver[func].bind(receiver);
      }
    }
    return null;
  };

  Widget.prototype.addToParent = function(p) {
    var parentid;
    p = $(p);
    if (p) {
      parentid = p.id;
      if (p.hasOwnProperty('content')) {
        p = $(p.content);
      }
      if (p) {
        p.insert(this);
        if (this.config) {
          this.config.parent = parentid;
        }
      }
    }
    return this;
  };

  Widget.prototype.insertChild = function(config, defaults) {
    var cfg, child;
    cfg = config;
    if (defaults != null) {
      cfg = Object.extend(defaults, config);
    }
    cfg.parent = this;
    child = knix.create(cfg);
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
    return this.dispatchEvent(event);
  };

  Widget.prototype.emitSize = function() {
    return this.emit("size", {
      width: this.getWidth(),
      height: this.getHeight()
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
    var a, args, _i, _len, _ref;
    args = $A(arguments);
    if (args.length) {
      _ref = this.ancestors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        if (a.match("#" + args[0]) || a.match("." + args[0])) {
          return a;
        }
      }
      return;
    }
    if (this.config.parent) {
      return $(this.config.parent);
    }
    return $(this.parentElement.id);
  };

  Widget.prototype.getWindow = function() {
    if (this.hasClassName('window')) {
      return this;
    }
    return this.getParent('window');
  };

  Widget.prototype.getChild = function(name) {
    var c;
    c = Selector.findChildElements(this, ['#' + name, '.' + name]);
    if (c.length) {
      return c[0];
    }
    return null;
  };

  Widget.prototype.close = function() {
    this.remove();
  };

  Widget.prototype.clear = function() {
    var _results;
    _results = [];
    while (this.hasChildNodes()) {
      _results.push(this.removeChild(this.lastChild));
    }
    return _results;
  };

  Widget.prototype.setPos = function(p) {
    return this.moveTo(p.x, p.y);
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

  Widget.prototype.moveTo = function(x, y) {
    if (x != null) {
      this.style.left = "%dpx".fmt(x);
    }
    if (y != null) {
      this.style.top = "%dpx".fmt(y);
    }
  };

  Widget.prototype.moveBy = function(dx, dy) {
    var p;
    p = this.relPos();
    if (dx != null) {
      this.style.left = "%dpx".fmt(p.x + dx);
    }
    if (dy != null) {
      this.style.top = "%dpx".fmt(p.y + dy);
    }
  };

  Widget.prototype.setWidth = function(w) {
    var ow;
    ow = this.style.width;
    if (w != null) {
      this.style.width = "%dpx".fmt(w);
    }
    if (ow !== this.style.width) {
      this.emitSize();
    }
  };

  Widget.prototype.setHeight = function(h) {
    var oh;
    oh = this.style.height;
    if (h != null) {
      this.style.height = "%dpx".fmt(h);
    }
    if (oh !== this.style.height) {
      this.emitSize();
    }
  };

  Widget.prototype.resize = function(w, h) {
    if (w != null) {
      this.setWidth(w);
    }
    if (h != null) {
      this.setHeight(h);
    }
  };

  Widget.prototype.percentage = function(v) {
    var cfg, knp, knv, pct;
    cfg = this.config;
    if (cfg.hasKnob) {
      knv = this.size2value(this.getChild('slider-knob').getWidth());
      knp = 100 * (knv - cfg.valueMin) / (cfg.valueMax - cfg.valueMin);
      pct = 100 * (v - cfg.valueMin) / (cfg.valueMax - cfg.valueMin);
      return Math.max(knp / 2, Math.min(pct, 100 - knp / 2));
    } else {
      pct = 100 * (v - cfg.valueMin) / (cfg.valueMax - cfg.valueMin);
      return Math.max(0, Math.min(pct, 100));
    }
  };

  Widget.prototype.size2value = function(s) {
    return this.config.valueMin + (this.config.valueMax - this.config.valueMin) * s / this.innerWidth();
  };

  Widget.prototype.innerWidth = function() {
    return this.getLayout().get("padding-box-width");
  };

  Widget.prototype.innerHeight = function() {
    return this.getLayout().get("padding-box-height");
  };

  Widget.prototype.minWidth = function() {
    var w;
    w = parseInt(this.getStyle('min-width'));
    if (w) {
      return w;
    } else {
      return 0;
    }
  };

  Widget.prototype.minHeight = function() {
    var h;
    h = parseInt(this.getStyle('min-height'));
    if (h) {
      return h;
    } else {
      return 0;
    }
  };

  Widget.prototype.maxWidth = function() {
    var w;
    w = parseInt(this.getStyle('max-width'));
    if (w) {
      return w;
    } else {
      return Number.MAX_VALUE;
    }
  };

  Widget.prototype.maxHeight = function() {
    var h;
    h = parseInt(this.getStyle('max-height'));
    if (h) {
      return h;
    } else {
      return Number.MAX_VALUE;
    }
  };

  Widget.prototype.relPos = function() {
    var o;
    o = this.positionedOffset();
    return pos(o.left, o.top);
  };

  Widget.prototype.absPos = function() {
    var o, s;
    o = this.cumulativeOffset();
    s = this.cumulativeScrollOffset();
    return pos(o.left - s.left, o.top - s.top);
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
    if (this.config.valueMax != null) {
      c = Math.min(c, this.config.valueMax);
    }
    if (this.config.valueMin != null) {
      c = Math.max(c, this.config.valueMin);
    }
    return c;
  };

  return Widget;

})();

//# sourceMappingURL=widget.js.map
