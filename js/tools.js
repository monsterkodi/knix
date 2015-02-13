
/*

    0000000    00000000    0000000    0000000 
    000   000  000   000  000   000  000      
    000   000  0000000    000000000  000  0000
    000   000  000   000  000   000  000   000
    0000000    000   000  000   000   0000000
 */
var Drag, Pos, Stage, StyleSwitch, error, log, pos, str, strIndent, _log,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Drag = (function() {
  Drag.create = function(cfg) {
    return new Drag(cfg);
  };

  function Drag(cfg) {
    this.stopListening = __bind(this.stopListening, this);
    this.startListening = __bind(this.startListening, this);
    this.dragStop = __bind(this.dragStop, this);
    this.dragUp = __bind(this.dragUp, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.absPos = __bind(this.absPos, this);
    this.cancelEvent = __bind(this.cancelEvent, this);
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
    if (this.dragging || !this.listening) {
      return;
    }
    this.dragging = true;
    if (this.onStart != null) {
      this.onStart(this, event);
    }
    this.cursorStartPos = this.absPos(event);
    if (this.doMove) {
      this.targetStartPos = this.target.relPos();
      this.targetStartPos = this.targetStartPos.check();
    }
    this.eventMove = $(document).on('mousemove', this.dragMove);
    this.eventUp = $(document).on('mouseup', this.dragUp);
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
      newPos.clamp(this.minPos, this.maxPos);
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
    this.eventDown = this.handle.on('mousedown', this.dragStart);
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


/*

    000        0000000    0000000
    000       000   000  000
    000       000   000  000  0000
    000       000   000  000   000
    000000000  0000000    0000000
 */

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
  return Console.log.apply(Console, Array.prototype.slice.call(arguments, 0));
};

_log = function() {
  var arg, array, s;
  array = Array.prototype.slice.call(arguments, 2);
  s = ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      arg = array[_i];
      _results.push(str(arg));
    }
    return _results;
  })()).join(" ");
  return Console.logFileLine(arguments[0], arguments[1], s);
};

error = function() {
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
  console.log("%c%s", 'color:yellow', s);
  return Console.error.apply(Console, Array.prototype.slice.call(arguments, 0));
};


/*

    00000000    0000000    0000000  
    000   000  000   000  000       
    00000000   000   000   0000000  
    000        000   000        000 
    000         0000000    0000000
 */

