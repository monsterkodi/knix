
/*

     0000000   0000000     0000000   000   000  000000000
    000   000  000   000  000   000  000   000     000
    000000000  0000000    000   000  000   000     000
    000   000  000   000  000   000  000   000     000
    000   000  0000000     0000000    0000000      000
 */
var About, Button, Connection, Connector, Console, Hbox, Path, Slider, Toggle, Value, tag,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

About = (function(_super) {
  __extends(About, _super);

  function About(cfg, defs) {
    if (cfg == null) {
      cfg = {};
    }
    this.url = 'http://localhost:4000/';
    About.__super__.constructor.call(this, _.def(cfg, defs), {
      title: 'about',
      id: 'about',
      resize: 'horizontal',
      width: 200,
      center: true,
      children: [
        {
          type: 'button',
          child: {
            text: 'Home',
            href: this.url
          }
        }, {
          type: 'button',
          child: {
            text: 'Credits',
            href: this.url + 'credits.html'
          }
        }, {
          type: 'kitty-widget',
          child: {
            text: '<svg viewbox="0 0 16 16" height="80" width="80" class="kitty-svg" style="margin-bottom:0"><path d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z" class="kitty"></path></svg>'
          }
        }, {
          type: 'button',
          child: {
            text: 'GitHub',
            href: 'https://github.com/monsterkodi/knix'
          }
        }, {
          style: {
            textAlign: 'center'
          },
          child: {
            elem: 'span',
            type: 'tiny-text',
            text: 'version %s'.fmt(knix.version)
          }
        }
      ]
    });
  }

  About.show = function() {
    tag("@show");
    _log('./coffee/widgets/about.coffee', 55, "about...");
    if ($('about')) {
      return $('about').raise();
    } else {
      return new About;
    }
  };

  About.menu = function() {
    return knix.create({
      type: 'button',
      id: 'show_about',
      icon: 'octicon-info',
      "class": 'tool-button',
      parent: 'tool',
      onClick: function() {
        return About.show();
      }
    });
  };

  return About;

})(Window);


/*

    0000000    000   000  000000000  000000000   0000000   000   000
    000   000  000   000     000        000     000   000  0000  000
    0000000    000   000     000        000     000   000  000 0 000
    000   000  000   000     000        000     000   000  000  0000
    0000000     0000000      000        000      0000000   000   000
 */

Button = (function(_super) {
  __extends(Button, _super);

  function Button(cfg, defs) {
    cfg = _.def(cfg, defs);
    if (cfg.icon != null) {
      if (cfg.text != null) {
        cfg.child = {
          elem: 'span',
          type: 'octicon',
          "class": cfg.icon
        };
      } else {
        cfg.child = {
          type: 'icon',
          icon: cfg.icon
        };
      }
    }
    Button.__super__.constructor.call(this, cfg, {
      type: 'button',
      noDown: true
    });
  }

  return Button;

})(Widget);


/*

     0000000   0000000   000   000  000   000  00000000  0000000 000000000  000   0000000   000   000 
    000       000   000  0000  000  0000  000  000      000         000     000  000   000  0000  000 
    000       000   000  000 0 000  000 0 000  000000   000         000     000  000   000  000 0 000 
    000       000   000  000  0000  000  0000  000      000         000     000  000   000  000  0000 
     0000000   0000000   000   000  000   000  00000000  0000000    000     000   0000000   000   000
 */

