
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
    this.shade = __bind(this.shade, this);
    this.contentHeight = __bind(this.contentHeight, this);
    this.contentWidth = __bind(this.contentWidth, this);
    this.headerSize = __bind(this.headerSize, this);
    this.raise = __bind(this.raise, this);
    this.maximize = __bind(this.maximize, this);
    this.sizeMove = __bind(this.sizeMove, this);
    this.sizeStart = __bind(this.sizeStart, this);
    this.onLeave = __bind(this.onLeave, this);
    this.onHover = __bind(this.onHover, this);
    this.addMovement = __bind(this.addMovement, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.stretchWidth = __bind(this.stretchWidth, this);
    this.scrollToBottom = __bind(this.scrollToBottom, this);
    this.addShadeButton = __bind(this.addShadeButton, this);
    this.addCloseButton = __bind(this.addCloseButton, this);
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
          noMove: true
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
    this.content = content.elem.id;
    if (this.config.content === 'scroll') {
      content.elem.setStyle({
        position: 'relative',
        overflow: 'scroll',
        width: '100%',
        height: "%dpx".fmt(this.contentHeight())
      });
    }
    this.elem.on('size', this.sizeWindow);
    return this;
  };

  Window.prototype.addTitleBar = function() {
    var t;
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
      noMove: true,
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
      noMove: true,
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
    return this;
  };

  Window.prototype.sizeWindow = function() {
    var content, e, _i, _len, _ref, _ref1, _results;
    if (this.config.content === 'scroll') {
      content = $(this.content).widget;
      content.setWidth(this.contentWidth());
      content.setHeight(this.contentHeight());
    }
    _ref = this.elem.descendants();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      _results.push((_ref1 = e.widget) != null ? typeof _ref1.onWindowSize === "function" ? _ref1.onWindowSize() : void 0 : void 0);
    }
    return _results;
  };

  Window.prototype.addMovement = function() {
    if (this.config.resize) {
      this.elem.on('mousemove', this.onHover);
      return this.elem.on('mouseleave', this.onLeave);
    } else {
      return Window.__super__.addMovement.apply(this, arguments);
    }
  };

  Window.prototype.onHover = function(event, e) {
    var action, border, cursor, d1, d2, eventPos, m, md;
    if (this.sizeMoveDrag) {
      this.sizeMoveDrag.deactivate();
    }
    this.sizeMoveDrag = null;
    if (e.getWidget()) {
      m = this.matchConfigValue('noMove', true, [e.getWidget(), e.getWidget().getAncestors()].flatten());
      if (m.length) {
        return;
      }
    }
    eventPos = Stage.absPos(event);
    d1 = eventPos.sub(this.absPos());
    d2 = this.absPos().add(pos(this.getWidth(), this.getHeight())).sub(eventPos);
    md = 10;
    action = 'move';
    border = '';
    if (d1.y < md) {
      action = 'size';
      border = 'top';
    } else if (d2.y < md) {
      action = 'size';
      border = 'bottom';
    }
    if (d1.x < md) {
      action = 'size';
      border += 'left';
    }
    if (d2.x < md) {
      action = 'size';
      border += 'right';
    }
    if (action === 'size') {
      if (border === 'left' || border === 'right') {
        cursor = 'ew-resize';
      } else if (border === 'top' || border === 'bottom') {
        cursor = 'ns-resize';
      } else if (border === 'topleft' || border === 'bottomright') {
        cursor = 'nwse-resize';
      } else {
        cursor = 'nesw-resize';
      }
      this.sizeMoveDrag = Drag.create({
        target: this.elem,
        onStart: this.sizeStart,
        onMove: this.sizeMove,
        doMove: false,
        cursor: cursor
      });
      return this.sizeMoveDrag.border = border;
    } else {
      return this.sizeMoveDrag = Drag.create({
        target: this.elem,
        minPos: pos(void 0, 0),
        onMove: this.emitMove,
        onStart: StyleSwitch.togglePathFilter,
        onStop: StyleSwitch.togglePathFilter,
        cursor: 'grab'
      });
    }
  };

  Window.prototype.onLeave = function(event) {
    if (this.sizeMoveDrag) {
      this.sizeMoveDrag.deactivate();
    }
    return this.sizeMoveDrag = null;
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
      br = wpos.add(pos(this.getWidth(), this.getHeight()));
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
    var scrolltop;
    scrolltop = $(this.content).scrollTop;
    this.elem.parentElement.appendChild(this.elem);
    $(this.content).scrollTop = scrolltop;
    return event != null ? event.stopPropagation() : void 0;
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
    if (this.config.popup != null) {
      knix.delPopup(this);
    }
    return Window.__super__.close.apply(this, arguments);
  };

  return Window;

})(Widget);

//# sourceMappingURL=window.js.map
