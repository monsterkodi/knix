
/*

000   000  000  000   000  0000000     0000000   000   000
000 0 000  000  0000  000  000   000  000   000  000 0 000
000000000  000  000 0 000  000   000  000   000  000000000
000   000  000  000  0000  000   000  000   000  000   000
00     00  000  000   000  0000000     0000000   00     00
 */
var Window,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Window = (function(_super) {
  __extends(Window, _super);

  function Window(cfg, defs) {
    this.close = __bind(this.close, this);
    this.del = __bind(this.del, this);
    this.shade = __bind(this.shade, this);
    this.contentHeight = __bind(this.contentHeight, this);
    this.contentWidth = __bind(this.contentWidth, this);
    this.scrollToTop = __bind(this.scrollToTop, this);
    this.scrollToBottom = __bind(this.scrollToBottom, this);
    this.popup = __bind(this.popup, this);
    this.raise = __bind(this.raise, this);
    this.isWindow = __bind(this.isWindow, this);
    this.layoutChildren = __bind(this.layoutChildren, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.stretchWidth = __bind(this.stretchWidth, this);
    this.maximize = __bind(this.maximize, this);
    this.sizeMove = __bind(this.sizeMove, this);
    this.sizeStart = __bind(this.sizeStart, this);
    this.onLeave = __bind(this.onLeave, this);
    this.dragMove = __bind(this.dragMove, this);
    this.onHover = __bind(this.onHover, this);
    this.addMovement = __bind(this.addMovement, this);
    this.headerSize = __bind(this.headerSize, this);
    this.addShadeButton = __bind(this.addShadeButton, this);
    this.addCloseButton = __bind(this.addCloseButton, this);
    this.onTitleSelect = __bind(this.onTitleSelect, this);
    this.addTitleBar = __bind(this.addTitleBar, this);
    this.initWindow = __bind(this.initWindow, this);
    this.init = __bind(this.init, this);
    Window.__super__.constructor.call(this, cfg, defs);
  }

  Window.prototype.init = function(cfg, defs) {
    var children, connect;
    cfg = _.def(cfg, defs);
    children = cfg.children;
    if (cfg.child) {
      if (children == null) {
        children = [];
      }
      children.push(cfg.child);
    }
    delete cfg.children;
    delete cfg.child;
    connect = cfg.connect;
    delete cfg.connect;
    Window.__super__.init.call(this, cfg, {
      type: 'window',
      "class": 'window',
      parent: 'stage_content',
      hasClose: true,
      hasShade: true,
      resize: true,
      isShaded: false,
      onDown: this.raise
    });
    this.initWindow();
    this.config.children = children;
    this.insertChildren();
    this.config.connect = connect;
    this.initConnections();
    this.layoutChildren();
    if (this.config.popup) {
      knix.addPopup(this);
    }
    if (this.config.center) {
      this.moveTo(Math.max(0, Stage.size().width / 2 - this.getWidth() / 2), Math.max(0, Stage.size().height / 2 - this.getHeight() / 2));
      this.config.center = void 0;
    }
    return this;
  };


  /*
  000  000   000  000  000000000  000   000  000  000   000  0000000     0000000   000   000
  000  0000  000  000     000     000 0 000  000  0000  000  000   000  000   000  000 0 000
  000  000 0 000  000     000     000000000  000  000 0 000  000   000  000   000  000000000
  000  000  0000  000     000     000   000  000  000  0000  000   000  000   000  000   000
  000  000   000  000     000     00     00  000  000   000  0000000     0000000   00     00
   */

  Window.prototype.initWindow = function() {
    var b, button, content, _i, _len, _ref;
    if (this.config.hasClose) {
      this.addCloseButton();
    }
    if (this.config.hasShade) {
      this.addShadeButton();
    }
    if (this.config.buttons != null) {
      _ref = this.config.buttons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        button = this.insertChild(b, {
          noMove: true,
          type: 'button',
          align: 'left'
        });
        button.elem.addClassName('tool-button');
        button.elem.addClassName('window-button-' + button.config.align);
      }
    }
    if (this.config.hasTitle || this.config.title) {
      this.addTitleBar();
    }
    content = knix.create({
      elem: 'div',
      type: 'content',
      parent: this.elem.id
    });
    this.content = content;
    if (this.config.content === 'scroll') {
      content.elem.setStyle({
        overflow: 'scroll',
        width: '100%',
        height: '100%',
        height: "%dpx".fmt(this.contentHeight())
      });
    }
    this.elem.on('size', this.sizeWindow);
    return this;
  };


  /*
  000   000  00000000   0000000   0000000    00000000  00000000 
  000   000  000       000   000  000   000  000       000   000
  000000000  0000000   000000000  000   000  0000000   0000000  
  000   000  000       000   000  000   000  000       000   000
  000   000  00000000  000   000  0000000    00000000  000   000
   */

  Window.prototype.addTitleBar = function() {
    var t;
    t = knix.create({
      type: 'title',
      text: this.config.title,
      parent: this
    });
    t.elem.ondblclick = this.maximize;
    return t.elem.onmousedown = this.onTitleSelect;
  };

  Window.prototype.onTitleSelect = function(event) {
    if (event.shiftKey) {
      if (this.elem.hasClassName('selected')) {
        this.elem.removeClassName('selected');
        return;
      }
      return this.elem.addClassName('selected');
    }
  };

  Window.prototype.addCloseButton = function() {
    return knix.create({
      type: 'button',
      "class": 'close tool-button',
      noMove: true,
      parent: this,
      child: {
        type: 'icon',
        icon: 'octicon-x'
      },
      action: this.close
    });
  };

  Window.prototype.addShadeButton = function() {
    return knix.create({
      type: 'button',
      "class": 'shade tool-button',
      noMove: true,
      parent: this,
      child: {
        type: 'icon',
        icon: 'octicon-dash'
      },
      action: this.shade
    });
  };

  Window.prototype.headerSize = function(box) {
    var children, height, i;
    if (box == null) {
      box = "border-box-height";
    }
    children = Selector.findChildElements(this.elem, ['*.title', '*.close', '*.shade']);
    i = 0;
    while (i < children.length) {
      height = children[i].getLayout().get(box);
      if (height) {
        return height;
      }
      i++;
    }
    return 0;
  };


  /*
   0000000  000  0000000  00000000
  000       000     000   000     
  0000000   000    000    0000000 
       000  000   000     000     
  0000000   000  0000000  00000000
   */

  Window.prototype.addMovement = function() {
    if (this.config.resize || !this.config.noMove) {
      this.elem.on('mousemove', this.onHover);
      return this.elem.on('mouseleave', this.onLeave);
    } else {
      return Window.__super__.addMovement.apply(this, arguments);
    }
  };

  Window.prototype.onHover = function(event, e) {
    var action, border, cursor, d1, d2, eventPos, m, md;
    if (this.sizeMoveDrag != null) {
      if (this.sizeMoveDrag.dragging) {
        return;
      }
      this.sizeMoveDrag.deactivate();
      delete this.sizeMoveDrag;
    }
    if ((e != null ? typeof e.getWidget === "function" ? e.getWidget() : void 0 : void 0) != null) {
      m = this.matchConfigValue('noMove', true, e.getWidget().upWidgets());
      this.elem.style.cursor = 'default';
      if (m.length) {
        return;
      }
    }
    eventPos = Stage.absPos(event);
    d1 = eventPos.minus(this.absPos());
    d2 = this.absPos().plus(this.sizePos()).minus(eventPos);
    md = 10;
    action = 'move';
    border = '';
    if ((this.config.resize == null) || !(this.config.resize === false)) {
      if (d1.y < md) {
        if (!(this.config.resize === 'horizontal')) {
          action = 'size';
        }
        border = 'top';
      } else if (d2.y < md) {
        if (!(this.config.resize === 'horizontal')) {
          action = 'size';
        }
        border = 'bottom';
      }
      if (d1.x < md) {
        if (!(this.config.resize === 'vertical')) {
          action = 'size';
        }
        border += 'left';
      }
      if (d2.x < md) {
        if (!(this.config.resize === 'vertical')) {
          action = 'size';
        }
        border += 'right';
      }
    }
    if (action === 'size' && !this.config.isShaded) {
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
        target: this.elem,
        onStart: this.sizeStart,
        onMove: this.sizeMove,
        doMove: false,
        cursor: cursor
      });
      this.sizeMoveDrag.border = border;
    } else {
      this.sizeMoveDrag = new Drag({
        target: this.elem,
        minPos: pos(void 0, 0),
        onMove: this.dragMove,
        onStart: StyleSwitch.togglePathFilter,
        onStop: StyleSwitch.togglePathFilter,
        cursor: 'grab'
      });
    }
  };

  Window.prototype.dragMove = function(drag) {
    var w, _i, _len, _ref, _results;
    this.emitMove();
    if (this.elem.hasClassName('selected')) {
      _ref = knix.selectedWindows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        w = _ref[_i];
        if (w !== this) {
          _results.push(w.move(drag.delta));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  Window.prototype.onLeave = function(event) {
    if ((this.sizeMoveDrag != null) && !this.sizeMoveDrag.dragging) {
      if (this.sizeMoveDrag) {
        this.sizeMoveDrag.deactivate();
      }
      return delete this.sizeMoveDrag;
    }
  };

  Window.prototype.sizeStart = function(drag, event) {
    return this.config.isMaximized = false;
  };

  Window.prototype.sizeMove = function(drag, event) {
    var br, dx, dy, hdr, hgt, spos, wdt, wpos, _ref, _ref1;
    wpos = this.absPos();
    spos = Stage.absPos(event);
    hdr = this.headerSize();
    if ((_ref = drag.border) === 'left' || _ref === 'topleft' || _ref === 'top') {
      wdt = wpos.x - spos.x + this.getWidth();
      hgt = wpos.y - spos.y + this.getHeight();
      br = wpos.plus(pos(this.getWidth(), this.getHeight()));
    } else {
      wdt = spos.x - wpos.x;
      hgt = spos.y - wpos.y;
    }
    wdt = Math.max(hdr * 2, wdt);
    wdt = Math.min(this.maxWidth(), wdt);
    wdt = Math.max(this.minWidth(), wdt);
    hgt = Math.max(hdr, hgt);
    hgt = Math.min(this.maxHeight(), hgt);
    hgt = Math.max(this.minHeight(), hgt);
    if (drag.border === 'left' || drag.border === 'right') {
      hgt = null;
    }
    if (drag.border === 'top' || drag.border === 'bottom') {
      wdt = null;
    }
    this.resize(wdt, hgt);
    if ((_ref1 = drag.border) === 'left' || _ref1 === 'topleft' || _ref1 === 'top') {
      if (wdt == null) {
        dx = 0;
      } else {
        dx = br.x - this.getWidth() - wpos.x;
      }
      if (hgt == null) {
        dy = 0;
      } else {
        dy = br.y - this.getHeight() - wpos.y;
      }
      return this.moveBy(dx, dy);
    }
  };

  Window.prototype.maximize = function() {
    var menuHeight;
    log({
      "file": "./coffee/window.coffee",
      "class": "Window",
      "line": 281,
      "args": ["drag", "event"],
      "method": "maximize",
      "type": "."
    }, this.config.isMaximized);
    if (this.config.isMaximized) {
      this.setPos(this.config.pos);
      this.setSize(this.config.size);
      return this.config.isMaximized = false;
    } else {
      this.config.pos = this.absPos();
      this.config.size = this.getSize();
      menuHeight = $('menu').getHeight();
      this.moveTo(0, menuHeight + 2);
      this.resize(Stage.size().width, Stage.size().height - menuHeight - 2);
      return this.config.isMaximized = true;
    }
  };


  /*
  000       0000000   000   000   0000000   000   000  000000000
  000      000   000   000 000   000   000  000   000     000   
  000      000000000    00000    000   000  000   000     000   
  000      000   000     000     000   000  000   000     000   
  0000000  000   000     000      0000000    0000000      000
   */

  Window.prototype.stretchWidth = function() {
    return this;
  };

  Window.prototype.sizeWindow = function() {
    var w, _i, _len, _ref, _results;
    if (this.config.content === 'scroll') {
      this.content.setWidth(this.contentWidth());
      this.content.setHeight(this.contentHeight());
    }
    _ref = this.allChildren();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      w = _ref[_i];
      _results.push(typeof w.onWindowSize === "function" ? w.onWindowSize() : void 0);
    }
    return _results;
  };

  Window.prototype.layoutChildren = function() {
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


  /*
  00     00  000   0000000   0000000
  000   000  000  000       000     
  000000000  000  0000000   000     
  000 0 000  000       000  000     
  000   000  000  0000000    0000000
   */

  Window.prototype.isWindow = function() {
    return true;
  };

  Window.prototype.raise = function(event) {
    var scrolltop;
    scrolltop = this.content.elem.scrollTop;
    this.elem.parentElement.appendChild(this.elem);
    this.content.elem.scrollTop = scrolltop;
    return event != null ? event.stopPropagation() : void 0;
  };

  Window.prototype.popup = function(event) {
    log({
      "file": "./coffee/window.coffee",
      "class": "Window",
      "line": 347,
      "args": ["event"],
      "method": "popup",
      "type": "."
    }, 'popup', Stage.absPos(event));
    if (this.elem != null) {
      this.elem.show();
      this.setPos(Stage.absPos(event));
      return this.elem.raise();
    } else {
      return warn({
        "file": "./coffee/window.coffee",
        "class": "Window",
        "line": 353,
        "args": ["event"],
        "method": "popup",
        "type": "."
      }, 'no elem!');
    }
  };

  Window.prototype.scrollToBottom = function() {
    return this.content.elem.scrollTop = this.content.elem.scrollHeight;
  };

  Window.prototype.scrollToTop = function() {
    return this.content.elem.scrollTop = 0;
  };

  Window.prototype.contentWidth = function() {
    return this.elem.getLayout().get('padding-box-width');
  };

  Window.prototype.contentHeight = function() {
    return this.elem.getLayout().get('padding-box-height') - this.headerSize();
  };

  Window.prototype.shade = function() {
    if (this.config.isShaded) {
      this.config.isShaded = false;
      this.content.show();
      this.setHeightNoEmit(this.config.height);
      this.elem.setStyle({
        'min-height': this.minHeightShade
      });
    } else {
      this.config.height = this.getHeight();
      this.minHeightShade = this.elem.getStyle('min-height');
      this.elem.setStyle({
        'min-height': '0px'
      });
      this.setHeightNoEmit(this.headerSize());
      this.config.isShaded = true;
      this.content.hide();
    }
    this.emit('shade', {
      shaded: this.config.isShaded
    });
  };

  Window.prototype.del = function() {
    return this.close();
  };

  Window.prototype.close = function() {
    if (this.config.popup != null) {
      knix.delPopup(this);
    }
    return Window.__super__.close.apply(this, arguments);
  };

  Window.menuButton = function(cfg) {
    return Menu.addButton(_.def(cfg, {
      menu: 'audio'
    }));
  };

  return Window;

})(Widget);

//# sourceMappingURL=window.js.map
