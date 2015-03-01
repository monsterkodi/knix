
/*

0000000    00000000    0000000    0000000 
000   000  000   000  000   000  000      
000   000  0000000    000000000  000  0000
000   000  000   000  000   000  000   000
0000000    000   000  000   000   0000000
 */
var Drag, Pos, Settings, Stage, StyleSwitch, error, log, pos, str, strIndent, warn,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Drag = (function() {
  Drag.create = function(cfg) {
    return new Drag(cfg);
  };

  function Drag(cfg) {
    this.deactivate = __bind(this.deactivate, this);
    this.activate = __bind(this.activate, this);
    this.dragStop = __bind(this.dragStop, this);
    this.dragUp = __bind(this.dragUp, this);
    this.constrain = __bind(this.constrain, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.relPos = __bind(this.relPos, this);
    this.absPos = __bind(this.absPos, this);
    var t, _ref;
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
      t = document.getElementById(this.target);
      if (t == null) {
        error({
          "file": "./coffee/tools/drag.coffee",
          "class": "Drag",
          "line": 32,
          "args": ["cfg"],
          "method": "constructor",
          "type": "."
        }, 'cant find drag target with id', this.target);
        return;
      }
      this.target = t;
    }
    if (this.target == null) {
      error({
        "file": "./coffee/tools/drag.coffee",
        "class": "Drag",
        "line": 36,
        "args": ["cfg"],
        "method": "constructor",
        "type": "."
      }, 'cant find drag target', this.target);
      return;
    }
    if ((this.minPos != null) && (this.maxPos != null)) {
      _ref = [this.minPos.min(this.maxPos), this.minPos.max(this.maxPos)], this.minPos = _ref[0], this.maxPos = _ref[1];
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
      this.activate();
    }
    return;
  }

  Drag.prototype.absPos = function(event) {
    return Stage.absPos(event);
  };

  Drag.prototype.relPos = function(event) {
    return Stage.relPos(event);
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
    document.addEventListener('mousemove', this.dragMove);
    return document.addEventListener('mouseup', this.dragUp);
  };

  Drag.prototype.dragMove = function(event) {
    var newPos;
    if (!this.dragging) {
      return;
    }
    if (this.doMove) {
      newPos = this.absPos(event);
      newPos = this.targetStartPos.add(newPos.sub(this.cursorStartPos));
      newPos = newPos.clamp(this.minPos, this.maxPos);
      this.target.getWidget().setPos(newPos);
    }
    if (this.onMove != null) {
      return this.onMove(this, event);
    }
  };

  Drag.prototype.constrain = function(minX, minY, maxX, maxY) {
    var cp, wp;
    wp = this.target.getWidget().relPos();
    this.minPos = pos(minX, minY);
    this.maxPos = pos(maxX, maxY);
    cp = wp.clamp(this.minPos, this.maxPos);
    if (wp.notSame(cp)) {
      if (this.doMove) {
        return this.target.getWidget().setPos(cp);
      }
    }
  };

  Drag.prototype.dragUp = function(event) {
    return this.dragStop(event);
  };

  Drag.prototype.dragStop = function(event) {
    if (!this.dragging) {
      return;
    }
    document.removeEventListener('mousemove', this.dragMove);
    document.removeEventListener('mouseup', this.dragUp);
    this.cursorStartPos = null;
    this.targetStartPos = null;
    if ((this.onStop != null) && (event != null)) {
      this.onStop(this, event);
    }
    this.dragging = false;
  };

  Drag.prototype.activate = function() {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.handle.addEventListener('mousedown', this.dragStart);
  };

  Drag.prototype.deactivate = function() {
    if (!this.listening) {
      return;
    }
    this.handle.removeEventListener('mousedown', this.dragStart);
    this.listening = false;
    if (this.dragging) {
      this.dragStop();
    }
  };

  return Drag;

})();


/*

000       0000000    0000000 
000      000   000  000      
000      000   000  000  0000
000      000   000  000   000
0000000   0000000    0000000
 */

log = function() {
  return Console.logInfo.apply(Console, Array.prototype.slice.call(arguments, 0));
};

error = function() {
  tag('error');
  return Console.logInfo.apply(Console, Array.prototype.slice.call(arguments, 0));
};

warn = function() {
  tag('warning');
  return Console.logInfo.apply(Console, Array.prototype.slice.call(arguments, 0));
};


/*

00000000    0000000    0000000
000   000  000   000  000     
00000000   000   000  0000000 
000        000   000       000
000         0000000   0000000
 */

