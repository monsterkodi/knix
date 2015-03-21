
/*

0000000    00000000    0000000    0000000 
000   000  000   000  000   000  000      
000   000  0000000    000000000  000  0000
000   000  000   000  000   000  000   000
0000000    000   000  000   000   0000000
 */
var Drag, DragSize, Keys, Pos, Rect, Settings, Stage, StyleSwitch, dbg, error, info, log, pos, str, strIndent, warning,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Drag = (function() {
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
      onStart: null,
      onMove: null,
      onStop: null,
      doMove: true,
      active: true,
      cursor: 'move'
    }));
    if (typeof this.target === 'string') {
      t = document.getElementById(this.target);
      if (t == null) {
        error({
          "file": "./coffee/tools/drag.coffee",
          "class": "Drag",
          "line": 30,
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
        "line": 34,
        "args": ["cfg"],
        "method": "constructor",
        "type": "."
      }, 'cant find drag target', this.target);
      return;
    }
    if ((this.minPos != null) && (this.maxPos != null)) {
      _ref = [this.minPos.min(this.maxPos), this.minPos.max(this.maxPos)], this.minPos = _ref[0], this.maxPos = _ref[1];
    }
    this.dragging = false;
    this.listening = false;
    if (typeof this.handle === 'string') {
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
    this.startPos = this.absPos(event);
    this.pos = this.absPos(event);
    if (this.onStart != null) {
      this.onStart(this, event);
    }
    this.lastPos = this.absPos(event);
    if (this.doMove) {
      this.startPos = this.target.relPos();
      this.startPos = this.startPos.check();
    }
    document.addEventListener('mousemove', this.dragMove);
    return document.addEventListener('mouseup', this.dragUp);
  };

  Drag.prototype.dragMove = function(event) {
    var newPos;
    if (!this.dragging) {
      return;
    }
    this.pos = this.absPos(event);
    this.delta = this.lastPos.to(this.pos);
    this.deltaSum = this.startPos.to(this.pos);
    if (this.doMove) {
      newPos = this.startPos.add(this.delta).clamp(this.minPos, this.maxPos);
      this.target.getWidget().setPos(newPos);
    }
    if (this.onMove != null) {
      this.onMove(this, event);
    }
    return this.lastPos = this.pos;
  };

  Drag.prototype.constrain = function(minX, minY, maxX, maxY) {
    var cp, wp;
    wp = this.target.getWidget().relPos();
    this.minPos = pos(minX, minY);
    this.maxPos = pos(maxX, maxY);
    cp = wp.clamped(this.minPos, this.maxPos);
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
    delete this.lastPos;
    delete this.startPos;
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

0000000    00000000    0000000    0000000    0000000  000  0000000  00000000
000   000  000   000  000   000  000        000       000     000   000     
000   000  0000000    000000000  000  0000  0000000   000    000    0000000 
000   000  000   000  000   000  000   000       000  000   000     000     
0000000    000   000  000   000   0000000   0000000   000  0000000  00000000
 */

DragSize = (function() {
  function DragSize(cfg) {
    this.sizeWidget = __bind(this.sizeWidget, this);
    this.sizeMove = __bind(this.sizeMove, this);
    this.sizeStart = __bind(this.sizeStart, this);
    this.moveStop = __bind(this.moveStop, this);
    this.onLeave = __bind(this.onLeave, this);
    this.dragMove = __bind(this.dragMove, this);
    this.moveStart = __bind(this.moveStart, this);
    this.onHover = __bind(this.onHover, this);
    this.config = _.def(cfg, {
      elem: null
    });
    this.config.elem.on('mousemove', this.onHover);
    this.config.elem.on('mouseleave', this.onLeave);
  }

  DragSize.prototype.onHover = function(event, e) {
    var action, border, cursor, d1, d2, eventPos, md, w;
    if (this.sizeMoveDrag != null) {
      if (this.sizeMoveDrag.dragging) {
        return;
      }
      this.sizeMoveDrag.deactivate();
      delete this.sizeMoveDrag;
    }
    w = e != null ? typeof e.getWidget === "function" ? e.getWidget() : void 0 : void 0;
    if (w == null) {
      warn('no widget?');
      return;
    }
    eventPos = Stage.absPos(event);
    d1 = eventPos.minus(w.absPos());
    d2 = w.absPos().plus(w.sizePos()).minus(eventPos);
    md = 10;
    action = 'move';
    border = '';
    if ((w.config.resize == null) || !(w.config.resize === false)) {
      if (!(w.config.resize === 'horizontal')) {
        if (d2.y < md) {
          action = 'size';
          border = 'bottom';
        } else if (d1.y < md) {
          action = 'size';
          border = 'top';
        }
      }
      if (!(w.config.resize === 'vertical')) {
        if (d2.x < md) {
          action = 'size';
          border += 'right';
        } else if (d1.x < md) {
          action = 'size';
          border += 'left';
        }
      }
    }
    if (action === 'size' && !w.config.isShaded) {
      if (border === 'left' || border === 'right') {
        cursor = 'ew-resize';
      } else if (border === 'top' || border === 'bottom') {
        cursor = 'ns-resize';
      } else if (border === 'topleft' || border === 'bottomright') {
        cursor = 'nwse-resize';
      } else {
        cursor = 'nesw-resize';
      }
      this.sizeMoveDrag = new Drag({
        target: this.config.elem,
        onStart: this.sizeStart,
        onMove: this.sizeMove,
        doMove: false,
        cursor: cursor
      });
      this.sizeMoveDrag.border = border;
    } else {
      this.sizeMoveDrag = new Drag({
        target: this.config.elem,
        minPos: pos(void 0, 0),
        onMove: this.dragMove,
        onStart: this.moveStart,
        onStop: this.moveStop,
        doMove: this.config.doMove,
        cursor: 'grab'
      });
    }
  };

  DragSize.prototype.moveStart = function(drag, event) {
    if (this.config.moveStart != null) {
      this.config.moveStart(drag, event);
    }
    if (drag.target.widget.isWindow()) {
      StyleSwitch.togglePathFilter();
    }
    return event.stop();
  };

  DragSize.prototype.dragMove = function(drag, event) {
    if (this.config.onMove != null) {
      this.config.onMove(drag, event);
    }
    return event.stop();
  };

  DragSize.prototype.onLeave = function(event) {
    if ((this.sizeMoveDrag != null) && !this.sizeMoveDrag.dragging) {
      if (this.sizeMoveDrag) {
        this.sizeMoveDrag.deactivate();
      }
      return delete this.sizeMoveDrag;
    }
  };

  DragSize.prototype.moveStop = function(drag, event) {
    if (this.config.moveStop != null) {
      this.config.moveStop(drag, event);
    }
    if (drag.target.widget.isWindow()) {
      StyleSwitch.togglePathFilter();
    }
    return event.stop();
  };

  DragSize.prototype.sizeStart = function(drag, event) {
    if (this.config.sizeStart != null) {
      this.config.sizeStart(drag, event);
    }
    return event.stop();
  };

  DragSize.prototype.sizeMove = function(drag, event) {
    var dx, dy, spos, sw, w, wpos, _i, _len, _ref, _ref1;
    w = drag.target.widget;
    wpos = w.absPos();
    spos = Stage.absPos(event);
    if ((_ref = drag.border) === 'left' || _ref === 'topleft' || _ref === 'top') {
      dx = wpos.x - spos.x;
      dy = wpos.y - spos.y;
    } else {
      dx = spos.x - wpos.x - w.getWidth();
      dy = spos.y - wpos.y - w.getHeight();
    }
    if (this.config.elem.hasClassName('selected')) {
      _ref1 = knix.selectedWidgets();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        sw = _ref1[_i];
        this.sizeWidget(drag, sw, dx, dy);
      }
    } else {
      this.sizeWidget(drag, w, dx, dy);
    }
    if (this.config.onSize != null) {
      this.config.onSize(drag, event);
    }
    return event.stop();
  };

  DragSize.prototype.sizeWidget = function(drag, w, dx, dy) {
    var br, hgt, wdt, wpos, _ref, _ref1;
    wpos = w.absPos();
    wdt = w.getWidth() + dx;
    hgt = w.getHeight() + dy;
    if ((_ref = drag.border) === 'left' || _ref === 'topleft' || _ref === 'top') {
      br = wpos.plus(pos(w.getWidth(), w.getHeight()));
    }
    wdt = Math.min(w.maxWidth(), wdt);
    wdt = Math.max(w.minWidth(), wdt);
    hgt = Math.min(w.maxHeight(), hgt);
    hgt = Math.max(w.minHeight(), hgt);
    if (drag.border === 'left' || drag.border === 'right') {
      hgt = null;
    }
    if (drag.border === 'top' || drag.border === 'bottom') {
      wdt = null;
    }
    w.resize(wdt, hgt);
    if ((_ref1 = drag.border) === 'left' || _ref1 === 'topleft' || _ref1 === 'top') {
      if (wdt == null) {
        dx = 0;
      } else {
        dx = br.x - w.getWidth() - wpos.x;
      }
      if (hgt == null) {
        dy = 0;
      } else {
        dy = br.y - w.getHeight() - wpos.y;
      }
      return w.moveBy(dx, dy);
    }
  };

  return DragSize;

})();


/*

000   000  00000000  000   000   0000000
000  000   000        000 000   000     
0000000    0000000     00000    0000000 
000  000   000          000          000
000   000  00000000     000     0000000
 */

Keys = (function() {
  function Keys() {}

  Keys.pressed = [];

  Keys.register = {};

  Keys.shortcuts = {};

  Keys.interactive = false;

  Keys.init = function() {
    document.onkeypress = Keys.onKey;
    return document.onkeyup = Keys.onKeyUp;
  };

  Keys.onKey = function(e) {
    var key, mods, pressed, wid, _i, _len, _ref, _ref1, _ref2;
    mods = _.filter([e.shiftKey && '⇧', e.ctrlKey && '^', e.altKey && '⌥', e.metaKey && '⌘']).join('');
    key = mods + e.key;
    log({
      "file": "./coffee/tools/keys.coffee",
      "class": "Keys",
      "line": 25,
      "method": "onKey",
      "type": "@",
      "args": ["e"]
    }, "<span class='console-type'>key:</span>", key, "<span class='console-type'>@interactive:</span>", Keys.interactive);
    if (Keys.interactive) {
      if (key === 'Esc') {
        return Keys.stopInteractive();
      } else if (key === 'Backspace') {
        if (Keys.register.widget != null) {
          info({
            "file": "./coffee/tools/keys.coffee",
            "class": "Keys",
            "line": 32,
            "method": "onKey",
            "type": "@",
            "args": ["e"]
          }, 'unregister keys', (_ref = Keys.register.widget.config) != null ? _ref.keys : void 0, 'for', Keys.register.elem.id);
          Keys.unregisterWidget(Keys.register.widget);
          if ((_ref1 = Keys.register.widget.config) != null) {
            _ref1.keys = [];
          }
          return Keys.stopInteractive();
        }
      } else if (!_.isEmpty(Keys.register)) {
        info({
          "file": "./coffee/tools/keys.coffee",
          "class": "Keys",
          "line": 37,
          "method": "onKey",
          "type": "@",
          "args": ["e"]
        }, 'register key', key, 'for', Keys.register.elem.id);
        warn('register key', key, 'for', Keys.register.elem.id);
        error({
          "file": "./coffee/tools/keys.coffee",
          "class": "Keys",
          "line": 39,
          "method": "onKey",
          "type": "@",
          "args": ["e"]
        }, 'register key', key, 'for', Keys.register.elem.id);
        if (Keys.register.elem != null) {
          Keys.registerKeyForWidget(key, Keys.register.widget);
          Keys.register.elem.removeClassName('register-key');
        }
        return Keys.stopInteractive();
      }
    } else {
      if (Keys.shortcuts[key] != null) {
        pressed = false;
        _ref2 = Keys.shortcuts[key];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          wid = _ref2[_i];
          if (_.isFunction(wid)) {
            wid(key);
          } else {
            if (__indexOf.call(Keys.pressed, key) < 0) {
              e = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                view: window
              });
              wid.elem.dispatchEvent(e);
              pressed = true;
            }
          }
        }
        if (pressed) {
          return Keys.pressed.push(key);
        }
      }
    }
  };

  Keys.onKeyUp = function(e) {
    var i, key, mods, wid, _i, _len, _ref, _results;
    mods = _.filter([e.shiftKey && '⇧', e.ctrlKey && '^', e.altKey && '⌥', e.metaKey && '⌘']).join('');
    key = mods + e.key;
    i = Keys.pressed.indexOf(key);
    if (i >= 0) {
      Keys.pressed.splice(i, 1);
    }
    if (!Keys.interactive && i >= 0) {
      if (Keys.shortcuts[key] != null) {
        _ref = Keys.shortcuts[key];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          wid = _ref[_i];
          if (!_.isFunction(wid)) {
            e = new MouseEvent("mouseup", {
              bubbles: true,
              cancelable: true,
              view: window
            });
            wid.elem.dispatchEvent(e);
            e = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window
            });
            _results.push(wid.elem.dispatchEvent(e));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  };

  Keys.startInteractive = function() {
    Keys.interactive = true;
    document.addEventListener('mousemove', Keys.onMove);
    return Keys.updateAtPos(Stage.mousePos);
  };

  Keys.stopInteractive = function() {
    var _ref;
    Keys.interactive = false;
    document.removeEventListener('mousemove', Keys.onMove);
    if ((_ref = Keys.register.elem) != null) {
      _ref.removeClassName('register-key');
    }
    return Keys.register = {};
  };

  Keys.registerKeyForWidget = function(key, wid) {
    if (__indexOf.call(wid.config.keys, key) < 0) {
      wid.config.keys.push(key);
    }
    return Keys.add(key, wid);
  };

  Keys.add = function(key, funcOrWidget) {
    if (Keys.shortcuts[key] == null) {
      Keys.shortcuts[key] = [];
    }
    if (__indexOf.call(Keys.shortcuts[key], funcOrWidget) < 0) {
      return Keys.shortcuts[key].push(funcOrWidget);
    }
  };

  Keys.del = function(key, funcOrWidget) {
    var _ref;
    return (_ref = Keys.shortcuts[key]) != null ? _ref.splice(Keys.shortcuts[key].indexOf(funcOrWidget, 1)) : void 0;
  };

  Keys.registerWidget = function(w) {
    var key, _i, _len, _ref, _ref1, _results;
    if (((_ref = w.config) != null ? _ref.keys : void 0) != null) {
      _ref1 = w.config.keys;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        _results.push(Keys.add(key, w));
      }
      return _results;
    }
  };

  Keys.unregisterWidget = function(w) {
    var c, cw, key, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _results;
    if (((_ref = w.config) != null ? _ref.keys : void 0) != null) {
      _ref1 = w.config.keys;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        key = _ref1[_i];
        Keys.del(key, w);
      }
    }
    if (((_ref2 = w.config) != null ? _ref2.children : void 0) != null) {
      _ref3 = w.config.children;
      _results = [];
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        c = _ref3[_j];
        cw = (_ref4 = $(c.id)) != null ? _ref4.getWidget() : void 0;
        if (cw != null) {
          _results.push(Keys.unregisterWidget(cw));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  Keys.onMove = function(event) {
    return Keys.updateAtPos(Stage.absPos(event));
  };

  Keys.updateAtPos = function(p) {
    var e, wid;
    e = Stage.elementAtPos(p);
    if (e != null) {
      wid = e.getWidget().upWidgetWithConfigValue('keys');
      if (wid != null) {
        e = wid.elem;
        if (e !== Keys.register.elem) {
          if (Keys.register.elem != null) {
            Keys.register.elem.removeClassName('register-key');
          }
          e.addClassName('register-key');
          Keys.register = {
            elem: e,
            widget: wid
          };
        }
        return;
      }
    }
    if (Keys.register.elem != null) {
      Keys.register.elem.removeClassName('register-key');
      return delete Keys.register.elem;
    }
  };

  return Keys;

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

dbg = function() {
  return Console.logInfo.apply(Console, Array.prototype.slice.call(arguments, 0));
};

info = function() {
  tag('info');
  return Console.logInfo.apply(Console, Array.prototype.slice.call(arguments, 0));
};

warning = function() {
  tag('warning');
  return Console.logInfo.apply(Console, Array.prototype.slice.call(arguments, 0));
};

error = function() {
  tag('error');
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
    this.clamp = __bind(this.clamp, this);
    this.sub = __bind(this.sub, this);
    this.add = __bind(this.add, this);
    this.mul = __bind(this.mul, this);
    this.scale = __bind(this.scale, this);
    this._str = __bind(this._str, this);
    this.check = __bind(this.check, this);
    this.notSame = __bind(this.notSame, this);
    this.same = __bind(this.same, this);
    this.dist = __bind(this.dist, this);
    this.distSquare = __bind(this.distSquare, this);
    this.square = __bind(this.square, this);
    this.length = __bind(this.length, this);
    this.max = __bind(this.max, this);
    this.min = __bind(this.min, this);
    this.mid = __bind(this.mid, this);
    this.to = __bind(this.to, this);
    this.clamped = __bind(this.clamped, this);
    this.times = __bind(this.times, this);
    this.minus = __bind(this.minus, this);
    this.plus = __bind(this.plus, this);
    this.copy = __bind(this.copy, this);
  }

  Pos.prototype.copy = function() {
    return new Pos(this.x, this.y);
  };

  Pos.prototype.plus = function(val) {
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

  Pos.prototype.minus = function(val) {
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

  Pos.prototype.times = function(val) {
    return this.copy().scale(val);
  };

  Pos.prototype.clamped = function(lower, upper) {
    return this.copy().clamp(lower, upper);
  };

  Pos.prototype.to = function(other) {
    return other.minus(this);
  };

  Pos.prototype.mid = function(other) {
    return this.plus(other).scale(0.5);
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

  Pos.prototype.length = function() {
    return Math.sqrt(this.square());
  };

  Pos.prototype.square = function() {
    return (this.x * this.x) + (this.y * this.y);
  };

  Pos.prototype.distSquare = function(o) {
    return this.minus(o).square();
  };

  Pos.prototype.dist = function(o) {
    return Math.sqrt(this.distSquare(o));
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
    var s;
    s = (this.x != null ? "&lt;x:%2.2f ".fmt(this.x) : void 0) || "&lt;NaN ";
    return s += (this.y != null ? "y:%2.2f&gt;".fmt(this.y) : void 0) || "NaN&gt;";
  };

  Pos.prototype.scale = function(val) {
    this.x *= val;
    this.y *= val;
    return this;
  };

  Pos.prototype.mul = function(other) {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  };

  Pos.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  };

  Pos.prototype.sub = function(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  };

  Pos.prototype.clamp = function(lower, upper) {
    if ((lower != null) && (upper != null)) {
      this.x = _.clamp(lower.x, upper.x, this.x);
      this.y = _.clamp(lower.y, upper.y, this.y);
    }
    return this;
  };

  return Pos;

})();

pos = function(x, y) {
  return new Pos(x, y);
};


/*

00000000   00000000   0000000  000000000
000   000  000       000          000   
0000000    0000000   000          000   
000   000  000       000          000   
000   000  00000000   0000000     000
 */

Rect = (function() {
  function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.contains = __bind(this.contains, this);
  }

  Rect.prototype.contains = function(r) {
    var h, w;
    w = r.width || 0;
    h = r.hight || 0;
    return this.x <= r.x && this.y <= r.y && r.x + w <= this.x + this.width && r.y + h <= this.y + this.height;
  };

  return Rect;

})();


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

  Stage.mousePos = pos(0, 0);

  Stage.init = function() {
    var stage;
    stage = $('stage_content');
    stage.addEventListener('contextmenu', Menu.showContextMenu);
    stage.addEventListener('mousemove', Stage.onMove);
    return stage.addEventListener('mousedown', function() {
      return Selectangle.start();
    });
  };

  Stage.onMove = function(event) {
    return Stage.mousePos = Stage.absPos(event);
  };

  Stage.positionWindow = function(win) {
    var h, p, w, x, y, _ref, _ref1;
    _ref = [win.absPos(), win.getWidth(), win.getHeight()], p = _ref[0], w = _ref[1], h = _ref[2];
    _ref1 = [p.x, p.y], x = _ref1[0], y = _ref1[1];
    x = Math.min(x, Stage.width() - w);
    y = Math.max(y, $('menu').getHeight() + 6);
    return win.setPos(pos(x, y));
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

  Stage.windowAtPos = function(p) {
    var e;
    e = Stage.elementAtPos(p);
    return e != null ? typeof e.getWidget === "function" ? e.getWidget().getWindow() : void 0 : void 0;
  };

  Stage.elementAtPos = function(p) {
    var e;
    e = document.elementFromPoint(p.x, p.y);
    return e || $('stage_content');
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
  if (o == null) {
    if (o === null) {
      return "<null>";
    }
    if (o === void 0) {
      return "<undefined>";
    }
    return "<0>";
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
    _ref = ['analyser', 'analyser_trace', 'analyser_trigger', 'synth_canvas', 'synth_trace'];
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
      return delete StyleSwitch.filter;
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

_.def = function(c, d) {
  if (c != null) {
    return _.defaults(_.clone(c), d);
  } else if (d != null) {
    return _.clone(d);
  } else {
    return {};
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

_.round = function(value, stepSize) {
  if (stepSize == null) {
    stepSize = 1;
  }
  return Math.round(value / stepSize) * stepSize;
};

_.floor = function(value, stepSize) {
  if (stepSize == null) {
    stepSize = 1;
  }
  return Math.floor(value / stepSize) * stepSize;
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

_.del = function(l, e) {
  return _.remove(l, function(n) {
    return n === e;
  });
};

//# sourceMappingURL=tools.js.map
