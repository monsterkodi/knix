
/*

000   000  000  0000000     0000000   00000000  000000000
000 0 000  000  000   000  000        000          000   
000000000  000  000   000  000  0000  0000000      000   
000   000  000  000   000  000   000  000          000   
00     00  000  0000000     0000000   00000000     000
 */
var Widget,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Widget = (function() {
  function Widget(config, defaults) {
    this.layoutChildren = __bind(this.layoutChildren, this);
    this.stretchWidth = __bind(this.stretchWidth, this);
    this.moveStop = __bind(this.moveStop, this);
    this.moveStart = __bind(this.moveStart, this);
    this.onMove = __bind(this.onMove, this);
    this.addMovement = __bind(this.addMovement, this);
    this.absCenter = __bind(this.absCenter, this);
    this.absPos = __bind(this.absPos, this);
    this.relPos = __bind(this.relPos, this);
    this.maxHeight = __bind(this.maxHeight, this);
    this.maxWidth = __bind(this.maxWidth, this);
    this.minHeight = __bind(this.minHeight, this);
    this.minWidth = __bind(this.minWidth, this);
    this.innerHeight = __bind(this.innerHeight, this);
    this.innerWidth = __bind(this.innerWidth, this);
    this.getHeight = __bind(this.getHeight, this);
    this.getWidth = __bind(this.getWidth, this);
    this.getSize = __bind(this.getSize, this);
    this.setSize = __bind(this.setSize, this);
    this.resize = __bind(this.resize, this);
    this.setHeight = __bind(this.setHeight, this);
    this.setWidth = __bind(this.setWidth, this);
    this.moveBy = __bind(this.moveBy, this);
    this.moveTo = __bind(this.moveTo, this);
    this.setPos = __bind(this.setPos, this);
    this.toggleDisplay = __bind(this.toggleDisplay, this);
    this.clear = __bind(this.clear, this);
    this.close = __bind(this.close, this);
    this.getChild = __bind(this.getChild, this);
    this.getWindow = __bind(this.getWindow, this);
    this.matchConfigValue = __bind(this.matchConfigValue, this);
    this.getAncestors = __bind(this.getAncestors, this);
    this.getParent = __bind(this.getParent, this);
    this.insertChildren = __bind(this.insertChildren, this);
    this.insertChild = __bind(this.insertChild, this);
    this.addToParent = __bind(this.addToParent, this);
    this.emitMove = __bind(this.emitMove, this);
    this.emitSize = __bind(this.emitSize, this);
    this.emit = __bind(this.emit, this);
    this.resolveSlot = __bind(this.resolveSlot, this);
    this.resolveSignal = __bind(this.resolveSignal, this);
    this.connect = __bind(this.connect, this);
    this.initConnections = __bind(this.initConnections, this);
    this.connector = __bind(this.connector, this);
    this.initSlots = __bind(this.initSlots, this);
    this.initEvents = __bind(this.initEvents, this);
    this.dump = __bind(this.dump, this);
    this.onTooltip = __bind(this.onTooltip, this);
    this.init = __bind(this.init, this);
    this.init(config, defaults);
  }

  Widget.prototype.init = function(cfg, defs) {
    var a, clss, k, s, style, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4;
    cfg = _.def(cfg, defs);
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
    if (cfg.id != null) {
      this.elem.id = cfg.id;
    }
    this.elem.widget = this;
    this.config = cfg;
    this.config.id = this.elem.id;
    this.elem.getWindow = this.getWindow;
    this.elem.getChild = this.getChild;
    this.elem.getParent = this.getParent;
    this.elem.toggleDisplay = this.toggleDisplay;
    this.elem.relPos = function() {
      var o;
      o = this.positionedOffset();
      return pos(o.left, o.top);
    };
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
    if (this.config.parent != null) {
      this.addToParent(this.config.parent);
    }
    this.insertChildren();
    if (this.config.text != null) {
      this.elem.insert(this.config.text);
    }
    if (this.config.pos != null) {
      if (this.config.pos.x != null) {
        this.config.x = this.config.pos.x;
      }
      if (this.config.pos.y != null) {
        this.config.y = this.config.pos.y;
      }
    }
    if ((this.config.x != null) || (this.config.y != null)) {
      this.elem.style.position = 'absolute';
      this.moveTo(this.config.x, this.config.y);
    }
    if ((this.config.width != null) || (this.config.height != null)) {
      this.resize(this.config.width, this.config.height);
    }
    if (this.config.tooltip) {
      Tooltip.create({
        target: this,
        onTooltip: this.onTooltip
      });
    }
    this.addMovement();
    this.initSlots();
    this.initConnections();
    this.initEvents();
    return this;
  };

  Widget.prototype.onTooltip = function() {
    return this.config.tooltip;
  };

  Widget.prototype.dump = function() {
    return this.config;
  };

  Widget.prototype.initEvents = function() {
    if (this.config.onClick != null) {
      this.elem.on("click", this.config.onClick);
    }
    if (this.config.onDown != null) {
      this.elem.on("mousedown", this.config.onDown);
    }
    if (this.config.onUp != null) {
      this.elem.on("mouseup", this.config.onUp);
    }
    if (this.config.onOver != null) {
      this.elem.on("mouseover", this.config.onOver);
    }
    if (this.config.onMove != null) {
      this.elem.on("mousemove", this.config.onMove);
    }
    if (this.config.onOut != null) {
      this.elem.on("mouseout", this.config.onOut);
    }
    if (this.config.onDouble != null) {
      this.elem.on("ondblclick", this.config.onDouble);
    }
    return this;
  };

  Widget.prototype.initSlots = function() {
    var func, slot, slots;
    slots = this.config.slots;
    if (slots == null) {
      return;
    }
    for (slot in slots) {
      func = slots[slot];
      this[slot] = func;
    }
    return this;
  };

  Widget.prototype.connector = function(name) {
    var e, t, _i, _j, _len, _len1, _ref, _ref1;
    tag('Connection');
    _ref = ['slot', 'signal', 'in', 'out'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      _ref1 = this.elem.select('.' + t);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        e = _ref1[_j];
        if (e.hasClassName('connector')) {
          if (e.widget.config[t] === name || e.widget.config[t] + ':' + t === name) {
            return e.widget;
          }
        }
      }
    }
    error({
      "file": "./coffee/widget.coffee",
      "line": 137,
      "class": "Widget",
      "args": ["name"],
      "method": "connector",
      "type": "."
    }, 'connector not found!', name);
    return void 0;
  };

  Widget.prototype.initConnections = function() {
    var connection, connections, _i, _len;
    connections = this.config.connect;
    if (connections == null) {
      return;
    }
    for (_i = 0, _len = connections.length; _i < _len; _i++) {
      connection = connections[_i];
      this.connect(connection.signal, connection.slot);
    }
    return this;
  };

  Widget.prototype.connect = function(signal, slot) {
    var signalEvent, signalSender, slotFunction, _ref;
    tag('Connection');
    _ref = this.resolveSignal(signal), signalSender = _ref[0], signalEvent = _ref[1];
    slotFunction = this.resolveSlot(slot);
    if (signalSender == null) {
      error({
        "file": "./coffee/widget.coffee",
        "line": 153,
        "class": "Widget",
        "args": ["signal", "slot"],
        "method": "connect",
        "type": "."
      }, "sender not found!");
    }
    if (signalEvent == null) {
      error({
        "file": "./coffee/widget.coffee",
        "line": 155,
        "class": "Widget",
        "args": ["signal", "slot"],
        "method": "connect",
        "type": "."
      }, "event not found!");
    }
    if (slotFunction == null) {
      error({
        "file": "./coffee/widget.coffee",
        "line": 157,
        "class": "Widget",
        "args": ["signal", "slot"],
        "method": "connect",
        "type": "."
      }, "slot not found!");
    }
    return {
      handler: signalSender.elem.on(signalEvent, slotFunction),
      sender: signalSender,
      event: signalEvent,
      receiver: slotFunction
    };
  };

  Widget.prototype.resolveSignal = function(signal) {
    var event, sdr, sender, _ref, _ref1;
    _ref = signal.split(':').reverse(), event = _ref[0], sender = _ref[1];
    if (sender != null) {
      sdr = this.getChild(sender);
      if (sdr == null) {
        sdr = (_ref1 = this.getWindow()) != null ? _ref1.getChild(sender) : void 0;
      }
      sender = sdr;
    }
    if (sender == null) {
      sender = this;
    }
    return [sender, event];
  };

  Widget.prototype.resolveSlot = function(slot) {
    var func, rec, receiver, _ref, _ref1;
    if (typeof slot === 'function') {
      return slot;
    }
    if (typeof slot === 'string') {
      _ref = slot.split(':').reverse(), func = _ref[0], receiver = _ref[1];
      if (receiver != null) {
        rec = this.getChild(receiver);
        if (rec == null) {
          rec = (_ref1 = this.getWindow()) != null ? _ref1.getChild(receiver) : void 0;
        }
        receiver = rec;
      }
      if (receiver == null) {
        receiver = this;
      }
      if (receiver[func] != null) {
        if (typeof receiver[func] === 'function') {
          return receiver[func];
        } else {
          error({
            "file": "./coffee/widget.coffee",
            "line": 190,
            "class": "Widget",
            "args": ["slot"],
            "method": "resolveSlot",
            "type": "."
          }, 'not a function');
        }
      }
    }
    error({
      "file": "./coffee/widget.coffee",
      "line": 192,
      "class": "Widget",
      "args": ["slot"],
      "method": "resolveSlot",
      "type": "."
    }, 'cant resolve slot:', slot, typeof slot);
    return null;
  };

  Widget.prototype.emit = function(signal, args) {
    var event;
    event = new CustomEvent(signal, {
      bubbles: true,
      cancelable: true,
      detail: args
    });
    this.elem.dispatchEvent(event);
    return this;
  };

  Widget.prototype.emitSize = function() {
    this.emit('size', {
      width: this.getWidth(),
      height: this.getHeight()
    });
    return this;
  };

  Widget.prototype.emitMove = function() {
    this.emit('move', {
      pos: this.absPos()
    });
    return this;
  };

  Widget.elem = function(type, clss) {
    var e;
    e = new Element(type);
    e.id = "%s.%s".fmt(clss, uuid.v4());
    e.addClassName(clss);
    return e;
  };

  Widget.prototype.addToParent = function(p) {
    var parentElement;
    if (this.elem == null) {
      error({
        "file": "./coffee/widget.coffee",
        "line": 227,
        "class": "Widget",
        "args": ["p"],
        "method": "addToParent",
        "type": "."
      }, 'no @elem?');
      return this;
    }
    if (p == null) {
      error({
        "file": "./coffee/widget.coffee",
        "line": 230,
        "class": "Widget",
        "args": ["p"],
        "method": "addToParent",
        "type": "."
      }, 'no p?');
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
      error({
        "file": "./coffee/widget.coffee",
        "line": 236,
        "class": "Widget",
        "args": ["p"],
        "method": "addToParent",
        "type": "."
      }, 'no element?', p);
      return this;
    }
    parentElement.insert(this.elem);
    this.config.parentId = parentElement.id;
    return this;
  };

  Widget.prototype.insertChild = function(config, defaults) {
    var child;
    child = knix.create(config, defaults);
    child.addToParent(this);
    return child;
  };

  Widget.prototype.insertChildren = function() {
    var c, cfg, _i, _len, _ref;
    if (this.config.child) {
      c = this.insertChild(this.config.child);
      this.config.child = c.config;
    }
    if (this.config.children) {
      c = [];
      _ref = this.config.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cfg = _ref[_i];
        c.push(this.insertChild(cfg).config);
      }
      this.config.children = c;
    }
    return this;
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
    if (this.config.parentId) {
      return $(this.config.parentId).widget;
    }
    return $(this.parentElement.id).wiget;
  };

  Widget.prototype.getAncestors = function() {
    var _ref;
    return [this.getParent(), (_ref = this.getParent()) != null ? _ref.getAncestors() : void 0].flatten();
  };

  Widget.prototype.matchConfigValue = function(key, value, list) {
    var w;
    return _.filter((function() {
      var _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        w = list[_i];
        if ((w != null ? (_ref = w.config) != null ? _ref[key] : void 0 : void 0) === value) {
          _results.push(w);
        }
      }
      return _results;
    })(), function(e) {
      return e != null;
    });
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
    log({
      "file": "./coffee/widget.coffee",
      "line": 286,
      "class": "Widget",
      "args": ["classOrID"],
      "method": "close",
      "type": "."
    }, 'close', this.elem.id);
    this.emit('close');
    this.elem.remove();
    this.elem = null;
    this.config = null;
    return void 0;
  };

  Widget.prototype.clear = function() {
    while (this.elem.hasChildNodes()) {
      this.elem.removeChild(this.elem.lastChild);
    }
    return this;
  };

  Widget.prototype.toggleDisplay = function() {
    if (this.elem.visible()) {
      return this.elem.hide();
    } else {
      return this.elem.show();
    }
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
    return this;
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
    return this;
  };

  Widget.prototype.setWidth = function(w) {
    var diff, ow;
    if (w != null) {
      ow = this.elem.style.width;
      this.elem.style.width = "%dpx".fmt(w);
      diff = this.getWidth() - w;
      if (diff) {
        this.elem.style.width = "%dpx".fmt(w - diff);
      }
      if (ow !== this.elem.style.width) {
        this.emitSize();
      }
    }
    return this;
  };

  Widget.prototype.setHeight = function(h) {
    var diff, oh;
    if (h != null) {
      oh = this.elem.style.height;
      if (h != null) {
        this.elem.style.height = "%dpx".fmt(h);
      }
      diff = this.getHeight() - h;
      if (diff) {
        this.elem.style.height = "%dpx".fmt(h - diff);
      }
      if (oh !== this.elem.style.height) {
        this.emitSize();
      }
    }
    return this;
  };

  Widget.prototype.resize = function(w, h) {
    this.setWidth(w);
    this.setHeight(h);
    return this;
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

  Widget.prototype.getWidth = function() {
    return this.elem.getWidth();
  };

  Widget.prototype.getHeight = function() {
    return this.elem.getHeight();
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

  Widget.prototype.addMovement = function() {
    if (this.config.isMovable) {
      log({
        "file": "./coffee/widget.coffee",
        "line": 368,
        "class": "Widget",
        "args": ["s"],
        "method": "addMovement",
        "type": "."
      }, 'addMovement');
      return Drag.create({
        target: this.elem,
        minPos: pos(void 0, 0),
        onMove: this.onMove,
        onStart: this.moveStart,
        onStop: this.moveStop,
        cursor: null
      });
    }
  };

  Widget.prototype.onMove = function(drag, event) {
    return this.emitMove();
  };

  Widget.prototype.moveStart = function(drag, event) {
    var _ref;
    log({
      "file": "./coffee/widget.coffee",
      "line": 382,
      "class": "Widget",
      "args": ["drag", "event"],
      "method": "moveStart",
      "type": "."
    }, 'start', (_ref = event.target) != null ? _ref.id : void 0);
    return StyleSwitch.togglePathFilter();
  };

  Widget.prototype.moveStop = function(drag, event) {
    var _ref;
    log({
      "file": "./coffee/widget.coffee",
      "line": 386,
      "class": "Widget",
      "args": ["drag", "event"],
      "method": "moveStop",
      "type": "."
    }, 'stop', (_ref = this.event.target) != null ? _ref.id : void 0);
    return StyleSwitch.togglePathFilter();
  };

  Widget.prototype.stretchWidth = function() {
    return this.elem.style.width = '50%';
  };

  Widget.prototype.layoutChildren = function() {
    var e;
    e = (this.config.content != null) && $(this.config.content) || this.elem;
    if (this.config.width == null) {
      if (e.widget.config.resize != null) {
        if (e.widget.config.resize === 'horizontal' || e.widget.config.resize === true) {
          e.widget.stretchWidth();
        }
      } else {
        this.setWidth(e.getWidth());
      }
    }
    if (this.config.height == null) {
      this.setHeight(e.getHeight());
    }
    if (this.config.resize) {
      if (this.config.minWidth == null) {
        e.style.minWidth = "%dpx".fmt(e.getWidth());
      }
      if (this.config.minHeight == null) {
        e.style.minHeight = "%dpx".fmt(e.getHeight());
      }
      if (this.config.resize === 'horizontal') {
        if (this.config.maxHeight == null) {
          e.style.maxHeight = "%dpx".fmt(e.getHeight());
        }
      }
      if (this.config.resize === 'vertical') {
        if (this.config.maxWidth == null) {
          return e.style.maxWidth = "%dpx".fmt(e.getWidth());
        }
      }
    }
  };

  return Widget;

})();

//# sourceMappingURL=widget.js.map
