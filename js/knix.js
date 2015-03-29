
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

  knix.version = '0.8.608';

  knix.init = function(config) {
    var c;
    if (config.console != null) {
      c = new Console();
      if (config.console === 'shade') {
        c.shade();
      }
    }
    log({
      "file": "./coffee/knix.coffee",
      "class": "knix",
      "line": 21,
      "args": ["config"],
      "method": "init",
      "type": "@"
    }, 'welcome to knix', "<span class='console-type'>@version:</span>", knix.version);
    Keys.init();
    StyleSwitch.init();
    knix.initSVG();
    knix.initMenu();
    knix.initAnim();
    knix.initTools();
    Audio.init();
    Stage.init();
    if (c != null) {
      c.raise();
    }
    if (config.loadLast) {
      Files.loadLast();
    }
    return knix;
  };


  /*
  00     00  00000000  000   000  000   000   0000000
  000   000  000       0000  000  000   000  000     
  000000000  0000000   000 0 000  000   000  0000000 
  000 0 000  000       000  0000  000   000       000
  000   000  00000000  000   000   0000000   0000000
   */

  knix.initMenu = function() {
    var mainMenu, toolMenu;
    mainMenu = new Menu({
      id: 'menu',
      parent: 'stage',
      style: {
        top: '0px'
      }
    });
    return toolMenu = new Menu({
      id: 'tool',
      parent: 'stage',
      style: {
        top: '0px',
        right: '0px'
      }
    });
  };

  knix.initTools = function() {
    var a, btn, m;
    a = Menu.addButton({
      menu: 'menu',
      text: 'audio',
      icon: 'fa-music',
      action: function() {
        return Menu.menu('audio').show();
      }
    });
    m = new Menu({
      id: 'audio',
      "class": 'submenu',
      parent: a
    });
    m.hide();
    btn = {
      menu: 'tool'
    };
    Menu.addButton(btn, {
      tooltip: 'save',
      keys: ['⌥ß'],
      icon: 'fa-floppy-o',
      action: Files.saveWindows
    });
    Menu.addButton(btn, {
      tooltip: 'reload',
      keys: ['u', '⌥®'],
      icon: 'fa-retweet',
      action: Files.loadLast
    });
    Menu.addButton(btn, {
      tooltip: 'load',
      icon: 'fa-folder-o',
      action: Files.loadMenu
    });
    Menu.addButton(btn, {
      tooltip: 'console',
      icon: 'octicon-terminal',
      action: function() {
        return new Console();
      }
    });
    Menu.addButton(btn, {
      tooltip: 'fullscreen',
      icon: 'octicon-device-desktop',
      action: Stage.toggleFullscreen
    });
    Menu.addButton(btn, {
      tooltip: 'style',
      keys: ['i'],
      icon: 'octicon-color-mode',
      action: StyleSwitch.toggle
    });
    Menu.addButton(btn, {
      tooltip: 'set key',
      keys: ['`'],
      icon: 'fa-keyboard-o',
      action: Keys.startInteractive
    });
    Menu.addButton(btn, {
      tooltip: 'about',
      icon: 'octicon-info',
      action: About.show
    });
    Menu.addButton(btn, {
      tooltip: 'shade all',
      icon: 'octicon-dash',
      action: knix.shadeWindows
    });
    Menu.addButton(btn, {
      tooltip: 'close windows',
      icon: 'octicon-x',
      keys: ['⇧⌥„'],
      action: knix.closeAllWindows
    });
    Keys.add('Backspace', knix.delSelection);
    Keys.add('⌥∂', knix.deselectAll);
    Keys.add('⌥å', knix.selectAll);
    Keys.add('⌘x', knix.cutSelection);
    Keys.add('⌘c', knix.copySelection);
    Keys.add('⌘v', knix.pasteSelection);
    Keys.add('⌥∑', knix.closeWindows);
    Keys.add('⇧S', Selectangle.toggle);
    return Keys.add('^s', Selectangle.toggle);
  };


  /*
   0000000  00000000   00000000   0000000   000000000  00000000
  000       000   000  000       000   000     000     000     
  000       0000000    0000000   000000000     000     0000000 
  000       000   000  000       000   000     000     000     
   0000000  000   000  00000000  000   000     000     00000000
   */

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
    if (typeof w.isWindow === "function" ? w.isWindow() : void 0) {
      Stage.positionWindow(w);
    }
    return w;
  };


  /*
  000   000  000  000   000  0000000     0000000   000   000   0000000
  000 0 000  000  0000  000  000   000  000   000  000 0 000  000     
  000000000  000  000 0 000  000   000  000   000  000000000  0000000 
  000   000  000  000  0000  000   000  000   000  000   000       000
  00     00  000  000   000  0000000     0000000   00     00  0000000
   */

  knix.stateForWidgets = function(widgets) {
    var c, w;
    return JSON.stringify({
      'windows': (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = widgets.length; _i < _len; _i++) {
          w = widgets[_i];
          _results.push(w.getState());
        }
        return _results;
      })(),
      'connections': (function() {
        var _i, _len, _ref, _results;
        _ref = this.connectionsForWidgets(widgets);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push([c.config.source.elem.id, c.config.target.elem.id]);
        }
        return _results;
      }).call(knix)
    }, null, '    ');
  };

  knix.cleanState = function(state) {
    var c, cfg, cleanConfig, idmap, _i, _j, _len, _len1, _ref, _ref1;
    idmap = {};
    cleanConfig = function(cfg) {
      var _ref;
      idmap[cfg.id] = Widget.newID(cfg.type || 'widget');
      cfg.id = idmap[cfg.id];
      if (cfg.child != null) {
        cleanConfig(cfg.child);
      }
      return (_ref = cfg.children) != null ? _ref.each(function(c) {
        return cleanConfig(c);
      }) : void 0;
    };
    _ref = state.windows;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cfg = _ref[_i];
      cleanConfig(cfg);
    }
    _ref1 = state.connections;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      c = _ref1[_j];
      if (idmap[c[0]] != null) {
        c[0] = idmap[c[0]];
      }
      if (idmap[c[1]] != null) {
        c[1] = idmap[c[1]];
      }
    }
    return state;
  };

  knix.connectionsForWidgets = function(widgets) {
    var connection, widgetConnections, _i, _len, _ref, _ref1, _ref2;
    widgetConnections = [];
    _ref = knix.allConnections();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      connection = _ref[_i];
      if ((_ref1 = connection.config.target.getWindow(), __indexOf.call(widgets, _ref1) >= 0) && (_ref2 = connection.config.source.getWindow(), __indexOf.call(widgets, _ref2) >= 0)) {
        widgetConnections.push(connection);
      }
    }
    return widgetConnections;
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

  knix.selectedWindows = function() {
    var w, _i, _len, _ref, _results;
    _ref = $$('.window.selected');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      w = _ref[_i];
      if (!(w.hasClassName('console-window') || w.hasClassName('tooltip'))) {
        _results.push(w.widget);
      }
    }
    return _results;
  };

  knix.selectedOrAllWindows = function() {
    var w;
    w = knix.selectedWindows();
    if (_.isEmpty(w)) {
      w = knix.allWindows();
    }
    return w;
  };

  knix.selectedWidgets = function() {
    var w, _i, _len, _ref, _results;
    _ref = $$('.selected');
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

  knix.delSelection = function() {
    return knix.selectedWidgets().each(function(w) {
      if (!(w != null ? typeof w.isWindow === "function" ? w.isWindow() : void 0 : void 0)) {
        return typeof w.del === "function" ? w.del() : void 0;
      }
    });
  };

  knix.deselectAll = function() {
    return knix.selectedWidgets().each(function(w) {
      return w.elem.removeClassName('selected');
    });
  };

  knix.selectAll = function() {
    return knix.allWindows().each(function(w) {
      return w.elem.addClassName('selected');
    });
  };

  knix.copySelection = function() {
    return knix.copyBuffer = knix.stateForWidgets(knix.selectedWidgets());
  };

  knix.cutSelection = function() {
    knix.copySelection();
    return knix.delSelection();
  };

  knix.pasteSelection = function() {
    var c, restoreConfig, wid, widgets, win, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results, _results1;
    knix.deselectAll();
    if (((_ref = Selectangle.selectangle) != null ? _ref.wid : void 0) != null) {
      widgets = JSON.parse(knix.copyBuffer).windows;
      restoreConfig = function(cfg) {
        var _ref1;
        cfg.parent = cfg.parentID;
        if (cfg.child != null) {
          restoreConfig(cfg.child);
        }
        return (_ref1 = cfg.children) != null ? _ref1.each(function(c) {
          return restoreConfig(c);
        }) : void 0;
      };
      for (_i = 0, _len = widgets.length; _i < _len; _i++) {
        c = widgets[_i];
        restoreConfig(c);
      }
      _ref1 = knix.restoreWindows(widgets);
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        wid = _ref1[_j];
        _results.push(wid.elem.addClassName('selected'));
      }
      return _results;
    } else {
      _ref2 = knix.restore(JSON.parse(knix.copyBuffer));
      _results1 = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        win = _ref2[_k];
        win.elem.addClassName('selected');
        if (win.isWindow()) {
          _results1.push(win.moveBy(10, 10));
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    }
  };

  knix.shadeWindows = function() {
    return knix.selectedOrAllWindows().each(function(w) {
      return w.shade();
    });
  };

  knix.closeWindows = function() {
    return knix.selectedWindows().each(function(w) {
      return w.close();
    });
  };

  knix.closeAllWindows = function() {
    return knix.allWindows().each(function(w) {
      return w.close();
    });
  };

  knix.restore = function(state) {
    var windows;
    knix.cleanState(state);
    log({
      "file": "./coffee/knix.coffee",
      "class": "knix",
      "line": 257,
      "args": ["state"],
      "method": "restore",
      "type": "@"
    }, 'restore', "<span class='console-type'>state:</span>", state);
    windows = knix.restoreWindows(state.windows);
    knix.restoreConnections(state.connections);
    return windows;
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


  /*
  000000000   0000000    0000000   000      000000000  000  00000000    0000000
     000     000   000  000   000  000         000     000  000   000  000     
     000     000   000  000   000  000         000     000  00000000   0000000 
     000     000   000  000   000  000         000     000  000             000
     000      0000000    0000000   0000000     000     000  000        0000000
   */

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
      return delete knix.popupHandler;
    }
  };


  /*
   0000000   000   000  000  00     00   0000000   000000000  000   0000000   000   000
  000   000  0000  000  000  000   000  000   000     000     000  000   000  0000  000
  000000000  000 0 000  000  000000000  000000000     000     000  000   000  000 0 000
  000   000  000  0000  000  000 0 000  000   000     000     000  000   000  000  0000
  000   000  000   000  000  000   000  000   000     000     000   0000000   000   000
   */

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
      if (animObject != null) {
        if (typeof animObject.anim === "function") {
          animObject.anim(step);
        }
      }
    }
    knix.animTimeStamp = timestamp;
    return window.requestAnimationFrame(knix.anim);
  };


  /*
   0000000  000   000   0000000 
  000       000   000  000      
  0000000    000 000   000  0000
       000     000     000   000
  0000000       0       0000000
   */

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