Connection = (function() {
  function Connection(config) {
    this.shaded = __bind(this.shaded, this);
    this.close = __bind(this.close, this);
    this.update = __bind(this.update, this);
    this.signalSlotConnector = __bind(this.signalSlotConnector, this);
    this.disconnect = __bind(this.disconnect, this);
    this.connect = __bind(this.connect, this);
    this.onOut = __bind(this.onOut, this);
    this.onMove = __bind(this.onMove, this);
    this.onOver = __bind(this.onOver, this);
    this.dragStop = __bind(this.dragStop, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.closestConnectors = __bind(this.closestConnectors, this);
    var c, e, _i, _len, _ref;
    this.config = config;
    _ref = [this.config.source, this.config.target];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c.addConnection(this);
      e = c.elem;
      c.getWindow().elem.on('size', this.update);
      c.getWindow().elem.on('move', this.update);
      c.getWindow().elem.on('shade', this.shaded);
      c.getWindow().elem.on('close', this.close);
    }
    this.path = knix.get({
      type: 'path',
      "class": 'connection',
      startDir: this.config.source.isSignal() ? pos(100, 0) : pos(-100, 0),
      endDir: this.config.target.isSignal() ? pos(100, 0) : pos(-100, 0),
      onOver: this.onOver,
      onOut: this.onOut,
      onMove: this.onMove
    });
    this.drag = Drag.create({
      target: this.path.path,
      cursor: 'grab',
      doMove: false,
      onStart: this.dragStart,
      onMove: this.dragMove,
      onStop: this.dragStop
    });
    this.path.setStart(this.config.source.absCenter());
    this.path.setEnd(this.config.target.absCenter());
    this.connection = this.connect();
  }

  Connection.prototype.closestConnectors = function(p) {
    var ds, dt;
    ds = p.distSquare(this.config.source.absPos());
    dt = p.distSquare(this.config.target.absPos());
    if (ds < dt) {
      return [this.config.source, this.config.target];
    } else {
      return [this.config.target, this.config.source];
    }
  };

  Connection.prototype.dragStart = function(drag, event) {
    var target, _ref;
    _ref = this.closestConnectors(drag.absPos(event)), target = _ref[0], drag.connector = _ref[1];
    drag.connector.dragStart(drag, event);
    target.delConnection(this);
    return this.path.path.hide();
  };

  Connection.prototype.dragMove = function(drag, event) {
    return drag.connector.dragMove(drag, event);
  };

  Connection.prototype.dragStop = function(drag, event) {
    drag.connector.dragStop(drag, event);
    return this.close();
  };

  Connection.prototype.onOver = function(event, e) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.addClassName('highlight');
    farther.elem.removeClassName('highlight');
    return this.path.path.addClass('highlight');
  };

  Connection.prototype.onMove = function(event, e) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.addClassName('highlight');
    return farther.elem.removeClassName('highlight');
  };

  Connection.prototype.onOut = function(event, e) {
    var closer, farther, _ref;
    _ref = this.closestConnectors(Stage.absPos(event)), closer = _ref[0], farther = _ref[1];
    closer.elem.removeClassName('highlight');
    farther.elem.removeClassName('highlight');
    return this.path.path.removeClass('highlight');
  };

  Connection.prototype.connect = function() {
    var signal, signalConnector, signalEvent, signalSender, slot, slotConnector, slotFunction, _ref, _ref1;
    _ref = this.signalSlotConnector(), signalConnector = _ref[0], slotConnector = _ref[1];
    signal = signalConnector.config.signal;
    slot = slotConnector.config.slot;
    _log('./coffee/widgets/connection.coffee', 88, this.path.path.id(), "connect", signal, slot);
    _ref1 = signalConnector.resolveSignal(signal), signalSender = _ref1[0], signalEvent = _ref1[1];
    slotFunction = slotConnector.resolveSlot(slot);
    return {
      handler: signalSender.elem.on(signalEvent, slotFunction),
      sender: signalSender,
      event: signalEvent,
      signal: signal,
      slot: slot,
      receiver: slotFunction
    };
  };

  Connection.prototype.disconnect = function() {
    _log('./coffee/widgets/connection.coffee', 99, this.path.path.id(), "disconnect", this.connection.signal, this.connection.slot);
    this.connection.handler.stop();
    return this.conncetion = null;
  };

  Connection.prototype.signalSlotConnector = function() {
    return [(this.config.source.config.signal != null ? this.config.source : void 0) || this.config.target, (this.config.source.config.slot != null ? this.config.source : void 0) || this.config.target];
  };

  Connection.prototype.update = function(event, e) {
    this.path.setStart(this.config.source.absCenter());
    return this.path.setEnd(this.config.target.absCenter());
  };

  Connection.prototype.close = function() {
    this.disconnect();
    this.config.source.delConnection(this);
    this.config.target.delConnection(this);
    this.path.close();
    this.path = null;
    return this.config = null;
  };

  Connection.prototype.shaded = function(event, e) {
    var visible;
    visible = !event.detail.shaded && this.config.source.elem.visible() && this.config.target.elem.visible() && this.config.source.getWindow().config.isShaded === false && this.config.target.getWindow().config.isShaded === false;
    if (visible) {
      this.path.setStart(this.config.source.absCenter());
      this.path.setEnd(this.config.target.absCenter());
    }
    return this.path.setVisible(visible);
  };

  return Connection;

})();


