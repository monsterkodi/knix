
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

  knix.version = '0.5.1';

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
      "class": "knix",
      "line": 23,
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
    btn = {
      parent: 'tool',
      "class": 'tool-button'
    };
    new Button(btn, {
      tooltip: 'save',
      icon: 'octicon-file-binary',
      onClick: Files.saveWindows
    });
    new Button(btn, {
      tooltip: 'load',
      icon: 'octicon-file-directory',
      onClick: Files.loadMenu
    });
    new Button(btn, {
      tooltip: 'console',
      icon: 'octicon-terminal',
      onClick: function() {
        return new Console();
      }
    });
    new Button(btn, {
      tooltip: 'fullscreen',
      icon: 'octicon-device-desktop',
      onClick: function() {
        return Stage.toggleFullscreen();
      }
    });
    new Button(btn, {
      tooltip: 'style',
      icon: 'octicon-color-mode',
      onClick: function() {
        return StyleSwitch.toggle();
      }
    });
    new Button(btn, {
      tooltip: 'about',
      icon: 'octicon-info',
      onClick: function() {
        return About.show();
      }
    });
    new Button(btn, {
      tooltip: 'shade all',
      icon: 'octicon-dash',
      onClick: function() {
        return knix.shadeWindows();
      }
    });
    return new Button(btn, {
      tooltip: 'close all',
      icon: 'octicon-x',
      onClick: function() {
        return knix.closeWindows();
      }
    });
  };

  knix.create = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    if ((cfg.type != null) && (window[_.capitalize(cfg.type)] != null) && typeof window[_.capitalize(cfg.type)] === 'function') {
      return new window[_.capitalize(cfg.type)](cfg);
    } else {
      return new Widget(cfg, {
        type: 'widget'
      });
    }
  };

  knix.get = function(cfg, def) {
    var w;
    cfg = _.def(cfg, def);
    w = knix.create(_.def(cfg, {
      type: 'window',
      parent: 'stage_content'
    }));
    Stage.positionWindow(w);
    return w;
  };

  knix.allWindows = function() {
    var w, _i, _len, _ref, _results;
    _ref = $$('.window');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      w = _ref[_i];
      if (!(w.hasClassName('console-window') || w.hasClassName('tooltip'))) {
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

  knix.closeConnections = function() {
    return knix.allConnections().each(function(c) {
      return c.close();
    });
  };

  knix.closeWindows = function() {
    knix.closeConnections();
    return knix.allWindows().each(function(w) {
      return w.close();
    });
  };

  knix.shadeWindows = function() {
    return knix.allWindows().each(function(w) {
      return w.shade();
    });
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
      return knix.popupHandler = document.addEventListener('mousedown', knix.closePopups);
    }
  };

  knix.delPopup = function(p) {
    return knix.popups = knix.popups.without(p);
  };

  knix.closePopups = function(event) {
    var e, p, _i, _j, _len, _len1, _ref, _ref1;
    e = event != null ? event.target : void 0;
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
    knix.animTimeStamp = 0;
    return window.requestAnimationFrame(knix.anim);
  };

  knix.animObjects = [];

  knix.animate = function(o) {
    return knix.animObjects.push(o);
  };

  knix.deanimate = function(o) {
    return _.del(knix.animObjects, o);
  };

  knix.anim = function(timestamp) {
    var animObject, step, _i, _len, _ref;
    step = {
      stamp: timestamp,
      delta: timestamp - knix.animTimeStamp,
      dsecs: (timestamp - knix.animTimeStamp) * 0.001
    };
    _ref = knix.animObjects;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      animObject = _ref[_i];
      animObject.anim(step);
    }
    knix.animTimeStamp = timestamp;
    return window.requestAnimationFrame(knix.anim);
  };

  knix.initAudio = function() {
    return Audio.init();
  };

  knix.initSVG = function() {
    var svg;
    svg = knix.create({
      type: 'svg',
      id: 'stage_svg',
      parent: 'stage_content'
    });
    return knix.svg = svg.svg;
  };

  return knix;

})();

//# sourceMappingURL=knix.js.map
