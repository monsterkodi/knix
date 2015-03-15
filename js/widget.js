
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
  function Widget(cfg, defs) {
    this.moveStop = __bind(this.moveStop, this);
    this.moveStart = __bind(this.moveStart, this);
    this.onMove = __bind(this.onMove, this);
    this.addMovement = __bind(this.addMovement, this);
    this.stretchWidth = __bind(this.stretchWidth, this);
    this.absCenter = __bind(this.absCenter, this);
    this.absPos = __bind(this.absPos, this);
    this.relPos = __bind(this.relPos, this);
    this.maxHeight = __bind(this.maxHeight, this);
    this.maxWidth = __bind(this.maxWidth, this);
    this.minHeight = __bind(this.minHeight, this);
    this.minWidth = __bind(this.minWidth, this);
    this.innerHeight = __bind(this.innerHeight, this);
    this.innerWidth = __bind(this.innerWidth, this);
    this.absRect = __bind(this.absRect, this);
    this.getHeight = __bind(this.getHeight, this);
    this.getWidth = __bind(this.getWidth, this);
    this.sizePos = __bind(this.sizePos, this);
    this.getSize = __bind(this.getSize, this);
    this.setSize = __bind(this.setSize, this);
    this.resize = __bind(this.resize, this);
    this.setHeightNoEmit = __bind(this.setHeightNoEmit, this);
    this.setHeight = __bind(this.setHeight, this);
    this.setWidth = __bind(this.setWidth, this);
    this.moveTo = __bind(this.moveTo, this);
    this.moveBy = __bind(this.moveBy, this);
    this.move = __bind(this.move, this);
    this.setPos = __bind(this.setPos, this);
    this.toggleDisplay = __bind(this.toggleDisplay, this);
    this.hide = __bind(this.hide, this);
    this.show = __bind(this.show, this);
    this.clear = __bind(this.clear, this);
    this.dump = __bind(this.dump, this);
    this.onTooltip = __bind(this.onTooltip, this);
    this.close = __bind(this.close, this);
    this.allChildren = __bind(this.allChildren, this);
    this.children = __bind(this.children, this);
    this.getChild = __bind(this.getChild, this);
    this.getWindow = __bind(this.getWindow, this);
    this.matchConfigValue = __bind(this.matchConfigValue, this);
    this.upWidgetWithConfigValue = __bind(this.upWidgetWithConfigValue, this);
    this.upWidgets = __bind(this.upWidgets, this);
    this.getAncestors = __bind(this.getAncestors, this);
    this.getUp = __bind(this.getUp, this);
    this.getParent = __bind(this.getParent, this);
    this.setText = __bind(this.setText, this);
    this.insertText = __bind(this.insertText, this);
    this.insertChildren = __bind(this.insertChildren, this);
    this.insertChild = __bind(this.insertChild, this);
    this.addToParent = __bind(this.addToParent, this);
    this.returnThis = __bind(this.returnThis, this);
    this.initElem = __bind(this.initElem, this);
    this.emitClose = __bind(this.emitClose, this);
    this.emitValue = __bind(this.emitValue, this);
    this.emitMove = __bind(this.emitMove, this);
    this.emitSize = __bind(this.emitSize, this);
    this.emit = __bind(this.emit, this);
    this.resolveSlot = __bind(this.resolveSlot, this);
    this.resolveSignal = __bind(this.resolveSignal, this);
    this.connector = __bind(this.connector, this);
    this.disconnect = __bind(this.disconnect, this);
    this.connect = __bind(this.connect, this);
    this.initConnections = __bind(this.initConnections, this);
    this.initEvents = __bind(this.initEvents, this);
    this.init = __bind(this.init, this);
    this.init(cfg, defs);
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
    this.initElem();
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
      delete this.config.parent;
    }
    this.insertChildren();
    this.insertText();
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
    this.initConnections();
    this.initEvents();
    Keys.registerWidget(this);
    return this;
  };


  /*
  00000000  000   000  00000000  000   000  000000000   0000000
  000       000   000  000       0000  000     000     000     
  0000000    000 000   0000000   000 0 000     000     0000000 
  000          000     000       000  0000     000          000
  00000000      0      00000000  000   000     000     0000000
   */

  Widget.prototype.initEvents = function() {
    if (this.config.onClick != null) {
      this.elem.addEventListener("click", this.config.onClick);
    }
    if (this.config.onDown != null) {
      this.elem.addEventListener("mousedown", this.config.onDown);
    }
    if (this.config.onUp != null) {
      this.elem.addEventListener("mouseup", this.config.onUp);
    }
    if (this.config.onOver != null) {
      this.elem.addEventListener("mouseover", this.config.onOver);
    }
    if (this.config.onMove != null) {
      this.elem.addEventListener("mousemove", this.config.onMove);
    }
    if (this.config.onOut != null) {
      this.elem.addEventListener("mouseout", this.config.onOut);
    }
    if (this.config.onDouble != null) {
      this.elem.addEventListener("ondblclick", this.config.onDouble);
    }
    return this;
  };


  /*
   0000000   0000000   000   000  000   000  00000000   0000000  000000000  000   0000000   000   000
  000       000   000  0000  000  0000  000  000       000          000     000  000   000  0000  000
  000       000   000  000 0 000  000 0 000  0000000   000          000     000  000   000  000 0 000
  000       000   000  000  0000  000  0000  000       000          000     000  000   000  000  0000
   0000000   0000000   000   000  000   000  00000000   0000000     000     000   0000000   000   000
   */

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
    _ref = this.resolveSignal(signal), signalSender = _ref[0], signalEvent = _ref[1];
    slotFunction = this.resolveSlot(slot);
    if (signalSender == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 137,
        "args": ["signal", "slot"],
        "method": "connect",
        "type": "."
      }, "sender not found!");
    }
    if (signalEvent == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 139,
        "args": ["signal", "slot"],
        "method": "connect",
        "type": "."
      }, "event not found!");
    }
    if (slotFunction == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 141,
        "args": ["signal", "slot"],
        "method": "connect",
        "type": "."
      }, "slot not found!");
    }
    signalSender.elem.addEventListener(signalEvent, slotFunction);
    return this;
  };

  Widget.prototype.disconnect = function(signal, slot) {
    var signalEvent, signalSender, slotFunction, _ref;
    _ref = this.resolveSignal(signal), signalSender = _ref[0], signalEvent = _ref[1];
    slotFunction = this.resolveSlot(slot);
    if (signalSender == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 150,
        "args": ["signal", "slot"],
        "method": "disconnect",
        "type": "."
      }, "sender not found!");
    }
    if (signalEvent == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 152,
        "args": ["signal", "slot"],
        "method": "disconnect",
        "type": "."
      }, "event not found!");
    }
    if (slotFunction == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 154,
        "args": ["signal", "slot"],
        "method": "disconnect",
        "type": "."
      }, "slot not found!");
    }
    signalSender.elem.removeEventListener(signalEvent, slotFunction);
    return this;
  };

  Widget.prototype.connector = function(name) {
    var e, t, _i, _j, _len, _len1, _ref, _ref1;
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
      "class": "Widget",
      "line": 170,
      "args": ["name"],
      "method": "connector",
      "type": "."
    }, 'connector not found!', name);
    return void 0;
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
            "class": "Widget",
            "line": 200,
            "args": ["slot"],
            "method": "resolveSlot",
            "type": "."
          }, 'not a function');
        }
      }
    }
    error({
      "file": "./coffee/widget.coffee",
      "class": "Widget",
      "line": 202,
      "args": ["slot"],
      "method": "resolveSlot",
      "type": "."
    }, 'cant resolve slot:', slot, typeof slot);
    return null;
  };


  /*
   0000000  000   0000000   000   000   0000000   000    
  000       000  000        0000  000  000   000  000    
  0000000   000  000  0000  000 0 000  000000000  000    
       000  000  000   000  000  0000  000   000  000    
  0000000   000   0000000   000   000  000   000  0000000
   */

  Widget.prototype.emit = function(signal, args) {
    var event, _ref;
    event = new CustomEvent(signal, {
      bubbles: false,
      cancelable: true,
      detail: args
    });
    if ((_ref = this.elem) != null) {
      _ref.dispatchEvent(event);
    }
    return this;
  };

  Widget.prototype.emitSize = function() {
    this.config.width = this.getWidth();
    this.config.height = this.getHeight();
    return this.emit('size', {
      width: this.config.width,
      height: this.config.height
    });
  };

  Widget.prototype.emitMove = function() {
    var p;
    p = pos(this.config.x, this.config.y);
    return this.emit('move', {
      pos: p
    });
  };

  Widget.prototype.emitValue = function(v) {
    return this.emit('onValue', {
      value: v
    });
  };

  Widget.prototype.emitClose = function() {
    return this.emit('close');
  };


  /*
  00000000  000      00000000  00     00
  000       000      000       000   000
  0000000   000      0000000   000000000
  000       000      000       000 0 000
  00000000  0000000  00000000  000   000
   */

  Widget.elem = function(type, clss) {
    var e;
    e = new Element(type);
    e.id = Widget.newID(clss);
    e.addClassName(clss);
    return e;
  };

  Widget.newID = function(clss) {
    return "%s-%s".fmt(clss, uuid.v4());
  };

  Widget.prototype.initElem = function() {
    this.elem.getWindow = this.getWindow;
    this.elem.getChild = this.getChild;
    this.elem.getParent = this.getParent;
    return this.elem.toggleDisplay = this.toggleDisplay;
  };


  /*
  000   000  000  00000000  00000000    0000000   00000000    0000000  000   000  000   000
  000   000  000  000       000   000  000   000  000   000  000       000   000   000 000 
  000000000  000  0000000   0000000    000000000  0000000    000       000000000    00000  
  000   000  000  000       000   000  000   000  000   000  000       000   000     000   
  000   000  000  00000000  000   000  000   000  000   000   0000000  000   000     000
   */

  Widget.prototype.returnThis = function() {
    return this;
  };

  Widget.prototype.addToParent = function(p) {
    var parentElement, _ref;
    if (this.elem == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 273,
        "args": ["p"],
        "method": "addToParent",
        "type": "."
      }, 'no @elem?');
      return this;
    }
    if (p == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 276,
        "args": ["p"],
        "method": "addToParent",
        "type": "."
      }, 'no p?');
      return this;
    }
    parentElement = (_ref = p.content) != null ? _ref.elem : void 0;
    if (!parentElement) {
      parentElement = p.elem;
    }
    if (!parentElement) {
      parentElement = $(p);
    }
    if (parentElement == null) {
      error({
        "file": "./coffee/widget.coffee",
        "class": "Widget",
        "line": 282,
        "args": ["p"],
        "method": "addToParent",
        "type": "."
      }, 'no element?', p);
      return this;
    }
    parentElement.insert(this.elem);
    this.config.parentID = parentElement.id;
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

  Widget.prototype.insertText = function() {
    var _ref;
    if (this.config.text != null) {
      return (_ref = this.elem) != null ? _ref.insert(this.config.text) : void 0;
    }
  };

  Widget.prototype.setText = function(t) {
    this.elem.textContent = '';
    this.config.text = t;
    return this.insertText();
  };

  Widget.prototype.getParent = function() {
    var a, anc, args, _i, _len, _ref;
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
    if (this.config.parentID) {
      return $(this.config.parentID).widget;
    }
    if (this.parentElement != null) {
      return $(this.parentElement.id).widget;
    }
    if ((typeof this.getWidget === "function" ? (_ref = this.getWidget()) != null ? _ref.getParent : void 0 : void 0) != null) {
      return this.getWidget().getParent();
    }
    return void 0;
  };

  Widget.prototype.getUp = function() {
    var args;
    args = $A(arguments);
    if (args.length) {
      if (this.elem.match("#" + args[0]) || this.elem.match("." + args[0])) {
        return this;
      }
    }
    return this.getParent.apply(this, arguments);
  };

  Widget.prototype.getAncestors = function() {
    var _ref;
    return _.filter([this.getParent(), (_ref = this.getParent()) != null ? _ref.getAncestors() : void 0].flatten());
  };

  Widget.prototype.upWidgets = function() {
    return _.filter([this, this.getAncestors()].flatten());
  };

  Widget.prototype.upWidgetWithConfigValue = function(key) {
    return _.find(this.upWidgets(), function(w) {
      var _ref;
      return (w != null ? (_ref = w.config) != null ? _ref[key] : void 0 : void 0) != null;
    });
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
    })());
  };

  Widget.prototype.getWindow = function() {
    if (arguments.length) {
      return $($A(arguments)[0]).widget;
    }
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

  Widget.prototype.children = function() {
    var c;
    return _.filter((function() {
      var _i, _len, _ref, _results;
      _ref = this.elem.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(typeof c.getWidget === "function" ? c.getWidget() : void 0);
      }
      return _results;
    }).call(this));
  };

  Widget.prototype.allChildren = function() {
    var c;
    return _.unique(_.filter((function() {
      var _i, _len, _ref, _results;
      _ref = $(this.elem.id).descendants();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(typeof c.getWidget === "function" ? c.getWidget() : void 0);
      }
      return _results;
    }).call(this)));
  };


  /*
  00     00  000   0000000   0000000
  000   000  000  000       000     
  000000000  000  0000000   000     
  000 0 000  000       000  000     
  000   000  000  0000000    0000000
   */

  Widget.prototype.close = function() {
    var _ref;
    Keys.unregisterWidget(this);
    this.emitClose();
    if ((_ref = this.elem) != null) {
      _ref.remove();
    }
    delete this.elem;
    delete this.config;
    return void 0;
  };

  Widget.prototype.onTooltip = function() {
    return this.config.tooltip;
  };

  Widget.prototype.dump = function() {
    return this.config;
  };

  Widget.prototype.clear = function() {
    while (this.elem.hasChildNodes()) {
      this.elem.removeChild(this.elem.lastChild);
    }
    return this;
  };

  Widget.prototype.show = function() {
    this.elem.show();
    this.elem.raise();
    return this;
  };

  Widget.prototype.hide = function() {
    this.elem.hide();
    return this;
  };

  Widget.prototype.toggleDisplay = function() {
    if (this.elem.visible()) {
      return this.elem.hide();
    } else {
      return this.elem.show();
    }
  };


  /*
   0000000   00000000   0000000   00     00  00000000  000000000  00000000   000   000
  000        000       000   000  000   000  000          000     000   000   000 000 
  000  0000  0000000   000   000  000000000  0000000      000     0000000      00000  
  000   000  000       000   000  000 0 000  000          000     000   000     000   
   0000000   00000000   0000000   000   000  00000000     000     000   000     000
   */

  Widget.prototype.setPos = function(p) {
    return this.moveTo(p.x, p.y);
  };

  Widget.prototype.move = function(p) {
    return this.moveBy(p.x, p.y);
  };

  Widget.prototype.moveBy = function(dx, dy) {
    return this.setPos(this.relPos().plus(pos(dx, dy)));
  };

  Widget.prototype.moveTo = function(x, y) {
    if (x != null) {
      this.config.x = x;
    }
    if (y != null) {
      this.config.y = y;
    }
    if (x != null) {
      this.elem.style.left = "%dpx".fmt(x);
    }
    if (y != null) {
      this.elem.style.top = "%dpx".fmt(y);
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
    var oh;
    if (h != null) {
      oh = this.elem.style.height;
      this.setHeightNoEmit(h);
      if (oh !== this.elem.style.height) {
        this.emitSize();
      }
    }
    return this;
  };

  Widget.prototype.setHeightNoEmit = function(h) {
    var diff;
    if (h != null) {
      this.elem.style.height = "%dpx".fmt(h);
    }
    diff = this.getHeight() - h;
    if (diff) {
      return this.elem.style.height = "%dpx".fmt(h - diff);
    }
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

  Widget.prototype.sizePos = function() {
    return pos(this.getWidth(), this.getHeight());
  };

  Widget.prototype.getWidth = function() {
    var _ref;
    return (_ref = this.elem) != null ? _ref.getWidth() : void 0;
  };

  Widget.prototype.getHeight = function() {
    var _ref;
    return (_ref = this.elem) != null ? _ref.getHeight() : void 0;
  };

  Widget.prototype.absRect = function() {
    return new Rect(this.absPos().x, this.absPos().y, this.getWidth(), this.getHeight());
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
    return this.absPos().plus(pos(this.elem.getWidth(), this.elem.getHeight()).scale(0.5));
  };

  Widget.prototype.stretchWidth = function() {
    return this.elem.style.width = '50%';
  };


  /*
  00     00   0000000   000   000  00000000
  000   000  000   000  000   000  000     
  000000000  000   000   000 000   0000000 
  000 0 000  000   000     000     000     
  000   000   0000000       0      00000000
   */

  Widget.prototype.addMovement = function() {
    if (this.config.isMovable) {
      return new Drag({
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
    var _ref;
    log({
      "file": "./coffee/widget.coffee",
      "class": "Widget",
      "line": 479,
      "args": ["drag", "event"],
      "method": "onMove",
      "type": "."
    }, 'move', (_ref = this.elem) != null ? _ref.id : void 0);
    return this.emitMove();
  };

  Widget.prototype.moveStart = function(drag, event) {
    var _ref;
    tag('Drag');
    log({
      "file": "./coffee/widget.coffee",
      "class": "Widget",
      "line": 484,
      "args": ["drag", "event"],
      "method": "moveStart",
      "type": "."
    }, 'start', (_ref = event.target) != null ? _ref.id : void 0);
    return StyleSwitch.togglePathFilter();
  };

  Widget.prototype.moveStop = function(drag, event) {
    var _ref;
    tag('Drag');
    log({
      "file": "./coffee/widget.coffee",
      "class": "Widget",
      "line": 489,
      "args": ["drag", "event"],
      "method": "moveStop",
      "type": "."
    }, 'stop', (_ref = event.target) != null ? _ref.id : void 0);
    return StyleSwitch.togglePathFilter();
  };

  return Widget;

})();

//# sourceMappingURL=widget.js.map