/*

     0000000  0000000   000   000  000   000  00000000  0000000 000000000  0000000   00000000   
    000      000   000  0000  000  0000  000  000      000         000    000   000  000   000  
    000      000   000  000 0 000  000 0 000  000000   000         000    000   000  0000000    
    000      000   000  000  0000  000  0000  000      000         000    000   000  000   000  
     0000000  0000000   000   000  000   000  00000000  0000000    000     0000000   000   000
 */

Connector = (function(_super) {
  __extends(Connector, _super);

  function Connector(config) {
    this.dragStop = __bind(this.dragStop, this);
    this.dragMove = __bind(this.dragMove, this);
    this.dragStart = __bind(this.dragStart, this);
    this.onOut = __bind(this.onOut, this);
    this.onOver = __bind(this.onOver, this);
    this.connectorAtPos = __bind(this.connectorAtPos, this);
    this.delConnection = __bind(this.delConnection, this);
    this.addConnection = __bind(this.addConnection, this);
    this.isSlot = __bind(this.isSlot, this);
    this.isSignal = __bind(this.isSignal, this);
    this.close = __bind(this.close, this);
    if (config.slot != null) {
      config["class"] = 'slot';
    }
    if (config.signal != null) {
      config["class"] = 'signal';
    }
    Connector.__super__.constructor.call(this, config, {
      type: 'connector',
      onOver: this.onOver,
      onOut: this.onOut
    });
    Drag.create({
      target: this.elem,
      minPos: pos(void 0, 0),
      cursor: 'grab',
      doMove: false,
      onStart: this.dragStart,
      onMove: this.dragMove,
      onStop: this.dragStop
    });
    this.connections = new Set();
  }

  Connector.prototype.close = function() {
    this.connections.clear();
    this.connections = null;
    return Connector.__super__.close.call(this);
  };

  Connector.prototype.isSignal = function() {
    return this.elem.hasClassName('signal');
  };

  Connector.prototype.isSlot = function() {
    return this.elem.hasClassName('slot');
  };

  Connector.prototype.addConnection = function(c) {
    this.connections.add(c);
    return this.elem.addClassName('connected');
  };

  Connector.prototype.delConnection = function(c) {
    this.connections["delete"](c);
    if (this.connections.size === 0) {
      return this.elem.removeClassName('connected');
    }
  };

  Connector.prototype.connectorAtPos = function(p) {
    var elem;
    this.handle.elem.style.pointerEvents = 'none';
    elem = document.elementFromPoint(p.x, p.y);
    this.handle.elem.style.pointerEvents = 'auto';
    if ((elem != null ? elem.widget : void 0) != null) {
      if (elem.widget.constructor === Connector && elem.widget.isSignal() !== this.isSignal()) {
        return elem.widget;
      }
    }
    return void 0;
  };

  Connector.prototype.onOver = function(event) {
    var p;
    p = Stage.absPos(event);
    if (this.elem === document.elementFromPoint(p.x, p.y)) {
      return this.elem.addClassName('highlight');
    }
  };

  Connector.prototype.onOut = function() {
    return this.elem.removeClassName('highlight');
  };

  Connector.prototype.dragStart = function(drag, event) {
    var p;
    p = drag.absPos(event);
    this.handle = knix.get({
      type: 'handle',
      style: {
        cursor: 'grabbing'
      }
    });
    this.handle.setPos(p);
    this.elem.addClassName('connected');
    this.path = knix.get({
      type: 'path',
      "class": 'connector',
      start: this.absCenter(),
      end: p,
      startDir: this.isSignal() ? pos(200, 0) : pos(-200, 0)
    });
    return this.elem.style.cursor = 'grabbing';
  };

  Connector.prototype.dragMove = function(drag, event) {
    var conn, p;
    p = drag.absPos(event);
    if (conn = this.connectorAtPos(p)) {
      this.path.path.addClass('connectable');
      this.path.setStartDir(this.isSignal() ? pos(100, 0) : pos(-100, 0));
      this.path.setEndDir(conn.isSignal() ? pos(100, 0) : pos(-100, 0));
      this.conn = conn;
      this.conn.elem.addClassName('highlight');
      this.handle.elem.addClassName('highlight');
    } else {
      this.path.path.removeClass('connectable');
      this.path.setStartDir(this.isSignal() ? pos(200, 0) : pos(-200, 0));
      this.path.setEndDir(pos(0, 0));
      if (this.conn) {
        this.conn.elem.removeClassName('highlight');
        this.conn = null;
      }
      this.handle.elem.removeClassName('highlight');
    }
    this.handle.setPos(p);
    return this.path.setEnd(p);
  };

  Connector.prototype.dragStop = function(drag, event) {
    var conn, p;
    p = drag.absPos(event);
    if (conn = this.connectorAtPos(p)) {
      new Connection({
        source: this,
        target: conn
      });
      conn.elem.removeClassName('highlight');
    } else if (this.connections.size === 0) {
      this.elem.removeClassName('connected');
    }
    if (1) {
      this.handle.close();
      return this.path.path.remove();
    }
  };

  return Connector;

})(Widget);


