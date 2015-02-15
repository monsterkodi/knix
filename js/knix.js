
/*

    000   000  000   000  000  000   000
    000  000   0000  000  000   000 000
    0000000    000 0 000  000    00000
    000  000   000  0000  000   000 000
    000   000  000   000  000  000   000
 */
var knix;

knix = (function() {
  function knix() {}

  knix.version = '0.1.337';

  knix.init = function(config) {
    var c, s;
    s = 'welcome to';
    _log({
      "file": "./coffee/knix.coffee",
      "line": 19,
      "class": "knix",
      "args": ["config"],
      "method": "init",
      "type": "@"
    }, 'knix' + knix.version);
    if (config.console != null) {
      c = new Console();
      if (config.console === 'shade') {
        c.shade();
      }
    }
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
      icon: 'octicon-dash',
      onClick: function() {
        return knix.shadeAll();
      }
    });
    return knix.get(btn, {
      icon: 'octicon-x',
      onClick: function() {
        return knix.closeAll();
      }
    });
  };

  knix.create = function(config, defaults) {
    var cfg;
    cfg = _.def(config, defaults);
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
    if (cfg == null) {
      cfg = {};
    }
    return knix.create(_.def(cfg, def), {
      type: 'window',
      parent: 'stage_content'
    });
  };

  knix.closeAll = function() {
    return $$('.window').each(function(windowElement) {
      return windowElement.widget.close();
    });
  };

  knix.shadeAll = function() {
    return $$('.window').each(function(windowElement) {
      return windowElement.widget.shade();
    });
  };

  knix.addPopup = function(p) {
    if (knix.popups == null) {
      knix.popups = [];
    }
    knix.popups.push(p);
    _log({
      "file": "./coffee/knix.coffee",
      "line": 97,
      "class": "knix",
      "args": ["p"],
      "method": "addPopup",
      "type": "@"
    }, 'install popup handler');
    if (knix.popupHandler == null) {
      return knix.popupHandler = document.on('mousedown', knix.closePopups);
    }
  };

  knix.delPopup = function(p) {
    _log({
      "file": "./coffee/knix.coffee",
      "line": 102,
      "class": "knix",
      "args": ["p"],
      "method": "delPopup",
      "type": "@"
    }, 'delpopup');
    return knix.popups = knix.popups.without(p);
  };

  knix.closePopups = function() {
    var p, _i, _len, _ref;
    _log({
      "file": "./coffee/knix.coffee",
      "line": 106,
      "class": "knix",
      "args": ["p"],
      "method": "closePopups",
      "type": "@"
    }, 'closepopups');
    if (knix.popups != null) {
      _ref = knix.popups;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        p.close();
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
    var cvs, fbc;
    cvs = new Widget(cfg, {
      elem: 'canvas'
    });
    fbc = new fabric.StaticCanvas(cvs.elem.id);
    if (cfg.width != null) {
      fbc.setWidth(cfg.width);
    }
    if (cfg.height != null) {
      fbc.setHeight(cfg.height);
    }
    cvs.fc = fbc;
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