Pos = (function() {
  function Pos(x, y) {
    this.x = x;
    this.y = y;
    this.apply = __bind(this.apply, this);
    this.check = __bind(this.check, this);
    this.dist = __bind(this.dist, this);
    this.distSquare = __bind(this.distSquare, this);
    this.square = __bind(this.square, this);
    this.clamp = __bind(this.clamp, this);
    this.max = __bind(this.max, this);
    this.min = __bind(this.min, this);
    this.mid = __bind(this.mid, this);
    this.mul = __bind(this.mul, this);
    this.sub = __bind(this.sub, this);
    this.add = __bind(this.add, this);
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

  Pos.prototype.clamp = function(lower, upper) {
    if ((lower != null) && (upper != null)) {
      this.x = _.clamp(lower.x, upper.x, x);
      this.y = _.clamp(lower.y, upper.y, y);
    }
    return this;
  };

  Pos.prototype.square = function() {
    return (this.x * this.x) + (this.y * this.y);
  };

  Pos.prototype.distSquare = function(o) {
    return this.sub(o).square();
  };

  Pos.prototype.dist = function(o) {
    return Math.sqrt(this.distSquare(o));
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


/*

     0000000  000000000  0000000    0000000   00000000
    000          000    000   000  000        000
     0000000     000    000000000  000  0000  0000000
          000    000    000   000  000   000  000
     0000000     000    000   000   0000000   00000000
 */

Stage = (function() {
  function Stage() {}

  Stage.initContextMenu = function() {
    _log('./coffee/tools/stage.coffee', 15, 'initContextMenu');
    $('stage_content').on('mousedown', Stage.showContextMenu);
    Stage.contextMenu = knix.get({
      id: 'context-menu',
      type: 'context-menu',
      title: 'context',
      style: {
        position: 'absolute'
      }
    });
    Stage.contextMenu.elem.hide();
    return Stage.contextMenu;
  };

  Stage.showContextMenu = function() {
    _log('./coffee/tools/stage.coffee', 29, 'showContextMenu');
    return Stage.contextMenu.elem.show();
  };

  Stage.width = function() {
    return Stage.size().width;
  };

  Stage.height = function() {
    return Stage.size().height;
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
    if (Stage.isFullscreen() != null) {
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

  Stage.absPos = function(event) {
    event = event != null ? event : window.event;
    if (isNaN(window.scrollX)) {
      return pos(event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft, event.clientY + document.documentElement.scrollTop + document.body.scrollTop);
    } else {
      return pos(event.clientX + window.scrollX, event.clientY + window.scrollY);
    }
  };

  return Stage;

})();


/*

     0000000  000000000 00000000
    000          000    000   000
     0000000     000    0000000
          000    000    000   000
     0000000     000    000   000
 */

strIndent = "    ";

str = function(o, indent, visited) {
  var k, protoname, s, t, v;
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
    if (protoname === 'Array') {
      s = '[\n';
      visited.push(o);
      s += ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = o.length; _i < _len; _i++) {
          v = o[_i];
          _results.push(indent + strIndent + str(v, indent + strIndent, visited));
        }
        return _results;
      })()).join("\n");
      s += '\n' + indent + strIndent + ']';
    } else {
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
    }
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


/*

     0000000  000000000 000   000 000      00000000
    000          000     000 000  000      000     
     0000000     000      00000   000      0000000 
          000    000       000    000      000     
     0000000     000       000    00000000 00000000
 */

StyleSwitch = (function() {
  function StyleSwitch() {}

  StyleSwitch.schemes = ['dark.css', 'bright.css'];

  StyleSwitch.filter = null;

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

  StyleSwitch.togglePathFilter = function() {
    var p, s, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (this.filter == null) {
      _ref = $$('.path');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (typeof filter === "undefined" || filter === null) {
          s = window.getComputedStyle(p);
          this.filter = p.instance.style('filter');
        }
        _results.push(p.instance.style('filter: none'));
      }
      return _results;
    } else {
      _ref1 = $$('.path');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        p = _ref1[_j];
        p.instance.style({
          filter: this.filter
        });
      }
      return this.filter = null;
    }
  };

  return StyleSwitch;

})();


/*

     0000000   0000000     0000000  0000000    00000000  00000000   0000000   000   000   000 
    000   000  000   000  000       000   000  000       000       000        000   000   000 
    000000000  0000000    000       000   000  0000000   000000    000  0000  000000000   000 
    000   000  000   000  000       000   000  000       000       000   000  000   000   000 
    000   000  0000000     0000000  0000000    00000000  000        0000000   000   000   000 
    
          000  000   000  000        00     00  000   000   0000000   00000000    0000000       
          000  000  000   000        000   000  0000  000  000   000  000   000  000   000      
          000  0000000    000        000000000  000 0 000  000   000  00000000   000 00 00      
    000   000  000  000   000        000 0 000  000  0000  000   000  000        000 0000       
     0000000   000   000  000000000  000   000  000   000   0000000   000         00000 00            

     00000000    0000000   000000000  000   000  000   000  000   000  000   000  000   000  0000000
     000   000  000           000     000   000  000   000  000 0 000   000 000    000 000      000  
     0000000     0000000      000     000   000   000 000   000000000    00000      00000      000    
     000   000        000     000     000   000     000     000   000   000 000      000      000
     000   000   0000000      000      0000000       0      00     00  000   000     000     0000000
 */

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

_.clamp = function(r1, r2, v) {
  var _ref;
  if (r1 > r2) {
    _ref = [r2, r1], r1 = _ref[0], r2 = _ref[1];
  }
  if (r1 != null) {
    v = Math.max(v, r1);
  }
  if (r2 != null) {
    v = Math.min(v, r2);
  }
  return v;
};

//# sourceMappingURL=tools.js.map
