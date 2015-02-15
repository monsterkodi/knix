
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
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Window = (function(_super) {
  __extends(Window, _super);

  function Window(config, defaults) {
    if (config == null) {
      config = {};
    }
    this.close = __bind(this.close, this);
    this.shade = __bind(this.shade, this);
    this.contentHeight = __bind(this.contentHeight, this);
    this.contentWidth = __bind(this.contentWidth, this);
    this.headerSize = __bind(this.headerSize, this);
    this.raise = __bind(this.raise, this);
    this.maximize = __bind(this.maximize, this);
    this.sizeStop = __bind(this.sizeStop, this);
    this.sizeMove = __bind(this.sizeMove, this);
    this.sizeStart = __bind(this.sizeStart, this);
    this.addSizeButton = __bind(this.addSizeButton, this);
    this.stretchWidth = __bind(this.stretchWidth, this);
    this.scrollToBottom = __bind(this.scrollToBottom, this);
    this.addShadeButton = __bind(this.addShadeButton, this);
    this.addCloseButton = __bind(this.addCloseButton, this);
    this.addTitleBar = __bind(this.addTitleBar, this);
    this.initWindow = __bind(this.initWindow, this);
    this.init = __bind(this.init, this);
    Window.__super__.constructor.call(this, config, defaults);
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
    cfg.children = null;
    cfg.child = null;
    connect = cfg.connect;
    cfg.connect = null;
    Window.__super__.init.call(this, cfg, {
      type: 'window',
      parent: 'stage_content',
      hasClose: true,
      hasShade: true,
      resize: true,
      isMovable: true,
      isShaded: false,
      onDown: this.raise
    });
    this.initWindow();
    this.config.children = children;
    this.insertChildren();
    this.config.connect = connect;
    this.initConnections();
    this.layoutChildren();
    if (cfg.popup) {
      knix.addPopup(this);
    }
    if (cfg.center) {
      this.moveTo(Math.max(0, Stage.size().width / 2 - this.getWidth() / 2), Math.max(0, Stage.size().height / 2 - this.getHeight() / 2));
    }
    return this;
  };

  Window.prototype.initWindow = function() {
    var b, content, _i, _len, _ref;
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
        this.insertChild(b, {
          noDown: true
        });
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
    if (this.config.resize) {
      this.addSizeButton();
    }
    this.content = content.elem.id;
    if (this.config.content === 'scroll') {
      this.elem.on('size', function(event, e) {
        var win;
        win = e.getWindow();
        content = $(win.content).widget;
        content.setWidth(win.contentWidth());
        return content.setHeight(win.contentHeight());
      });
      content.elem.setStyle({
        position: 'relative',
        overflow: 'scroll',
        width: '100%',
        height: "%dpx".fmt(this.contentHeight())
      });
    }
    return this;
  };

  Window.prototype.addTitleBar = function() {
    var t;
    _log({
      "file": "./coffee/window.coffee",
      "line": 94,
      "class": "Window",
      "args": ["cfg", "defs"],
      "method": "addTitleBar",
      "type": "."
    }, 'add title');
    t = knix.create({
      type: 'title',
      text: this.config.title,
      parent: this
    });
    return t.elem.ondblclick = this.maximize;
  };

  Window.prototype.addCloseButton = function() {
    return knix.create({
      type: 'close',
      noDown: true,
      parent: this,
      child: {
        type: 'icon',
        icon: 'octicon-x'
      },
      onClick: function(event, e) {
        return e.getWindow().close();
      }
    });
  };

  Window.prototype.addShadeButton = function() {
    return knix.create({
      type: "shade",
      noDown: true,
      parent: this,
      child: {
        type: 'icon',
        icon: 'octicon-dash'
      },
      onClick: function(event, e) {
        return e.getWindow().shade();
      }
    });
  };

  Window.prototype.scrollToBottom = function() {
    var content;
    content = $(this.content);
    return content.scrollTop = content.scrollHeight;
  };

  Window.prototype.stretchWidth = function() {
    tag('layout', 'todo');
    return _log({
      "file": "./coffee/window.coffee",
      "line": 129,
      "class": "Window",
      "args": ["event", "e"],
      "method": "stretchWidth",
      "type": "."
    }, 'add horizontal stretching handles and get rid of addSize crap!');
  };

  Window.prototype.addSizeButton = function() {
    var btn;
    btn = knix.create({
      type: 'size',
      parent: this
    });
    Drag.create({
      target: btn.elem,
      onStart: this.sizeStart,
      onMove: this.sizeMove,
      onStop: this.sizeStop,
      cursor: 'nwse-resize'
    });
    return btn;
  };

  Window.prototype.sizeStart = function(drag, event) {
    this.config.isMaximized = false;
    return drag.target.style.opacity = '0.0';
  };

  Window.prototype.sizeMove = function(drag, event) {
    var hdr, hgt, sizer, spos, wdt, wpos;
    sizer = drag.target.widget;
    wpos = this.absPos();
    spos = sizer.absPos();
    hdr = this.headerSize();
    wdt = spos.x - wpos.x + sizer.getWidth();
    wdt = Math.max(hdr * 2, wdt);
    wdt = Math.max(this.minWidth(), wdt);
    wdt = Math.min(this.maxWidth(), wdt);
    hgt = spos.y - wpos.y + sizer.getHeight();
    hgt = Math.max(hdr + sizer.getHeight(), hgt);
    hgt = Math.max(this.minHeight(), hgt);
    hgt = Math.min(this.maxHeight(), hgt);
    this.resize(wdt, hgt);
  };

  Window.prototype.sizeStop = function(drag, event) {
    var sizer;
    sizer = drag.target;
    return sizer.setStyle({
      bottom: '0px',
      right: '0px',
      left: '',
      top: '',
      opacity: '1.0'
    });
  };

  Window.prototype.maximize = function() {
    var menuHeight;
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

  Window.prototype.raise = function(event, e) {
    var scrolltop, _ref;
    if ((e != null) && (_ref = e.getWindow(), __indexOf.call(knix.popups, _ref) < 0)) {
      knix.closePopups();
    }
    scrolltop = $(this.content).scrollTop;
    this.elem.parentElement.appendChild(this.elem);
    return $(this.content).scrollTop = scrolltop;
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

  Window.prototype.contentWidth = function() {
    return this.elem.getLayout().get('padding-box-width');
  };

  Window.prototype.contentHeight = function() {
    return this.elem.getLayout().get('padding-box-height') - this.headerSize();
  };

  Window.prototype.shade = function() {
    var size;
    size = this.getChild('size');
    if (this.config.isShaded) {
      this.elem.setStyle({
        'min-height': this.config.minHeight + 'px'
      });
      this.setHeight(this.config.height);
      this.config.isShaded = false;
      if (size) {
        size.elem.show();
      }
      $(this.content).show();
    } else {
      this.config.height = this.getHeight();
      this.elem.setStyle({
        'min-height': '0px'
      });
      this.setHeight(this.headerSize());
      this.config.isShaded = true;
      if (size) {
        size.elem.hide();
      }
      $(this.content).hide();
    }
    this.emit('shade', {
      shaded: this.config.isShaded
    });
  };

  Window.prototype.close = function() {
    _log({
      "file": "./coffee/window.coffee",
      "line": 235,
      "class": "Window",
      "args": ["box=\"border-box-height\""],
      "method": "close",
      "type": "."
    }, 'close');
    if (this.config.popup != null) {
      knix.delPopup(this);
    }
    return Window.__super__.close.apply(this, arguments);
  };

  return Window;

})(Widget);

//# sourceMappingURL=window.js.map
