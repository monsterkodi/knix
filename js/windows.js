
/*

 0000000   0000000     0000000   000   000  000000000
000   000  000   000  000   000  000   000     000   
000000000  0000000    000   000  000   000     000   
000   000  000   000  000   000  000   000     000   
000   000  0000000     0000000    0000000      000
 */
var About, Console, Files, tag,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

About = (function(_super) {
  __extends(About, _super);

  function About() {
    this.init = __bind(this.init, this);
    return About.__super__.constructor.apply(this, arguments);
  }

  About.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    this.url = 'http://monsterkodi.github.io/knix/';
    return About.__super__.init.call(this, cfg, {
      title: 'about',
      id: 'about',
      resize: 'horizontal',
      width: 200,
      center: true,
      children: [
        {
          type: 'about-svg',
          text: '<svg viewBox="0 100 1100 600" height="66px" width="100px"><path class="about-svg-path" d="M 671.97461 153.66602 C 647.84887 153.75842 623.84771 163.63166 606.41211 182.95312 C 573.5922 219.3229 576.45513 275.40809 612.80859 308.24609 C 620.53294 315.22348 629.15009 320.58419 638.24414 324.36133 L 637.97852 511.20117 C 560.81033 441.59202 488.03551 367.51834 414.76367 293.89258 C 409.06942 288.42247 401.85831 285.1368 394.32812 284.25586 C 382.9265 281.82062 370.57957 285.05653 361.77344 293.91211 C 291.50652 362.08056 204.76321 455.25847 139.13477 510.65234 L 138.86523 319.25977 C 138.99507 306.54933 132.3051 294.74291 121.33594 288.32031 C 110.36678 281.89771 96.79809 281.84212 85.777344 288.17578 C 74.756593 294.50944 67.97298 306.26158 68 318.97266 C 68.0096 413.80238 68.032028 508.63329 68.017578 603.46289 C 68.452293 617.45841 77.087108 629.88453 90.052734 635.17188 C 103.01836 640.45922 117.88262 637.61638 127.98047 627.91602 L 245.27539 510.05273 L 362.08789 627.66016 C 367.94368 633.40258 375.28804 636.69048 382.85156 637.55469 C 391.36493 639.36349 400.38626 638.016 408.11914 633.48828 C 419.0883 627.06568 425.77828 615.25927 425.64844 602.54883 L 425.91797 411.1543 L 649.13477 628.46289 C 656.19683 635.24697 665.58871 638.66377 675.0332 638.30469 C 684.64495 638.71483 694.38139 635.23573 701.68164 627.89453 C 738.19192 592.47458 779.14942 550.30282 818.46875 510.1875 C 857.78815 550.30282 898.74753 592.47458 935.25781 627.89453 C 948.81591 641.52869 970.77308 641.86325 984.73828 628.64648 C 998.70348 615.42971 999.57834 593.48695 986.71094 579.19922 L 868.2207 460.60352 L 985.25586 344.67969 C 999.17946 330.95449 999.35554 308.54496 985.64844 294.60352 C 971.94134 280.66208 949.53147 280.4575 935.57227 294.14648 L 818.46875 411.75586 L 722.62109 315.49414 C 728.17633 311.66183 733.38264 307.13532 738.10547 301.91211 L 738.22461 301.78125 C 771.0084 265.37887 768.08923 209.29599 731.70312 176.49414 C 714.64714 161.11826 693.26203 153.58449 671.97461 153.66602 z M 672.16406 206.9668 C 680.66456 206.9343 689.20287 209.94212 696.01367 216.08203 C 710.54339 229.18049 711.71038 251.57511 698.61914 266.11133 L 698.57031 266.16406 C 685.4502 280.67423 663.0538 281.80626 648.53711 268.69336 C 634.02042 255.58047 632.87674 233.18531 645.98242 218.66211 C 652.94481 210.94666 662.53015 207.0037 672.16406 206.9668 z M 354.79492 401.0918 C 354.7939 440.9569 354.79438 480.82238 354.78906 520.6875 L 294.73633 461.20508 L 354.79492 401.0918 z M 709.10938 401.56055 L 768.7168 460.60352 L 709.10156 520.27148 C 709.10264 480.70103 709.1041 441.13102 709.10938 401.56055 z "/></svg>'
        }, {
          type: 'button',
          child: {
            text: 'Home',
            href: this.url
          }
        }, {
          type: 'about-svg',
          text: '<svg viewbox="48 15 27 27" height="80px" width="80px" class="about-svg-path"><path class="about-svg-path" d="M58,20.4c-0.3-0.2-0.8-0.3-1.5-0.3c-0.2,0-0.4,0-0.6,0.1c-0.2,0.1-0.3,0.2-0.3,0.4s0.1,0.3,0.4,0.4 c0.2,0.1,0.6,0.2,1,0.2c0.4,0,0.7,0,0.9-0.1c0.4-0.1,0.9-0.2,1.3-0.4l0.6-0.3c0.5-0.2,1.2-0.7,1.6-0.8c0.7-0.2,1.4-0.3,2.1-0.3 c1.3,0,2.4,0.2,3.1,0.6c0.7,0.3,0.8,1.1,0.8,1.6c0,0.6-0.5,1.1-1.5,1.3C65.4,22.9,65,23,64.5,23c-0.8,0-1.5-0.1-2-0.3 c-0.5-0.2-0.7-0.4-0.7-0.7c0-0.2,0.2-0.4,0.5-0.5c0.1,0,0.3-0.1,0.5-0.1c0,0.3,0.3,0.6,0.8,0.7c0.2,0,0.4,0.1,0.7,0.1 c0.5,0,0.8-0.1,1.1-0.2c0.3-0.1,0.5-0.3,0.5-0.5c0-0.2-0.2-0.4-0.6-0.5c-0.4-0.1-0.8-0.2-1.4-0.2c-0.6,0-1,0-1.4,0.1 c-0.4,0.1-0.7,0.2-1,0.3s-0.6,0.2-0.9,0.3c-0.3,0.1-0.6,0.2-0.9,0.3c-0.7,0.2-1.4,0.4-2,0.4c-0.8,0-1.5-0.1-2.1-0.4 s-0.8-0.7-0.8-1.1c0-0.5,0.4-0.9,1.2-1c0.2,0,0.5-0.1,0.9-0.1c0.4,0,0.7,0,1,0.1c0.3,0.1,0.5,0.2,0.5,0.4S58.3,20.3,58,20.4z"/> <path class="kitty" d="M61.4,26.6c-9.7,0-11-2.3-11-2.3c0,1.2,0.3,2.4,0.7,3.5c-0.6,0.5-2.2,2-2.2,4.2c0,2.8,3.3,4.5,5.5,3.1 c0,0-3.7-0.5-3.7-3.8c0-1.2,0.4-2,1-2.5c0.9,2,2.2,3.5,2.6,4.1c0.8,1,1,0.7,1.5,2.6c0.4,1.6,4,2.5,6,2.5v0c0,0,0,0,0,0 c0,0,0,0,0,0v0c2-0.1,5.3-0.9,5.7-2.5c0.5-2,0.5-1.6,1.3-2.6c0.8-1,3.8-4.7,3.8-8.7C72.4,24.3,71.2,26.6,61.4,26.6z"/> <path class="kitty" d="M61.7,25.2v1.5c0,0-0.4,0-0.4,0s0.4,0,0.4,0V25.2c11,0,11-3,11-3l-1.3-1.3c2.7,2.7-8.6,3-9.9,3c-1.3,0-12.7-0.3-9.9-3 l-1,1.3C50.4,22.2,49.7,25.1,61.7,25.2z"/></svg>'
        }, {
          type: 'button',
          child: {
            text: 'Credits',
            href: this.url + 'credits.html'
          }
        }, {
          type: 'about-svg',
          text: '<svg viewbox="0 0 16 16" width="80px" height="80px" class="kitty-svg"><path class="about-svg-path" d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"/></svg>'
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
  };

  About.show = function() {
    log({
      "file": "./coffee/windows/about.coffee",
      "class": "About",
      "line": 60,
      "args": ["cfg", "defs"],
      "method": "show",
      "type": "@"
    }, "about...");
    if ($('about')) {
      return $('about').raise();
    } else {
      return new About;
    }
  };

  return About;

})(Window);


/*

 0000000   0000000   000   000   0000000   0000000   000      00000000
000       000   000  0000  000  000       000   000  000      000     
000       000   000  000 0 000  0000000   000   000  000      0000000 
000       000   000  000  0000       000  000   000  000      000     
 0000000   0000000   000   000  0000000    0000000   0000000  00000000
 */

Console = (function(_super) {
  __extends(Console, _super);

  function Console() {
    this.clear = __bind(this.clear, this);
    this.toggleMethods = __bind(this.toggleMethods, this);
    this.toggleClasses = __bind(this.toggleClasses, this);
    this.addLogTag = __bind(this.addLogTag, this);
    this.updateTags = __bind(this.updateTags, this);
    this.logInfo = __bind(this.logInfo, this);
    this.insert = __bind(this.insert, this);
    this.onTagState = __bind(this.onTagState, this);
    this.trashSettings = __bind(this.trashSettings, this);
    this.onContextMenu = __bind(this.onContextMenu, this);
    this.init = __bind(this.init, this);
    return Console.__super__.constructor.apply(this, arguments);
  }

  Console.scopeTags = [];

  Console.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    this.logTags = Settings.get('logTags', {});
    cfg = _.def(cfg, {
      x: Stage.size().width / 2,
      y: 30,
      width: Stage.size().width / 2 - 24,
      height: Stage.size().height - 55
    });
    Console.__super__.init.call(this, cfg, {
      title: 'console',
      "class": 'console-window',
      content: 'scroll',
      showMethods: Settings.get('logMethods', true),
      showClasses: Settings.get('logClasses', true),
      buttons: [
        {
          action: this.maximize,
          icon: 'octicon-diff-added'
        }, {
          action: this.scrollToTop,
          icon: 'fa-arrow-circle-o-up'
        }, {
          action: this.scrollToBottom,
          icon: 'fa-arrow-circle-o-down'
        }, {
          align: 'right',
          action: this.clear,
          keys: ['⌥˚', '˚'],
          icon: 'fa-trash-o'
        }
      ],
      child: {
        "class": 'console',
        text: '<span class="tiny-text" style="vertical-align:top">console - knix version ' + knix.version + '</span>',
        noMove: true
      }
    });
    this.elem.addEventListener('contextmenu', this.onContextMenu);
    return this;
  };


  /*
  00     00  00000000  000   000  000   000
  000   000  000       0000  000  000   000
  000000000  0000000   000 0 000  000   000
  000 0 000  000       000  0000  000   000
  000   000  00000000  000   000   0000000
   */

  Console.prototype.onContextMenu = function(event) {
    var children, tag;
    children = [];
    for (tag in this.logTags) {
      if (!tag.startsWith('@') && !tag.startsWith('.')) {
        children.push({
          type: 'toggle',
          text: tag,
          states: ['on', 'unset', 'off'],
          icons: ['octicon-check', 'octicon-dash', 'octicon-x'],
          state: this.logTags[tag],
          onState: this.onTagState
        });
      }
    }
    children.push({
      type: 'button',
      text: 'ok',
      action: function() {
        return _.win().close();
      }
    });
    knix.get({
      hasClose: true,
      hasMaxi: false,
      title: ' ',
      resize: false,
      hasShade: false,
      popup: true,
      pos: Stage.absPos(event),
      console: this,
      children: children,
      buttons: [
        {
          icon: 'octicon-check',
          action: function() {
            var t, _i, _len, _ref, _results;
            _ref = _.win().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('on'));
            }
            return _results;
          }
        }, {
          icon: 'octicon-dash',
          action: function() {
            var t, _i, _len, _ref, _results;
            _ref = _.win().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('unset'));
            }
            return _results;
          }
        }, {
          icon: 'octicon-x',
          action: function() {
            var t, _i, _len, _ref, _results;
            _ref = _.win().elem.select('.toggle');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              t = _ref[_i];
              _results.push(t.widget.setState('off'));
            }
            return _results;
          }
        }, {
          action: this.trashSettings,
          align: 'right',
          icon: 'fa-trash-o'
        }, {
          action: this.toggleMethods,
          align: 'right',
          icon: 'octicon-list-unordered'
        }, {
          action: this.toggleClasses,
          align: 'right',
          icon: 'octicon-three-bars'
        }
      ]
    });
    event.preventDefault();
    return event.stop();
  };


  /*
  000       0000000    0000000 
  000      000   000  000      
  000      000   000  000  0000
  000      000   000  000   000
  0000000   0000000    0000000
   */

  Console.prototype.trashSettings = function() {
    Settings.set('logTags', {});
    Settings.set('logMethods', void 0);
    return Settings.set('logClasses', void 0);
  };

  Console.prototype.onTagState = function(event) {
    var tag;
    tag = _.wid().config.text;
    this.logTags[tag] = event.detail.state;
    Settings.set('logTags', this.logTags);
    return this.updateTags();
  };

  Console.prototype.insert = function(s) {
    this.getChild('console').elem.insert(s);
    return this.scrollToBottom();
  };

  Console.prototype.logInfo = function(info, url, s) {
    var infoStr, styles, t, tags;
    this.addLogTag(info["class"]);
    if ((info["class"] != null) && (info.type != null) && (info.method != null)) {
      infoStr = info["class"] + info.type + info.method;
    } else {
      infoStr = '';
    }
    tags = [info["class"]].concat(Console.scopeTags);
    styles = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        t = tags[_i];
        if (t != null) {
          _results.push("log_" + t.replace(/[\/@]/g, '_'));
        }
      }
      return _results;
    })()).join(' ');
    this.insert('<pre class="' + styles + '">' + '<a onClick=\'' + url + '\' class="console-link" title="' + infoStr + ' ' + tags.join(' ') + '">' + '<span class="console-class" ' + (!this.config.showClasses && 'style="display:none;"' || '') + '>' + ((info["class"] != null) && info["class"] || '') + '</span>' + '<span class="console-method-type" ' + (!this.config.showMethods && 'style="display:none;"' || '') + '>' + ((info.type != null) && info.type || '') + '</span>' + '<span class="console-method" ' + (!this.config.showMethods && 'style="display:none;"' || '') + '>' + ((info.method != null) && info.method || '') + '</span>' + '<span class="octicon octicon-playback-play"></span>' + '</a> ' + s + '</pre>');
    return this.updateTags();
  };

  Console.prototype.updateTags = function() {
    var show, tag, tagElem, tagElems, tclass, v, _i, _len, _ref, _results;
    tagElems = this.elem.select('pre');
    _results = [];
    for (_i = 0, _len = tagElems.length; _i < _len; _i++) {
      tagElem = tagElems[_i];
      show = -1;
      _ref = this.logTags;
      for (tag in _ref) {
        v = _ref[tag];
        tclass = 'log_' + tag.replace(/[\/@]/g, '_');
        if (__indexOf.call(tagElem.classList, tclass) >= 0) {
          if (v === 'off') {
            show = 0;
          } else if (v === 'on' && show !== 0) {
            show = 1;
          }
        }
      }
      _results.push(tagElem.style.display = show === 0 && 'none' || '');
    }
    return _results;
  };

  Console.prototype.addLogTag = function(tag) {
    if (this.logTags[tag] == null) {
      return this.logTags[tag] = 'unset';
    }
  };

  Console.prototype.toggleClasses = function() {
    var t, _i, _len, _ref, _results;
    this.config.showClasses = !this.config.showClasses;
    Settings.set('logClasses', this.config.showClasses);
    _ref = this.elem.select('.console-class');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (this.config.showClasses) {
        _results.push(t.show());
      } else {
        _results.push(t.hide());
      }
    }
    return _results;
  };

  Console.prototype.toggleMethods = function() {
    var t, _i, _len, _ref, _results;
    this.config.showMethods = !this.config.showMethods;
    Settings.set('logMethods', this.config.showMethods);
    _ref = this.elem.select('.console-method', '.console-method-type');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      if (this.config.showMethods) {
        _results.push(t.show());
      } else {
        _results.push(t.hide());
      }
    }
    return _results;
  };

  Console.prototype.clear = function() {
    return this.getChild('console').clear();
  };


  /*
   0000000  000000000   0000000   000000000  000   0000000
  000          000     000   000     000     000  000     
  0000000      000     000000000     000     000  000     
       000     000     000   000     000     000  000     
  0000000      000     000   000     000     000   0000000
   */

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

  Console.logInfo = function(info) {
    var args, s, url;
    args = Array.prototype.slice.call(arguments, 1);
    if (__indexOf.call(Console.scopeTags, 'error') >= 0) {
      s = '<span class="console-error">%s</span> '.fmt(str(args[0])) + Console.toHtml.apply(Console, args.slice(1));
    } else if (__indexOf.call(Console.scopeTags, 'warning') >= 0) {
      s = '<span class="console-warning">%s</span> '.fmt(str(args[0])) + Console.toHtml.apply(Console, args.slice(1));
    } else {
      s = Console.toHtml.apply(Console, args);
    }
    if ((info.file != null) && (info.line != null)) {
      url = 'window.open("https://github.com/monsterkodi/knix/blob/master/%s#L%d");'.fmt(info.file, info.line);
      info.file = info.file.slice(9, -7);
    }
    Console.allConsoles().each(function(c) {
      return c.logInfo(info, url, s);
    });
    return Console.scopeTags = [];
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

  Console.log = function() {
    return Console.allConsoles().each(function(c) {
      return c.insert(Console.toHtml.apply(Console, Array.prototype.slice.call(arguments, 0)));
    });
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
    return html.replace(/([\'\"])(\w+)([\'\"]:)/g, '<span class="console-quote">$1</span><span class="console-string">$2</span><span class="console-quote">$3</span>').replace(/([:\s\"\.])([-]?[\d]+)(?=[,\.]|px)?/g, '$1<span class="console-number">$2</span>').replace(/([:,\.\{\}\(\)\[\]]+|px)/g, '<span class="console-punct">$1</span>').replace(/->/g, '<span class="octicon octicon-arrow-small-right"></span>');
  };

  return Console;

})(Window);

tag = Console.setScopeTags;


/*

00000000  000  000      00000000   0000000
000       000  000      000       000     
000000    000  000      0000000   0000000 
000       000  000      000            000
000       000  0000000  00000000  0000000
 */

Files = (function() {
  function Files() {}

  Files.saveWindows = function() {
    var files, json, windows;
    windows = knix.selectedOrAllWindows();
    if (_.isEmpty(windows)) {
      return;
    }
    json = knix.stateForWidgets(windows);
    log({
      "file": "./coffee/windows/files.coffee",
      "class": "Files",
      "line": 19,
      "method": "saveWindows",
      "type": "@"
    }, "<span class='console-type'>json:</span>", json);
    files = Files.allFiles();
    files[uuid.v4()] = json;
    return localStorage.setItem('files', JSON.stringify(files));
  };

  Files.loadMenu = function(event) {
    var children, data, f, file, files;
    files = Files.allFiles();
    if (_.isEmpty(files)) {
      return;
    }
    children = [];
    for (file in files) {
      data = files[file];
      log({
        "file": "./coffee/windows/files.coffee",
        "class": "Files",
        "line": 32,
        "method": "loadMenu",
        "type": "@",
        "args": ["event"]
      }, 'file', "<span class='console-type'>file:</span>", file, "<span class='console-type'>data.length:</span>", data.length);
      children.push({
        type: 'button',
        text: file,
        action: Files.fileSelected
      });
    }
    return f = knix.get({
      title: ' ',
      hasClose: true,
      hasMaxi: false,
      resize: false,
      hasShade: false,
      popup: true,
      pos: Stage.absPos(event),
      children: children,
      buttons: [
        {
          action: Files.trashFiles,
          icon: 'fa-trash-o'
        }
      ]
    });
  };

  Files.trashFiles = function() {
    localStorage.setItem('files', "{}");
    return knix.closePopups();
  };

  Files.allFiles = function() {
    if (localStorage.getItem('files') != null) {
      return JSON.parse(localStorage.getItem('files'));
    }
    return {};
  };

  Files.loadLast = function() {
    return Files.loadFile(_.keys(Files.allFiles()).last());
  };

  Files.fileSelected = function(event) {
    return Files.loadFile(event.target.getWidget().config.text);
  };

  Files.loadFile = function(filename) {
    var data;
    if (filename) {
      log({
        "file": "./coffee/windows/files.coffee",
        "class": "Files",
        "line": 68,
        "method": "loadFile",
        "type": "@",
        "args": ["filename"]
      }, "<span class='console-type'>filename:</span>", filename);
      data = Files.allFiles()[filename];
      knix.closeAllWindows();
      return knix.restore(JSON.parse(data));
    }
  };

  return Files;

})();

//# sourceMappingURL=windows.js.map