/*

     0000000  0000000   000   000    000000    0000000   000      00000000
    000      000   000  0000  000  000        000   000  000      000
    000      000   000  000 0 000   0000000   000   000  000      0000000
    000      000   000  000  0000        000  000   000  000      000
     0000000  0000000   000   000   0000000    0000000   0000000  00000000
 */

Console = (function(_super) {
  __extends(Console, _super);

  Console.seenTags = [];

  function Console(cfg) {
    this.addLogTag = __bind(this.addLogTag, this);
    this.updateTags = __bind(this.updateTags, this);
    this.fileScopeTags = __bind(this.fileScopeTags, this);
    this.logFileTag = __bind(this.logFileTag, this);
    this.insert = __bind(this.insert, this);
    this.onTagState = __bind(this.onTagState, this);
    this.onContextMenu = __bind(this.onContextMenu, this);
    var h, w;
    this.logTags = {
      'knix': 'off',
      'widget': 'off',
      'window': 'off',
      'layout': 'off',
      'tools/stage': 'off',
      'todo': 'off',
      'connections': 'off'
    };
    this.scopeTags = [];
    w = Stage.size().width / 2;
    h = Stage.size().height - $('menu').getHeight() - 2;
    Console.__super__.constructor.call(this, cfg, {
      title: 'console',
      "class": 'console-window',
      x: w,
      y: $('menu').getHeight() + 2,
      width: w,
      height: h,
      content: 'scroll',
      buttons: [
        {
          "class": 'window-button-right',
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
        text: '<span class="tiny-text" style="vertical-align:top">console - knix version ' + knix.version + '</span>',
        noDown: true
      }
    });
    this.elem.on('contextmenu', this.onContextMenu);
  }

  Console.prototype.onContextMenu = function(event, e) {
    var children, tag;
    children = [];
    for (tag in this.logTags) {
      if (!tag.startsWith('@') && !tag.startsWith('.')) {
        children.push({
          type: 'toggle',
          text: tag,
          state: this.logTags[tag],
          onState: this.onTagState
        });
      }
    }
    children.push({
      type: 'button',
      text: 'ok',
      onClick: function(event, e) {
        return e.getWindow().close();
      }
    });
    knix.get({
      hasClose: false,
      hasMaxi: false,
      title: 'tags',
      resize: false,
      hasShade: false,
      popup: true,
      pos: Stage.absPos(event),
      children: children,
      buttons: [
        {
          "class": 'window-button-right',
          child: {
            type: 'icon',
            icon: 'octicon-x'
          },
          onClick: function(event, e) {
            var t, _i, _len, _ref, _results;
            _ref = e.getWindow().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('off'));
            }
            return _results;
          }
        }, {
          type: "window-button-left",
          child: {
            type: 'icon',
            icon: 'octicon-check'
          },
          onClick: function(event, e) {
            var t, _i, _len, _ref, _results;
            _ref = e.getWindow().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('on'));
            }
            return _results;
          }
        }
      ]
    });
    return event.preventDefault();
  };

  Console.prototype.onTagState = function(event, e) {
    var tag;
    tag = e.widget.config.text;
    this.logTags[tag] = event.detail.state;
    return this.updateTags();
  };

  Console.prototype.insert = function(s) {
    this.getChild('console').elem.insert(s);
    return this.scrollToBottom();
  };

  Console.prototype.logFileTag = function(fileTag, url, s) {
    var onclick, styles, t, tags;
    this.addLogTag(fileTag);
    onclick = "new Ajax.Request('" + url + "');";
    tags = this.fileScopeTags(fileTag, Console.scopeTags);
    styles = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        t = tags[_i];
        _results.push("log_" + t.replace(/[\/]/g, '_'));
      }
      return _results;
    })()).join(' ');
    this.insert('<pre class="' + styles + '"><a onClick="' + onclick + '" class="console-link" title="' + tags.join(' ') + '"><span class="octicon octicon-primitive-dot"></span></a> ' + Console.toHtml(s) + '</pre>');
    return this.updateTags();
  };

  Console.prototype.fileScopeTags = function(fileTag, scopeTags) {
    var s;
    return (scopeTags != null) && [
      fileTag, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = scopeTags.length; _i < _len; _i++) {
          s = scopeTags[_i];
          _results.push((s.startsWith('.') || s.startsWith('@')) && fileTag + s || s);
        }
        return _results;
      })()
    ].flatten() || [fileTag];
  };

  Console.prototype.updateTags = function(tags) {
    var tag, tagElem, tagElems, tclass, _i, _len, _results;
    tagElems = this.elem.select('pre');
    for (_i = 0, _len = tagElems.length; _i < _len; _i++) {
      tagElem = tagElems[_i];
      tagElem.style.display = 'none';
    }
    _results = [];
    for (tag in this.logTags) {
      if ((this.logTags[tag] != null) && (this.logTags[tag] === true || this.logTags[tag] === 'on')) {
        tclass = '.log_' + tag.replace(/[\/]/g, '_');
        tagElems = this.elem.select(tclass);
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = tagElems.length; _j < _len1; _j++) {
            tagElem = tagElems[_j];
            _results1.push(tagElem.style.display = '');
          }
          return _results1;
        })());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Console.prototype.addLogTag = function(tag) {
    if (this.logTags[tag] == null) {
      return this.logTags[tag] = true;
    }
  };

  Console.setScopeTags = function() {
    var t, _i, _len, _ref, _results;
    Console.scopeTags = Array.prototype.slice.call(arguments, 0);
    _ref = Console.scopeTags;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      _results.push(Console.allConsoles().each(function(c) {
        return c.addLogTag(t);
      }));
    }
    return _results;
  };

  Console.logFileLine = function(file, line, s) {
    var tag, url;
    url = 'http://localhost:8888/' + file + ':' + line;
    tag = file.substr(9);
    tag = tag.substr(0, tag.length - 7);
    return Console.allConsoles().each(function(c) {
      return c.logFileTag(tag, url, s);
    });
  };

  Console.allConsoles = function() {
    var e, _i, _len, _ref, _results;
    _ref = $$(".console");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      _results.push(e.getWindow());
    }
    return _results;
  };

  Console.insert = function(s) {
    return Console.allConsoles().each(function(c) {
      return c.insert(s);
    });
  };

  Console.log = function() {
    return Console.insert(Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0)));
  };

  Console.code = function() {
    return Console.insert("<pre>" + Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0)) + "</pre>");
  };

  Console.toHtml = function() {
    var arg, html;
    html = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        _results.push(str(arg));
      }
      return _results;
    }).apply(Console, arguments)).join(" ");
    return html.replace(/[<]([^>]+)[>]/g, '<span class="console-type">&lt;$1&gt;</span>').replace(/([:,\.\{\}\(\)\[\]])/g, '<span class="console-punct">$1</span>').replace(/->/g, '<span class="octicon octicon-arrow-small-right"></span>');
  };

  Console.error = function() {
    var s;
    s = '<span class="console-error">%s</span> '.fmt(str(arguments[0])) + Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 1));
    return Console.insert(s);
  };

  Console.menu = function() {
    return knix.create({
      type: 'button',
      id: 'open_console',
      icon: 'octicon-terminal',
      "class": 'tool-button',
      parent: 'tool',
      onClick: function() {
        return new Console();
      }
    });
  };

  return Console;

})(Window);

