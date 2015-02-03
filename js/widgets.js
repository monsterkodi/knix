var Console, Value, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Console = (function(_super) {
  __extends(Console, _super);

  function Console() {
    return Console.__super__.constructor.apply(this, arguments);
  }

  Console.log = function(s) {
    $$(".console").each(function(e) {
      e.insert("<pre>" + s + "</pre>");
      return e.getWindow().scrollToBottom();
    });
    return this;
  };

  Console.menu = function() {
    return Widget.create({
      type: 'button',
      id: 'open_console',
      text: 'console',
      parent: 'menu',
      onClick: function() {
        return Console.create();
      }
    });
  };

  Console.create = function(cfg) {
    var con, h2, w2;
    w2 = Stage.size().width / 2;
    h2 = Stage.size().height / 2;
    return con = knix.get({
      title: 'console',
      "class": 'console-window',
      x: w2,
      y: 0,
      width: w2 - 4,
      height: h2 - 4,
      content: 'scroll',
      buttons: [
        {
          type: "window-button-right",
          child: {
            type: 'icon',
            icon: 'octicon-trashcan'
          },
          onClick: function(event, e) {
            return e.getWindow().getChild('console').clear();
          }
        }, {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-diff-added'
          },
          onClick: function(event, e) {
            return e.getWindow().maximize();
          }
        }
      ],
      child: {
        "class": 'console',
        text: 'knix 0.1.0',
        noDown: true
      }
    });
  };

  return Console;

})(Widget);

Value = (function(_super) {
  __extends(Value, _super);

  function Value() {
    return Value.__super__.constructor.apply(this, arguments);
  }

  Value.create = function(cfg) {
    var value;
    value = Widget.setup(cfg, {
      type: 'value',
      value: 0,
      horizontal: true,
      slots: {
        setValue: function(arg) {
          var v;
          v = this.format(this.round(this.clamp(this.slotArg(arg, 'value'))));
          this.input.value = this.strip0(v);
          return this.emit('onValue', {
            value: v
          });
        }
      },
      child: {
        elem: 'table',
        type: 'value-table',
        onDown: function(event, e) {
          return event.stopPropagation();
        },
        child: {
          elem: 'tr',
          type: 'value-row',
          children: [
            {
              elem: 'td',
              type: 'value-td',
              child: {
                type: 'icon',
                icon: 'octicon-triangle-left',
                onClick: function(event, e) {
                  return this.getParent('value').incr('-');
                }
              }
            }, {
              elem: 'td',
              type: 'value-content',
              child: {
                type: 'input',
                "class": 'value-input'
              }
            }, {
              elem: 'td',
              type: 'value-td',
              child: {
                type: 'icon',
                icon: 'octicon-triangle-right'
              },
              onClick: function(event, e) {
                return this.getParent('value').incr('+');
              }
            }
          ]
        }
      }
    });
    value.input = value.getChild('value-input');
    value.incr = function(d) {
      var step;
      if (d === 'up' || d === '+' || d === '++') {
        d = 1;
      } else if (d === 'down' || d === '-' || d === '--') {
        d = -1;
      }
      if (this.config.valueStep != null) {
        step = this.config.valueStep;
      } else {
        step = 1;
      }
      return this.setValue(this.input.getValue() + step * d);
    };
    value.on('keypress', function(event, e) {
      var _ref, _ref1, _ref2;
      if ((_ref = event.key) === 'Up' || _ref === 'Down') {
        this.incr(event.key.toLowerCase());
        event.stop();
        return;
      }
      if (_ref1 = event.key, __indexOf.call('0123456789-.', _ref1) < 0) {
        if (event.key.length === 1) {
          event.stop();
          return;
        }
      }
      if (_ref2 = event.key, __indexOf.call('-.', _ref2) >= 0) {
        if (this.input.value.indexOf(event.key) > -1) {
          event.stop();
        }
      }
    });
    value.on('change', function(event, e) {
      log('value on change', e.id, e.getValue());
      return this.setValue(e.getValue());
    });
    value.setValue(value.config.value);
    return value;
  };

  return Value;

})(Widget);

