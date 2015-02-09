var Drag, Pos, Stage, StyleSwitch, log, pos, str, strIndent,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Drag = (function() {
  Drag.create = function(cfg) {
    return new Drag(cfg);
  };

  function Drag(cfg) {
    var tempPos;
    _.extend(this, _.def(cfg, {
      target: null,
      handle: null,
      minPos: null,
      maxPos: null,
      cursor: "move",
      onStart: null,
      onMove: null,
      onStop: null,
      doMove: true,
      active: true
    }));
    if (typeof this.target === "string") {
      this.target = document.getElementById(this.target);
    }
    if (this.target == null) {
      return;
    }
    if ((this.minPos != null) && (this.maxPos != null)) {
      tempPos = this.minPos;
      this.minPos = this.minPos.min(this.maxPos);
      this.maxPos = tempPos.max(this.maxPos);
    }
    this.cursorStartPos = null;
    this.targetStartPos = null;
    this.dragging = false;
    this.listening = false;
    if (typeof this.handle === "string") {
      this.handle = document.getElementById(this.handle);
    }
    if (this.handle == null) {
      this.handle = this.target;
    }
    this.handle.style.cursor = this.cursor;
    if (this.active) {
      this.startListening();
    }
    return;
  }

  Drag.prototype.cancelEvent = function(e) {
    e = (e ? e : window.event);
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
  };

  Drag.prototype.absPos = function(event) {
    event = (event ? event : window.event);
    if (isNaN(window.scrollX)) {
      return pos(event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, event.clientY + document.documentElement.scrollTop + document.body.scrollTop);
    } else {
      return pos(event.clientX + window.scrollX, event.clientY + window.scrollY);
    }
  };

  Drag.prototype.dragStart = function(event) {
    var style;
    if (this.dragging || !this.listening) {
      return;
    }
    this.dragging = true;
    if (this.onStart != null) {
      this.onStart(this, event);
    }
    this.cursorStartPos = this.absPos(event);
    style = window.getComputedStyle(this.target);
    this.targetStartPos = pos(parseInt(style.left), parseInt(style.top));
    this.targetStartPos = this.targetStartPos.check();
    this.eventMove = $(document).on('mousemove', this.dragMove.bind(this));
    this.eventUp = $(document).on('mouseup', this.dragUp.bind(this));
    return this.cancelEvent(event);
  };

  Drag.prototype.dragMove = function(event) {
    var newPos;
    if (!this.dragging) {
      return;
    }
    if (this.doMove) {
      newPos = this.absPos(event);
      newPos = newPos.add(this.targetStartPos).sub(this.cursorStartPos);
      newPos = newPos.bound(this.minPos, this.maxPos);
      newPos.apply(this.target);
    }
    if (this.onMove != null) {
      this.onMove(this, event);
    }
    return this.cancelEvent(event);
  };

  Drag.prototype.dragUp = function(event) {
    this.dragStop(event);
    return this.cancelEvent(event);
  };

  Drag.prototype.dragStop = function(event) {
    if (!this.dragging) {
      return;
    }
    this.eventMove.stop();
    this.eventUp.stop();
    this.cursorStartPos = null;
    this.targetStartPos = null;
    if ((this.onStop != null) && (event != null)) {
      this.onStop(this, event);
    }
    this.dragging = false;
  };

  Drag.prototype.startListening = function() {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.eventDown = this.handle.on('mousedown', this.dragStart.bind(this));
  };

  Drag.prototype.stopListening = function(stopCurrentDragging) {
    if (!this.listening) {
      return;
    }
    this.eventDown.stop();
    this.listening = false;
    if (stopCurrentDragging && this.dragging) {
      this.dragStop();
    }
  };

  return Drag;

})();

this.newElement = function(type) {
  var e;
  e = new Element(type);
  e.identify();
  return e;
};

Element.addMethods({
  raise: function(element) {
    if (!(element = $(element))) {
      return;
    }
    element.parentElement.appendChild(element);
  }
});

_.def = function(c, d) {
  if (c != null) {
    return _.defaults(_.clone(c), d);
  } else {
    return d;
  }
};

log = function() {
  var arg, s;
  s = ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      _results.push(str(arg));
    }
    return _results;
  }).apply(this, arguments)).join(" ");
  console.log("%c%s", 'color:white', s);
  Console.log.apply(Console, Array.prototype.slice.call(arguments, 0));
  return this;
};