tag = Console.setScopeTags;


/*

    000   000  0000000     0000000   000   000 
    000   000  000   000  000   000   000 000 
    000000000  0000000    000   000    00000  
    000   000  000   000  000   000   000 000 
    000   000  0000000     0000000   000   000
 */

Hbox = (function(_super) {
  __extends(Hbox, _super);

  function Hbox(config) {
    var cfg;
    cfg = _.def(config, {
      spacing: 5
    });
    Hbox.__super__.constructor.call(this, cfg, {
      type: 'hbox',
      style: {
        display: 'table',
        borderSpacing: '%dpx 0px'.fmt(cfg.spacing),
        marginRight: '-%dpx'.fmt(cfg.spacing),
        marginLeft: '-%dpx'.fmt(cfg.spacing)
      },
      child: {
        type: 'content',
        style: {
          display: 'table-row',
          width: '100%'
        }
      }
    });
  }

  Hbox.prototype.insertChild = function(cfg) {
    var child;
    child = Hbox.__super__.insertChild.call(this, cfg);
    child.elem.style.display = 'table-cell';
    child.elem.style.marginLeft = '10px';
    return child;
  };

  return Hbox;

})(Widget);


/*

    00000000    0000000   000000000  000   000
    000   000  000   000     000     000   000
    00000000   000000000     000     000000000
    000        000   000     000     000   000
    000        000   000     000     000   000
 */