Window = (function(_super) {
  __extends(Window, _super);

  function Window() {
    return Window.__super__.constructor.apply(this, arguments);
  }

  Window.create = function(cfg) {
    var children, w;
    children = cfg.children;
    if (cfg.child) {
      if (children == null) {
        children = [];
      }
      children.push(cfg.child);
    }
    cfg.children = null;
    cfg.child = null;
    w = Widget.setup(cfg, {
      type: 'window',
      hasClose: true,
      hasShade: true,
      hasSize: true,
      isMovable: true,
      onDown: function(event, e) {
        return e.getWindow().raise();
      }
    });
    w.init();
    w.config.children = children;
    w.insertChildren();
    return w;
  };

  Window.prototype.init = function() {
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
      parent: this
    });
    if (this.config.hasSize) {
      this.addSizeButton();
    }
    this.content = content.id;
    if (this.config.content === 'scroll') {
      this.on("size", function(event, e) {
        content = $(this.content);
        content.setWidth(this.contentWidth());
        return content.setHeight(this.contentHeight());
      });
      content.setStyle({
        position: 'relative',
        overflow: 'scroll',
        width: '100%',
        height: "%dpx".fmt(this.contentHeight())
      });
    }
    return this;
  };

  Window.prototype.addTitleBar = function() {
    return knix.create({
      type: "title",
      text: this.config.title,
      parent: this,
      onDouble: function(event, e) {
        console.log('maxi');
        return e.getWindow().maximize();
      }
    });
  };

  Window.prototype.addCloseButton = function() {
    return knix.create({
      type: "close",
      noDown: true,
      parent: this,
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

  Window.prototype.addSizeButton = function() {
    var btn, dragMove, dragStart, dragStop;
    btn = knix.create({
      type: "size",
      parent: this
    });
    dragStart = function(drag, event) {};
    dragMove = function(drag, event) {
      var hdr, hgt, sizer, spos, wdt, win, wpos;
      sizer = drag.target;
      win = sizer.getWindow();
      wpos = win.absPos();
      spos = sizer.absPos();
      hdr = win.headerSize();
      wdt = spos.x - wpos.x + sizer.getWidth();
      wdt = Math.max(hdr * 2, wdt);
      wdt = Math.max(win.minWidth(), wdt);
      wdt = Math.min(win.maxWidth(), wdt);
      hgt = spos.y - wpos.y + sizer.getHeight();
      hgt = Math.max(hdr + sizer.getHeight(), hgt);
      hgt = Math.max(win.minHeight(), hgt);
      hgt = Math.min(win.maxHeight(), hgt);
      win.resize(wdt, hgt);
    };
    dragStop = function(drag, event) {
      var sizer;
      sizer = drag.target;
      return sizer.setStyle({
        bottom: '0px',
        right: '0px',
        left: '',
        top: ''
      });
    };
    Drag.create({
      target: btn,
      onStart: dragStart,
      onMove: dragMove,
      onStop: dragStop,
      cursor: "nwse-resize"
    });
    return btn;
  };

  Window.prototype.maximize = function() {
    if (this.config.isMaximized) {
      this.setPos(this.config.pos);
      this.setSize(this.config.size);
      return this.config.isMaximized = false;
    } else {
      this.config.pos = this.absPos();
      this.config.size = this.getSize();
      this.moveTo(0, 0);
      this.setSize(Stage.size());
      return this.config.isMaximized = true;
    }
  };

  Window.prototype.raise = function() {
    var ct, st;
    ct = $(this.content);
    st = ct.scrollTop;
    this.parentElement.appendChild(this);
    return ct.scrollTop = st;
  };

  Window.prototype.headerSize = function(box) {
    var children, height, i;
    if (box == null) {
      box = "border-box-height";
    }
    children = Selector.findChildElements(this, ["*.title", "*.close", "*.shade"]);
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
    return this.getLayout().get("padding-box-width");
  };

  Window.prototype.contentHeight = function() {
    return this.getLayout().get("padding-box-height") - this.headerSize();
  };

  Window.prototype.shade = function() {
    var diff, size;
    size = this.getChild('size');
    if (this.config.isShaded) {
      this.setStyle({
        'min-height': this.config.minHeight + 'px'
      });
      this.setHeight(this.config.height);
      diff = this.getHeight() - this.config.height;
      if (diff) {
        this.setHeight(this.config.height - diff);
      }
      this.config.isShaded = false;
      if (size) {
        size.show();
      }
    } else {
      this.config.height = this.getHeight();
      this.setStyle({
        'min-height': '0px'
      });
      this.setHeight(this.headerSize("padding-box-height"));
      this.config.isShaded = true;
      if (size) {
        size.hide();
      }
    }
  };

  return Window;

})(Widget);

//# sourceMappingURL=widgets.js.map