Pos = (function() {
  function Pos(x, y) {
    this.x = x;
    this.y = y;
  }

  Pos.prototype.add = function(val) {
    var newPos;
    newPos = new Pos(this.x, this.y);
    if (val != null) {
      if (!isNaN(val.x)) {
        newPos.x += val.x;
      }
      if (!isNaN(val.y)) {
        newPos.y += val.y;
      }
    }
    return newPos;
  };

  Pos.prototype.sub = function(val) {
    var newPos;
    newPos = new Pos(this.x, this.y);
    if (val != null) {
      if (!isNaN(val.x)) {
        newPos.x -= val.x;
      }
      if (!isNaN(val.y)) {
        newPos.y -= val.y;
      }
    }
    return newPos;
  };

  Pos.prototype.mul = function(val) {
    this.x *= val;
    this.y *= val;
    return this;
  };

  Pos.prototype.mid = function(other) {
    return this.add(other).mul(0.5);
  };

  Pos.prototype.min = function(val) {
    var newPos;
    newPos = new Pos(this.x, this.y);
    if (val == null) {
      return newPos;
    }
    if (!isNaN(val.x) && this.x > val.x) {
      newPos.x = val.x;
    }
    if (!isNaN(val.y) && this.y > val.y) {
      newPos.y = val.y;
    }
    return newPos;
  };

  Pos.prototype.max = function(val) {
    var newPos;
    newPos = new Pos(this.x, this.y);
    if (val == null) {
      return newPos;
    }
    if (!isNaN(val.x) && this.x < val.x) {
      newPos.x = val.x;
    }
    if (!isNaN(val.y) && this.y < val.y) {
      newPos.y = val.y;
    }
    return newPos;
  };

  Pos.prototype.bound = function(lower, upper) {
    var newPos;
    newPos = this.max(lower);
    return newPos.min(upper);
  };

  Pos.prototype.check = function() {
    var newPos;
    newPos = new Pos(this.x, this.y);
    if (isNaN(newPos.x)) {
      newPos.x = 0;
    }
    if (isNaN(newPos.y)) {
      newPos.y = 0;
    }
    return newPos;
  };

  Pos.prototype.apply = function(element) {
    if (typeof element === "string") {
      element = document.getElementById(element);
    }
    if (element == null) {
      return;
    }
    if (!isNaN(this.x)) {
      element.style.left = this.x + "px";
    }
    if (!isNaN(this.y)) {
      element.style.top = this.y + "px";
    }
  };

  return Pos;

})();

pos = function(x, y) {
  return new Pos(x, y);
};

Stage = (function() {
  function Stage() {}

  Stage.width = function() {
    return this.size().width;
  };

  Stage.height = function() {
    return this.size().height;
  };

  Stage.size = function() {
    var s;
    s = window.getComputedStyle($('stage_content'));
    return {
      width: parseInt(s.width),
      height: parseInt(s.height)
    };
  };

  Stage.isFullscreen = function() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullScreen || document.webkitIsFullScreen;
  };

  Stage.toggleFullscreen = function() {
    var s;
    if (this.isFullscreen() != null) {
      if (typeof document.mozCancelFullScreen === "function") {
        document.mozCancelFullScreen();
      }
      if (typeof document.webkitExitFullscreen === "function") {
        document.webkitExitFullscreen();
      }
      return typeof document.exitFullscreen === "function" ? document.exitFullscreen() : void 0;
    } else {
      s = $('stage');
      if (typeof s.mozRequestFullScreen === "function") {
        s.mozRequestFullScreen();
      }
      if (typeof s.webkitRequestFullscreen === "function") {
        s.webkitRequestFullscreen();
      }
      return typeof s.requestFullscreen === "function" ? s.requestFullscreen() : void 0;
    }
  };

  return Stage;

})();

strIndent = "    ";

str = function(o, indent, visited) {
  var k, protoname, s, t;
  if (indent == null) {
    indent = "";
  }
  if (visited == null) {
    visited = [];
  }
  if (o === null) {
    return "<null>";
  }
  t = typeof o;
  if (t === 'string') {
    return o;
  } else if (t === 'object') {
    if (__indexOf.call(visited, o) >= 0) {
      if ((o.id != null) && typeof o.id === 'string' && (o.localName != null)) {
        return "<" + o.localName + "#" + o.id + ">";
      }
      return "<visited>";
    }
    protoname = o.constructor.name;
    if ((protoname == null) || protoname === "") {
      if ((o.id != null) && typeof o.id === 'string' && (o.localName != null)) {
        protoname = o.localName + "#" + o.id;
      } else {
        protoname = "object";
      }
    }
    s = "<" + protoname + ">\n";
    visited.push(o);
    s += ((function() {
      var _i, _len, _ref, _results;
      _ref = Object.getOwnPropertyNames(o);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        _results.push(indent + strIndent + k + ": " + str(o[k], indent + strIndent, visited));
      }
      return _results;
    })()).join("\n");
    return s + "\n";
  } else if (t === 'function') {
    return "->";
  } else {
    return String(o);
  }
  return "<???>";
};

String.prototype.fmt = function() {
  return vsprintf(this, [].slice.call(arguments));
};

StyleSwitch = (function() {
  function StyleSwitch() {}

  StyleSwitch.schemes = ['dark.css', 'bright.css'];

  StyleSwitch.toggle = function() {
    var currentScheme, link, newlink, nextSchemeIndex;
    link = document.getElementById('style-link');
    currentScheme = link.href.split('/').last();
    nextSchemeIndex = (this.schemes.indexOf(currentScheme) + 1) % this.schemes.length;
    newlink = document.createElement("link");
    newlink.setAttribute('rel', 'stylesheet');
    newlink.setAttribute('type', 'text/css');
    newlink.setAttribute('href', 'style/' + this.schemes[nextSchemeIndex]);
    newlink.setAttribute('id', 'style-link');
    return link.parentNode.replaceChild(newlink, link);
  };

  return StyleSwitch;

})();

//# sourceMappingURL=tools.js.map