Pos = (function() {
  function Pos(x, y) {
    this.x = x;
    this.y = y;
    this._str = __bind(this._str, this);
    this.check = __bind(this.check, this);
    this.notSame = __bind(this.notSame, this);
    this.same = __bind(this.same, this);
    this.length = __bind(this.length, this);
    this.dist = __bind(this.dist, this);
    this.distSquare = __bind(this.distSquare, this);
    this.square = __bind(this.square, this);
    this.clamp = __bind(this.clamp, this);
    this.max = __bind(this.max, this);
    this.min = __bind(this.min, this);
    this.mid = __bind(this.mid, this);
    this.mul = __bind(this.mul, this);
    this.times = __bind(this.times, this);
    this.scale = __bind(this.scale, this);
    this.to = __bind(this.to, this);
    this.sub = __bind(this.sub, this);
    this.add = __bind(this.add, this);
    this.copy = __bind(this.copy, this);
  }

  Pos.prototype.copy = function() {
    return new Pos(this.x, this.y);
  };

  Pos.prototype.add = function(val) {
    var newPos;
    newPos = this.copy();
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
    newPos = this.copy();
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

  Pos.prototype.to = function(other) {
    return other.sub(this);
  };

  Pos.prototype.scale = function(val) {
    this.x *= val;
    this.y *= val;
    return this;
  };

  Pos.prototype.times = function(val) {
    return this.copy().scale(val);
  };

  Pos.prototype.mul = function(other) {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  };

  Pos.prototype.mid = function(other) {
    return this.add(other).scale(0.5);
  };

  Pos.prototype.min = function(val) {
    var newPos;
    newPos = this.copy();
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
    newPos = this.copy();
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
    var newPos;
    newPos = this.copy();
    if ((lower != null) && (upper != null)) {
      newPos.x = _.clamp(lower.x, upper.x, this.x);
      newPos.y = _.clamp(lower.y, upper.y, this.y);
    }
    return newPos;
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

  Pos.prototype.length = function() {
    return Math.sqrt(this.square());
  };

  Pos.prototype.same = function(o) {
    return this.x === (o != null ? o.x : void 0) && this.y === (o != null ? o.y : void 0);
  };

  Pos.prototype.notSame = function(o) {
    return this.x !== (o != null ? o.x : void 0) || this.y !== (o != null ? o.y : void 0);
  };

  Pos.prototype.check = function() {
    var newPos;
    newPos = this.copy();
    if (isNaN(newPos.x)) {
      newPos.x = 0;
    }
    if (isNaN(newPos.y)) {
      newPos.y = 0;
    }
    return newPos;
  };

  Pos.prototype._str = function() {
    return "<x:%2.2f y:%2.2f>".fmt(this.x, this.y);
  };

  return Pos;

})();

pos = function(x, y) {
  return new Pos(x, y);
};


/*

 0000000  00000000  000000000  000000000  000  000   000   0000000    0000000
000       000          000        000     000  0000  000  000        000     
0000000   0000000      000        000     000  000 0 000  000  0000  0000000 
     000  000          000        000     000  000  0000  000   000       000
0000000   00000000     000        000     000  000   000   0000000   0000000
 */

Settings = (function() {
  function Settings() {}

  Settings.set = function(key, value) {
    var settings;
    settings = {};
    if (localStorage.getItem('settings') != null) {
      settings = JSON.parse(localStorage.getItem('settings'));
    }
    settings[key] = value;
    localStorage.setItem('settings', JSON.stringify(settings));
    return Settings;
  };

  Settings.get = function(key, def) {
    var s, settings;
    s = localStorage.getItem('settings');
    settings = JSON.parse(s);
    if ((settings != null ? settings[key] : void 0) != null) {
      return settings[key];
    }
    return def;
  };

  Settings.clear = function() {
    return localStorage.setItem('settings', "{}");
  };

  return Settings;

})();


/*

 0000000  000000000   0000000    0000000   00000000
000          000     000   000  000        000     
0000000      000     000000000  000  0000  0000000 
     000     000     000   000  000   000  000     
0000000      000     000   000   0000000   00000000
 */

Stage = (function() {
  function Stage() {}

  Stage.initContextMenu = function() {
    log({
      "file": "./coffee/tools/stage.coffee",
      "class": "Stage",
      "line": 15,
      "method": "initContextMenu",
      "type": "@"
    }, 'initContextMenu');
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

  Stage.positionWindow = function(win) {
    var h, p, w, _ref;
    _ref = [win.absPos(), win.getWidth(), win.getHeight()], p = _ref[0], w = _ref[1], h = _ref[2];
    if (p.x + w > Stage.width()) {
      return win.setPos(pos(Stage.width() - w, Math.max(p.y, $('menu').getHeight())));
    }
  };

  Stage.showContextMenu = function(event, e) {
    if ($('stage_content') === e) {
      log({
        "file": "./coffee/tools/stage.coffee",
        "class": "Stage",
        "line": 37,
        "method": "showContextMenu",
        "type": "@",
        "args": ["event", "e"]
      }, 'showContextMenu');
      return Stage.contextMenu.elem.show();
    }
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

  Stage.relPos = function(event) {
    var c, t;
    event = event != null ? event : window.event;
    c = pos(event.clientX, event.clientY);
    t = event.target.getWidget().absPos();
    return c.sub(t);
  };

  return Stage;

})();


/*

 0000000  000000000  00000000 
000          000     000   000
0000000      000     0000000  
     000     000     000   000
0000000      000     000   000
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
      if (o._str != null) {
        return o._str();
      } else {
        s = "<" + protoname + ">\n";
        visited.push(o);
        s += ((function() {
          var _i, _len, _ref, _results;
          _ref = Object.getOwnPropertyNames(o);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            k = _ref[_i];
            if (!_.isFunction(o[k])) {
              _results.push(indent + strIndent + k + ": " + str(o[k], indent + strIndent, visited));
            }
          }
          return _results;
        })()).join("\n");
      }
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

 0000000  000000000  000   000  000      00000000   0000000  000   000  000  000000000   0000000  000   000
000          000      000 000   000      000       000       000 0 000  000     000     000       000   000
0000000      000       00000    000      0000000   0000000   000000000  000     000     000       000000000
     000     000        000     000      000            000  000   000  000     000     000       000   000
0000000      000        000     0000000  00000000  0000000   00     00  000     000      0000000  000   000
 */

StyleSwitch = (function() {
  function StyleSwitch() {}

  StyleSwitch.schemes = ['dark.css', 'bright.css'];

  StyleSwitch.filter = null;

  StyleSwitch.colors = {};

  StyleSwitch.init = function() {
    StyleSwitch.toggle();
    return StyleSwitch.toggle();
  };

  StyleSwitch.toggle = function() {
    var currentScheme, link, newlink, nextSchemeIndex;
    link = document.getElementById('style-link');
    currentScheme = link.href.split('/').last();
    nextSchemeIndex = (StyleSwitch.schemes.indexOf(currentScheme) + 1) % StyleSwitch.schemes.length;
    newlink = document.createElement("link");
    newlink.setAttribute('rel', 'stylesheet');
    newlink.setAttribute('type', 'text/css');
    newlink.setAttribute('href', 'style/' + StyleSwitch.schemes[nextSchemeIndex]);
    newlink.setAttribute('id', 'style-link');
    link.parentNode.replaceChild(newlink, link);
    return StyleSwitch.initColors();
  };

  StyleSwitch.initColors = function() {
    var cn, colors, _i, _len, _ref, _results;
    colors = document.createElement("div");
    _ref = ['analyser', 'analyser_trace', 'analyser_trigger'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cn = _ref[_i];
      colors.setAttribute('class', cn);
      _results.push(StyleSwitch.colors[cn] = window.getComputedStyle(colors).color);
    }
    return _results;
  };

  StyleSwitch.togglePathFilter = function() {
    var p, s, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (StyleSwitch.filter == null) {
      _ref = $$('.path');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        s = window.getComputedStyle(p);
        StyleSwitch.filter = p.instance.style('filter');
        _results.push(p.instance.style('filter: none'));
      }
      return _results;
    } else {
      _ref1 = $$('.path');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        p = _ref1[_j];
        p.instance.style({
          filter: StyleSwitch.filter
        });
      }
      return StyleSwitch.filter = null;
    }
  };

  return StyleSwitch;

})();


/*

000000000   0000000    0000000   000       0000000
   000     000   000  000   000  000      000     
   000     000   000  000   000  000      0000000 
   000     000   000  000   000  000           000
   000      0000000    0000000   0000000  0000000
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
  },
  getWidget: function(element) {
    var _ref;
    if ((element != null ? element.widget : void 0) != null) {
      return element.widget;
    }
    return element != null ? (_ref = element.parentElement) != null ? _ref.getWidget() : void 0 : void 0;
  }
});

SVGAnimatedLength.prototype._str = function() {
  return "<%0.2f>".fmt(this.baseVal.value);
};

_.del = function(l, e) {
  return _.remove(l, function(n) {
    return n === e;
  });
};

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

_.arg = function(arg, argname) {
  if (argname == null) {
    argname = '';
  }
  if (arg == null) {
    arg = _.arg.caller["arguments"][0];
  }
  if (typeof arg === 'object') {
    if (arg.detail != null) {
      if (arg.detail[argname] != null) {
        return arg.detail[argname];
      }
      return arg.detail;
    }
  }
  if (argname === 'value') {
    if (typeof arg === 'string') {
      return parseFloat(arg);
    }
  }
  return arg;
};

_.value = function(arg) {
  return _.arg(arg, 'value');
};

_.win = function() {
  return _.win.caller["arguments"][0].target.getWidget().getWindow();
};

_.wid = function() {
  return _.wid.caller["arguments"][0].target.getWidget();
};

//# sourceMappingURL=tools.js.map
