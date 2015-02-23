
/*

000   000  000   000  000  000   000
000  000   0000  000  000   000 000 
0000000    000 0 000  000    00000  
000  000   000  0000  000   000 000 
000   000  000   000  000  000   000
 */
var knix,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

knix = (function() {
  function knix() {}

  knix.version = '0.2.365';

  knix.init = function(config) {
    var c, s;
    if (config.console != null) {
      c = new Console();
      if (config.console === 'shade') {
        c.shade();
      }
    }
    s = 'welcome to';
    log({
      "file": "./coffee/knix.coffee",
      "line": 23,
      "class": "knix",
      "args": ["config"],
      "method": "init",
      "type": "@"
    }, s, 'knix', 'version:', knix.version);
    StyleSwitch.init();
    Stage.initContextMenu();
    knix.initSVG();
    knix.initAnim();
    knix.initTools();
    knix.initAudio();
    c.raise();
    return knix;
  };

  knix.initTools = function() {
    var btn;
    Console.menu();
    btn = {
      type: 'button',
      parent: 'tool',
      "class": 'tool-button'
    };
    About.menu();
    knix.get(btn, {
      icon: 'octicon-device-desktop',
      onClick: function() {
        return Stage.toggleFullscreen();
      }
    });
    knix.get(btn, {
      icon: 'octicon-color-mode',
      onClick: function() {
        return StyleSwitch.toggle();
      }
    });
    knix.get(btn, {
      tooltip: 'save',
      icon: 'octicon-file-binary',
      onClick: knix.dumpWindows
    });
    knix.get(btn, {
      tooltip: 'restore',
      icon: 'octicon-file-directory',
      onClick: knix.restoreMenu
    });
    knix.get(btn, {
      icon: 'octicon-dash',
      onClick: function() {
        return knix.shadeWindows();
      }
    });
    return knix.get(btn, {
      icon: 'octicon-x',
      onClick: function() {
        return knix.closeWindows();
      }
    });
  };

  knix.create = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    if ((cfg.type != null) && (knix[cfg.type] != null) && typeof knix[cfg.type] === 'function') {
      return knix[cfg.type](cfg);
    } else if ((cfg.type != null) && (window[_.capitalize(cfg.type)] != null) && typeof window[_.capitalize(cfg.type)] === 'function') {
      return new window[_.capitalize(cfg.type)](cfg);
    } else {
      return new Widget(cfg, {
        type: 'widget'
      });
    }
  };

  knix.get = function(cfg, def) {
    cfg = _.def(cfg, def);
    return knix.create(_.def(cfg, {
      type: 'window',
      parent: 'stage_content'
    }));
  };

  knix.allWindows = function() {
    var w, _i, _len, _ref, _results;
    _ref = $$('.window');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      w = _ref[_i];
      if (!w.hasClassName('console-window')) {
        _results.push(w.widget);
      }
    }
    return _results;
  };

  knix.allConnections = function() {
    var c;
    return _.uniq(_.flatten((function() {
      var _i, _len, _ref, _results;
      _ref = $$('.connector');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.widget.connections);
      }
      return _results;
    })()));
  };

  knix.closeWindows = function() {
    return knix.allWindows().each(function(w) {
      return w.close();
    });
  };

  knix.shadeWindows = function() {
    return knix.allWindows().each(function(w) {
      return w.shade();
    });
  };

  knix.dumpWindows = function() {
    var dump, w;
    dump = '\n    knix.restore ';
    dump += JSON.stringify({
      'windows': (function() {
        var _i, _len, _ref, _results;
        _ref = this.allWindows();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          w = _ref[_i];
          _results.push(w.config);
        }
        return _results;
      }).call(knix),
      'connections': knix.allConnections()
    }, null, '    ');
    dump = dump.slice(0, -1);
    dump += "    }";
    log({
      "file": "./coffee/knix.coffee",
      "line": 109,
      "class": "knix",
      "args": ["cfg", "def"],
      "method": "dumpWindows",
      "type": "@"
    }, dump);
    return localStorage.setItem(uuid.v4(), dump);
  };

  knix.restoreMenu = function() {
    var i, _i, _ref, _results;
    log({
      "file": "./coffee/knix.coffee",
      "line": 113,
      "class": "knix",
      "args": ["cfg", "def"],
      "method": "restoreMenu",
      "type": "@"
    }, localStorage.length);
    _results = [];
    for (i = _i = 0, _ref = localStorage.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(log({
        "file": "./coffee/knix.coffee",
        "line": 115,
        "class": "knix",
        "args": ["cfg", "def"],
        "method": "restoreMenu",
        "type": "@"
      }, 'storage', i, localStorage.key(i)));
    }
    return _results;
  };

  knix.restore = function(state) {
    knix.restoreWindows(state.windows);
    return knix.restoreConnections(state.connections);
  };

  knix.restoreWindows = function(windows) {
    var w, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = windows.length; _i < _len; _i++) {
      w = windows[_i];
      _results.push(knix.get(w));
    }
    return _results;
  };

  knix.restoreConnections = function(connections) {
    var c, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = connections.length; _i < _len; _i++) {
      c = connections[_i];
      _results.push(new Connection(c));
    }
    return _results;
  };

  knix.addPopup = function(p) {
    if (knix.popups == null) {
      knix.popups = [];
    }
    knix.popups.push(p);
    if (knix.popupHandler == null) {
      return knix.popupHandler = document.on('mousedown', knix.closePopups);
    }
  };

  knix.delPopup = function(p) {
    return knix.popups = knix.popups.without(p);
  };

  knix.closePopups = function(event, e) {
    var p, _i, _j, _len, _len1, _ref, _ref1;
    if (knix.popups != null) {
      _ref = knix.popups;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        _ref1 = knix.popups;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          p = _ref1[_j];
          if (__indexOf.call(p.elem.descendants(), e) < 0) {
            p.close();
          }
        }
      }
    }
    if (knix.popupHandler != null) {
      knix.popupHandler.stop();
      return knix.popupHandler = null;
    }
  };

  knix.initAnim = function() {
    return window.requestAnimationFrame(knix.anim);
  };

  knix.animObjects = [];

  knix.deanimate = function(o) {
    return _.del(knix.animObjects, o);
  };

  knix.animate = function(o) {
    return knix.animObjects.push(o);
  };

  knix.anim = function(timestamp) {
    var animObject, _i, _len, _ref;
    _ref = knix.animObjects;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      animObject = _ref[_i];
      animObject.anim(timestamp);
    }
    return window.requestAnimationFrame(knix.anim);
  };

  knix.initAudio = function() {
    return Audio.init();
  };

  knix.initSVG = function() {
    var svg;
    svg = knix.get({
      id: 'stage_svg',
      type: 'svg'
    });
    return knix.svg = svg.svg;
  };

  knix.svg = function(cfg) {
    var svg;
    svg = new Widget(cfg, {
      elem: 'svg',
      parent: 'stage_content'
    });
    svg.svg = SVG(svg.elem.id);
    return svg;
  };

  knix.canvas = function(cfg) {
    var cvs;
    cvs = new Widget(cfg, {
      elem: 'canvas',
      noMove: true
    });
    return cvs;
  };

  knix.icon = function(cfg) {
    return new Widget(cfg, {
      child: {
        elem: 'span',
        type: 'octicon',
        "class": cfg.icon
      }
    });
  };

  knix.input = function(cfg) {
    var inp;
    inp = new Widget(cfg, {
      elem: 'input',
      type: 'input'
    });
    inp.elem.setAttribute('size', 6);
    inp.elem.setAttribute('type', 'text');
    inp.elem.setAttribute('inputmode', 'numeric');
    inp.elem.getValue = function() {
      return parseFloat(this.value);
    };
    return inp;
  };

  return knix;

})();

//# sourceMappingURL=knix.js.map
