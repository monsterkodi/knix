
/*

    KKK  KKK  NNN   NNN  III  XXX   XXX
    KKK KKK   NNNN  NNN  III    XXXXX
    KKKKK     NNN N NNN  III     XXX
    KKK KKK   NNN  NNNN  III    XXXXX
    KKK  KKK  NNN   NNN  III  XXX   XXX
 */
var knix;

knix = (function() {
  function knix() {}

  knix.version = '0.1.5';

  knix.init = function() {
    log('knix ' + this.version);
    this.initSVG();
    this.initTools();
    return this;
  };

  knix.initSVG = function() {
    var svg;
    svg = knix.get({
      id: 'stage_svg',
      type: 'svg'
    });
    return this.svg = svg.svg;
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
    this.get(btn, {
      icon: 'octicon-device-desktop',
      onClick: function() {
        return Stage.toggleFullscreen();
      }
    });
    this.get(btn, {
      icon: 'octicon-color-mode',
      onClick: function() {
        return StyleSwitch.toggle();
      }
    });
    this.get(btn, {
      icon: 'octicon-dash',
      onClick: function() {
        return knix.shadeAll();
      }
    });
    return this.get(btn, {
      icon: 'octicon-x',
      onClick: function() {
        return knix.closeAll();
      }
    });
  };

  knix.create = function(config, defaults) {
    var cfg;
    cfg = _.def(config, defaults);
    if ((cfg.type != null) && (this[cfg.type] != null) && typeof this[cfg.type] === 'function') {
      return this[cfg.type](cfg);
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
    return this.create(_.def(cfg, def), {
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

  knix.svg = function(cfg) {
    var svg;
    svg = new Widget(cfg, {
      elem: 'svg',
      parent: 'stage_content'
    });
    svg.svg = SVG(svg.elem.id);
    return svg;
  };

  knix.button = function(cfg) {
    if (cfg.icon != null) {
      cfg.child = {
        type: 'icon',
        icon: cfg.icon
      };
    }
    return new Widget(cfg, {
      type: 'button',
      noDown: true
    });
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