Path = (function(_super) {
  __extends(Path, _super);

  function Path(config, defaults) {
    this.setCtrl = __bind(this.setCtrl, this);
    this.setEnd = __bind(this.setEnd, this);
    this.setStart = __bind(this.setStart, this);
    this.setStartHead = __bind(this.setStartHead, this);
    this.setEndHead = __bind(this.setEndHead, this);
    this.setStartDir = __bind(this.setStartDir, this);
    this.setEndDir = __bind(this.setEndDir, this);
    this.setVisible = __bind(this.setVisible, this);
    this.close = __bind(this.close, this);
    var clss, _i, _len, _ref;
    this.config = _.def(config, _.def(defaults, {
      start: pos(0, 0),
      startDir: pos(0, 0),
      end: pos(0, 0),
      endDir: pos(0, 0),
      svg: knix.svg
    }));
    this.path = this.config.svg.path();
    this.path.M(0, 0).Q(0, 0, 0, 0).Q(0, 0, 0, 0);
    this.path.attr({
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    this.path.style({
      cursor: 'grabbing'
    });
    this.path.stroke({
      width: 4
    });
    this.path.addClass('path');
    if (this.config["class"] != null) {
      _ref = this.config["class"].split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        clss = _ref[_i];
        this.path.addClass(clss);
      }
    }
    this.path.fill('none');
    this.elem = this.path;
    this.config.endHead = this.config.end.add(this.config.endDir);
    this.config.startHead = this.config.start.add(this.config.startDir);
    this.setStart(this.config.start);
    this.setEnd(this.config.end);
    this.initEvents();
  }

  Path.prototype.close = function() {
    this.path.remove();
    this.path = null;
    return Path.__super__.close.call(this);
  };

  Path.prototype.setVisible = function(v) {
    if (v) {
      return this.path.show();
    } else {
      return this.path.hide();
    }
  };

  Path.prototype.setEndDir = function(p) {
    this.config.endDir = p;
    return this.setEnd(this.config.end);
  };

  Path.prototype.setStartDir = function(p) {
    this.config.startDir = p;
    return this.setStart(this.config.start);
  };

  Path.prototype.setEndHead = function(p) {
    return this.setEndDir(p.sub(this.config.end));
  };

  Path.prototype.setStartHead = function(p) {
    return this.setStartDir(p.sub(this.config.start));
  };

  Path.prototype.setStart = function(p) {
    this.config.start = p;
    this.config.startHead = this.config.start.add(this.config.startDir);
    this.config.mid = this.config.startHead.mid(this.config.endHead);
    this.setCtrl(0, this.config.start);
    this.setCtrl(1, this.config.startHead);
    return this.setCtrl(2, this.config.mid);
  };

  Path.prototype.setEnd = function(p) {
    this.config.end = p;
    this.config.endHead = this.config.end.add(this.config.endDir);
    this.config.mid = this.config.startHead.mid(this.config.endHead);
    this.setCtrl(2, this.config.mid);
    this.setCtrl(3, this.config.endHead);
    return this.setCtrl(4, this.config.end);
  };

  Path.prototype.setCtrl = function(c, p) {
    var o, s, si;
    si = [0, 1, 1, 2, 2][c];
    o = [0, 0, 2, 0, 2][c];
    s = this.path.getSegment(si);
    s.coords[0 + o] = p.x;
    s.coords[1 + o] = p.y;
    return this.path.replaceSegment(si, s);
  };

  return Path;

})(Widget);


/*

      0000000   000      000  0000000    00000000  00000000
     000        000      000  000   000  000       000   000
      0000000   000      000  000   000  0000000   0000000
           000  000      000  000   000  000       000   000
      0000000   0000000  000  0000000    00000000  000   000
 */

Slider = (function(_super) {
  __extends(Slider, _super);

  function Slider(cfg) {
    this.setValue = __bind(this.setValue, this);
    this.setBarValue = __bind(this.setBarValue, this);
    this.valueToPercentOfWidth = __bind(this.valueToPercentOfWidth, this);
    var sizeCB, sliderFunc;
    sliderFunc = function(drag, event) {
      var pos, slider, v, width;
      slider = drag.target.widget;
      pos = slider.absPos();
      width = event.clientX - pos.x;
      v = slider.size2value(width);
      return slider.setValue(v);
    };
    Slider.__super__.constructor.call(this, cfg, {
      type: 'slider',
      value: 0,
      minValue: 0,
      maxValue: 100,
      minWidth: 50,
      child: {
        type: 'slider-bar',
        child: {
          type: 'slider-knob'
        }
      }
    });
    this.setBarValue(this.config.value);
    sizeCB = function(event, e) {
      return this.setValue(this.config.value);
    };
    if (this.getWindow()) {
      this.getWindow().elem.on("size", sizeCB.bind(this));
    }
    Drag.create({
      cursor: 'ew-resize',
      target: this.elem,
      doMove: false,
      onMove: sliderFunc,
      onStart: sliderFunc
    });
  }

  Slider.prototype.valueToPercentOfWidth = function(value) {
    var barFactor, barPercent, borderWidth, cfg, knobMinPercent, knobWidth;
    cfg = this.config;
    knobWidth = this.getChild('slider-knob').getWidth();
    borderWidth = this.getChild('slider-bar').getHeight() - this.getChild('slider-bar').innerHeight();
    knobMinPercent = 100 * (knobWidth + borderWidth) / Math.max(1, this.getWidth());
    barFactor = (value - cfg.minValue) / (cfg.maxValue - cfg.minValue);
    barPercent = knobMinPercent + ((100 - knobMinPercent) * barFactor);
    return barPercent;
  };

  Slider.prototype.setBarValue = function(barValue) {
    var pct;
    pct = this.valueToPercentOfWidth(barValue);
    return this.getChild('slider-bar').elem.style.width = "%.2f%%".fmt(pct);
  };

  Slider.prototype.setValue = function(arg) {
    var oldValue, v;
    oldValue = this.config.value;
    v = this.round(this.clamp(this.slotArg(arg, 'value')));
    if (v !== oldValue) {
      this.config.value = v;
      this.setBarValue(v);
      this.emit('onValue', {
        value: v
      });
    }
    return this;
  };

  return Slider;

})(Widget);


/*

    000000000   0000000    0000000    0000000   000        00000000
       000     000   000  000        000        000        000
       000     000   000  000  0000  000  0000  000        0000000
       000     000   000  000   000  000   000  000        000
       000      0000000    0000000    0000000   000000000  00000000
 */

Toggle = (function(_super) {
  __extends(Toggle, _super);

  function Toggle(cfg, defs) {
    this.onClick = __bind(this.onClick, this);
    this.toggle = __bind(this.toggle, this);
    this.setState = __bind(this.setState, this);
    this.getState = __bind(this.getState, this);
    Toggle.__super__.constructor.call(this, cfg, _.def(defs, {
      "class": 'button',
      icon: 'octicon-x',
      iconon: 'octicon-check',
      onClick: this.onClick,
      state: 'off'
    }));
    if (this.config.onState != null) {
      this.elem.on('onState', this.config.onState);
    }
    this.setState(cfg.state);
  }

  Toggle.prototype.getState = function() {
    return ((!this.config.state) || this.config.state === 'off') && 'off' || 'on';
  };

  Toggle.prototype.setState = function(state) {
    var e;
    this.elem.removeClassName(this.getState());
    e = this.getChild('octicon').elem;
    if ((state == null) || !state || state === 'off') {
      e.removeClassName(this.config.iconon);
      e.addClassName(this.config.icon);
      this.config.state = 'off';
    } else {
      e.removeClassName(this.config.icon);
      e.addClassName(this.config.iconon);
      this.config.state = 'on';
    }
    this.elem.addClassName(this.config.state);
    return this.emit('onState', {
      state: this.config.state
    });
  };

  Toggle.prototype.toggle = function() {
    return this.setState(this.getState() === 'on' && 'off' || 'on');
  };

  Toggle.prototype.onClick = function() {
    return this.toggle();
  };

  return Toggle;

})(Button);


/*

    000   000   0000000   000     000   000  00000000
    000   000  000   000  000     000   000  000
     000 000   000000000  000     000   000  0000000
       000     000   000  000     000   000  000
        0      000   000  0000000  0000000   00000000
 */

Value = (function(_super) {
  __extends(Value, _super);

  function Value(cfg) {
    this.incr = __bind(this.incr, this);
    this.setValue = __bind(this.setValue, this);
    Value.__super__.constructor.call(this, cfg, {
      type: 'value',
      value: 0,
      minValue: 0,
      maxValue: 100,
      horizontal: true,
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
                  var value;
                  value = e.getParent('value');
                  return value.incr('-');
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
                return e.getParent('value').incr('+');
              }
            }
          ]
        }
      }
    });
    this.input = this.getChild('value-input').elem;
    this.elem.on('keypress', function(event, e) {
      var _ref, _ref1, _ref2;
      if ((_ref = event.key) === 'Up' || _ref === 'Down') {
        this.widget.incr(event.key === 'Up' && '+' || '-');
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
        if (this.widget.input.value.indexOf(event.key) > -1) {
          event.stop();
        }
      }
    });
    this.input.on('change', function(event, e) {
      return this.getParent('value').setValue(this.getValue());
    });
    this.input.value = this.config.value;
    this.setValue(this.config.value);
  }

  Value.prototype.setValue = function(arg) {
    var oldValue, v;
    oldValue = this.config.value;
    v = this.round(this.clamp(this.slotArg(arg, 'value')));
    this.input.value = this.strip0(this.format(v));
    if (v !== oldValue) {
      this.config.value = v;
      this.emit('onValue', {
        value: v
      });
    }
    return this;
  };

  Value.prototype.incr = function(d) {
    var step;
    if (d === '+' || d === '++') {
      d = 1;
    } else if (d === '-' || d === '--') {
      d = -1;
    }
    if (this.config.valueStep != null) {
      step = this.config.valueStep;
    } else {
      step = 1;
    }
    return this.setValue(this.input.getValue() + step * d);
  };

  return Value;

})(Widget);

//# sourceMappingURL=widgets.js.map
