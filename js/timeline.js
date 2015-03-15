
/*

000000000  000  00     00  00000000  000      000  000   000  00000000
   000     000  000   000  000       000      000  0000  000  000     
   000     000  000000000  0000000   000      000  000 0 000  0000000 
   000     000  000 0 000  000       000      000  000  0000  000     
   000     000  000   000  00000000  0000000  000  000   000  00000000
 */
var EventCell, EventGrid, TimeRuler, Timeline,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Timeline = (function(_super) {
  __extends(Timeline, _super);

  function Timeline() {
    this.anim = __bind(this.anim, this);
    this.stop = __bind(this.stop, this);
    this.stopCells = __bind(this.stopCells, this);
    this.playPause = __bind(this.playPause, this);
    this.pause = __bind(this.pause, this);
    this.play = __bind(this.play, this);
    this.execStep = __bind(this.execStep, this);
    this.releaseCell = __bind(this.releaseCell, this);
    this.triggerCell = __bind(this.triggerCell, this);
    this.gotoStep = __bind(this.gotoStep, this);
    this.nextStep = __bind(this.nextStep, this);
    this.setStep = __bind(this.setStep, this);
    this.close = __bind(this.close, this);
    this.record = __bind(this.record, this);
    this.noteIn = __bind(this.noteIn, this);
    this.setTime = __bind(this.setTime, this);
    this.cellsAtTime = __bind(this.cellsAtTime, this);
    this.xToTime = __bind(this.xToTime, this);
    this.timeToX = __bind(this.timeToX, this);
    this.sizeWindow = __bind(this.sizeWindow, this);
    this.onGridSize = __bind(this.onGridSize, this);
    this.trash = __bind(this.trash, this);
    this.onFollowState = __bind(this.onFollowState, this);
    this.onScroll = __bind(this.onScroll, this);
    this.init = __bind(this.init, this);
    return Timeline.__super__.constructor.apply(this, arguments);
  }

  Timeline.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      title: 'timeline',
      steps: 32,
      stepWidth: 23,
      stepSecs: 0.15
    });
    Timeline.__super__.init.call(this, cfg, {
      type: 'Timeline',
      width: Math.min(cfg.steps, 32) * cfg.stepWidth + 38,
      height: 300,
      minWidth: 200,
      minHeight: 200,
      buttons: [
        {
          type: 'toggle',
          "class": 'playpause',
          keys: ['p'],
          states: ['pause', 'play'],
          icons: ['fa-play', 'fa-pause']
        }, {
          "class": 'stop',
          icon: 'fa-stop'
        }, {
          type: 'toggle',
          "class": 'record',
          keys: ['r'],
          states: ['off', 'on'],
          icons: ['fa-circle-o', 'fa-circle']
        }, {
          "class": 'trash',
          align: 'right',
          icon: 'octicon-trashcan'
        }, {
          type: 'toggle',
          align: 'right',
          "class": 'follow',
          states: ['off', 'on'],
          icons: ['fa-unlink', 'fa-link']
        }
      ],
      children: [
        {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'noteIn'
            }, {
              type: 'box',
              style: {
                width: '100%',
                height: '20px'
              }
            }, {
              type: 'connector',
              signal: 'noteOut'
            }
          ]
        }, {
          type: 'TimeRuler',
          steps: cfg.steps,
          stepWidth: cfg.stepWidth,
          stepSecs: cfg.stepSecs
        }, {
          type: 'EventGridBox',
          style: {
            position: 'relative',
            overflow: 'scroll',
            left: '0px',
            right: '0px',
            marginBottom: '0px'
          },
          children: [
            {
              type: 'EventGrid',
              steps: cfg.steps,
              stepWidth: cfg.stepWidth,
              stepSecs: cfg.stepSecs
            }, {
              type: 'EventLine',
              width: 1,
              style: {
                position: 'absolute',
                top: '0px'
              }
            }
          ]
        }
      ]
    });
    this.grid = this.getChild('EventGrid');
    this.grid.timeline = this;
    this.ruler = this.getChild('TimeRuler');
    this.line = this.getChild('EventLine');
    this.box = this.getChild('EventGridBox');
    this.content.config.noMove = true;
    this.connect('playpause:trigger', this.playPause);
    this.connect('follow:onState', this.onFollowState);
    this.connect('stop:trigger', this.stop);
    this.connect('record:onState', this.record);
    this.connect('EventGridBox:scroll', this.onScroll);
    this.connect('trash:trigger', this.trash);
    this.connect('EventGrid:size', this.onGridSize);
    this.numSteps = this.config.steps;
    this.step = {
      index: -1,
      secs: 0
    };
    this.elem.style.maxWidth = '%dpx'.fmt(this.config.steps * this.config.stepWidth + 38);
    this.sizeWindow();
    return this;
  };

  Timeline.prototype.onScroll = function(event) {
    return this.ruler.moveTo(-event.target.scrollLeft);
  };

  Timeline.prototype.onFollowState = function(event) {
    return this.follow = event.detail.state === 'on';
  };

  Timeline.prototype.trash = function() {
    this.stopCells();
    return this.grid.removeAllCells();
  };

  Timeline.prototype.onGridSize = function(event) {
    return this.line.setHeight(this.grid.getHeight());
  };

  Timeline.prototype.sizeWindow = function() {
    var height, width;
    Timeline.__super__.sizeWindow.apply(this, arguments);
    this.content.setWidth(this.contentWidth());
    this.content.setHeight(this.contentHeight());
    height = this.content.innerHeight() - 84;
    width = this.content.innerWidth() - 20;
    this.box.resize(width, height);
    return this.onGridSize();
  };


  /*
  000000000  000  00     00  00000000
     000     000  000   000  000     
     000     000  000000000  0000000 
     000     000  000 0 000  000     
     000     000  000   000  00000000
   */

  Timeline.prototype.timeToX = function(time) {
    return time * this.config.stepWidth / this.config.stepSecs;
  };

  Timeline.prototype.xToTime = function(x) {
    return x / this.config.stepWidth * this.config.stepSecs;
  };

  Timeline.prototype.cellsAtTime = function(time) {
    var c, cells, p, x, _i, _len, _ref;
    cells = [];
    x = this.timeToX(time);
    _ref = this.grid.children();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      p = c.relPos();
      if ((p.x < x && x < p.x + c.getWidth())) {
        cells.push(c);
      }
    }
    return cells;
  };

  Timeline.prototype.setTime = function(time) {
    this.relTime = time;
    this.ruler.setTime(this.relTime);
    this.grid.setTime(this.relTime);
    return this.line.moveTo(this.timeToX(this.relTime));
  };


  /*
  00000000   00000000   0000000   0000000   00000000   0000000  
  000   000  000       000       000   000  000   000  000   000
  0000000    0000000   000       000   000  0000000    000   000
  000   000  000       000       000   000  000   000  000   000
  000   000  00000000   0000000   0000000   000   000  0000000
   */

  Timeline.prototype.noteIn = function(event) {
    if (this.config.recording === 'on') {
      this.grid.addNote(event.detail);
    }
    return this.emit('noteOut', event.detail);
  };

  Timeline.prototype.record = function(event) {
    return this.config.recording = event.detail.state;
  };

  Timeline.prototype.close = function() {
    this.stop();
    return Timeline.__super__.close.apply(this, arguments);
  };


  /*
  00000000   000       0000000   000   000
  000   000  000      000   000   000 000 
  00000000   000      000000000    00000  
  000        000      000   000     000   
  000        0000000  000   000     000
   */

  Timeline.prototype.setStep = function(index) {
    var ct;
    ct = Audio.context.currentTime;
    this.startTime = ct - index * this.config.stepSecs;
    this.setTime(ct - this.startTime);
    return this.gotoStep(index);
  };

  Timeline.prototype.nextStep = function() {
    return this.gotoStep(this.step.index + 1);
  };

  Timeline.prototype.gotoStep = function(index) {
    this.step.index = (this.numSteps + index) % this.numSteps;
    this.step.secs = Math.max(0, this.step.secs - this.config.stepSecs);
    if (this.step.index === 0) {
      this.startTime = Audio.context.currentTime + this.step.secs;
    }
    if (this.playing) {
      return this.execStep(this.step.index);
    }
  };

  Timeline.prototype.triggerCell = function(c) {
    return this.emit('noteOut', {
      note: c.config.noteName,
      type: 'trigger'
    });
  };

  Timeline.prototype.releaseCell = function(c) {
    return this.emit('noteOut', {
      note: c.config.noteName,
      type: 'release'
    });
  };

  Timeline.prototype.execStep = function(index) {
    var c, de, ds, p, _i, _len, _ref, _results;
    _ref = this.grid.children();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      p = c.relPos();
      ds = p.x - index * this.config.stepWidth;
      if ((0 <= ds && ds < this.config.stepWidth)) {
        this.triggerCell(c);
      }
      de = p.x + c.getWidth() - index * this.config.stepWidth;
      if ((0 <= de && de < this.config.stepWidth)) {
        if (__indexOf.call(this.grid.activeCells, c) < 0) {
          _results.push(this.releaseCell(c));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Timeline.prototype.play = function() {
    this.playing = true;
    this.startTime = Audio.context.currentTime - (this.step.index + 1) * this.config.stepSecs;
    this.gotoStep(this.step.index);
    return knix.animate(this);
  };

  Timeline.prototype.pause = function() {
    this.stopCells();
    this.playing = false;
    this.setTime((this.step.index + 1) * this.config.stepSecs);
    return knix.deanimate(this);
  };

  Timeline.prototype.playPause = function() {
    if (this.playing) {
      return this.pause();
    } else {
      return this.play();
    }
  };

  Timeline.prototype.stopCells = function() {
    var c, _i, _len, _ref, _results;
    if (this.playing) {
      _ref = this.cellsAtTime(this.relTime);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(this.releaseCell(c));
      }
      return _results;
    }
  };

  Timeline.prototype.stop = function() {
    this.stopCells();
    this.getChild('playpause').setState('pause');
    this.playing = false;
    knix.deanimate(this);
    this.setStep(0);
    if (this.follow) {
      return this.content.elem.scrollLeft = 0;
    }
  };


  /*
   0000000   000   000  000  00     00
  000   000  0000  000  000  000   000
  000000000  000 0 000  000  000000000
  000   000  000  0000  000  000 0 000
  000   000  000   000  000  000   000
   */

  Timeline.prototype.anim = function(step) {
    this.setTime(Audio.context.currentTime - this.startTime);
    if (this.follow) {
      this.box.elem.scrollLeft = this.line.relPos().x - 100;
    }
    this.step.secs += step.dsecs;
    if (this.step.secs > this.config.stepSecs) {
      return this.nextStep();
    }
  };

  Timeline.menu = function() {
    return Timeline.menuButton({
      text: 'timeline',
      icon: 'fa-sliders',
      keys: ['t'],
      action: function() {
        return new Timeline({
          center: true
        });
      }
    });
  };

  return Timeline;

})(Window);


/*

00000000  000   000  00000000  000   000  000000000   0000000  00000000  000      000    
000       000   000  000       0000  000     000     000       000       000      000    
0000000    000 000   0000000   000 0 000     000     000       0000000   000      000    
000          000     000       000  0000     000     000       000       000      000    
00000000      0      00000000  000   000     000      0000000  00000000  0000000  0000000
 */

EventCell = (function(_super) {
  __extends(EventCell, _super);

  function EventCell() {
    this.del = __bind(this.del, this);
    this.release = __bind(this.release, this);
    this.trigger = __bind(this.trigger, this);
    this.init = __bind(this.init, this);
    return EventCell.__super__.constructor.apply(this, arguments);
  }

  EventCell.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    EventCell.__super__.init.call(this, cfg, {
      type: 'EventCell',
      width: 1,
      style: {
        position: 'absolute',
        borderRadius: '%dpx'.fmt(cfg.height / 2)
      }
    });
    return this;
  };

  EventCell.prototype.trigger = function() {
    return log({
      "file": "./coffee/audio/timeline/eventcell.coffee",
      "class": "EventCell",
      "line": 26,
      "args": ["cfg", "defs"],
      "method": "trigger",
      "type": "."
    }, this.config.noteName);
  };

  EventCell.prototype.release = function() {
    return log({
      "file": "./coffee/audio/timeline/eventcell.coffee",
      "class": "EventCell",
      "line": 29,
      "args": ["cfg", "defs"],
      "method": "release",
      "type": "."
    }, this.config.noteName);
  };

  EventCell.prototype.del = function() {
    return this.close();
  };

  return EventCell;

})(Widget);


/*

00000000  000   000  00000000  000   000  000000000   0000000   00000000   000  0000000  
000       000   000  000       0000  000     000     000        000   000  000  000   000
0000000    000 000   0000000   000 0 000     000     000  0000  0000000    000  000   000
000          000     000       000  0000     000     000   000  000   000  000  000   000
00000000      0      00000000  000   000     000      0000000   000   000  000  0000000
 */

EventGrid = (function(_super) {
  __extends(EventGrid, _super);

  function EventGrid() {
    this.startSelect = __bind(this.startSelect, this);
    this.setValue = __bind(this.setValue, this);
    this.addValue = __bind(this.addValue, this);
    this.removeAllCells = __bind(this.removeAllCells, this);
    this.noteRelease = __bind(this.noteRelease, this);
    this.noteTrigger = __bind(this.noteTrigger, this);
    this.addNote = __bind(this.addNote, this);
    this.setTime = __bind(this.setTime, this);
    this.onWindowSize = __bind(this.onWindowSize, this);
    this.init = __bind(this.init, this);
    return EventGrid.__super__.constructor.apply(this, arguments);
  }

  EventGrid.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    EventGrid.__super__.init.call(this, cfg, {
      "class": 'EventGrid',
      noMove: true,
      style: {
        position: 'relative'
      }
    });
    this.rowHeight = 14;
    this.minNoteIndex = 9 * 12;
    this.maxNoteIndex = 0;
    this.timeline = void 0;
    this.timeposx = 0;
    this.activeCells = [];
    this.connect('mousedown', this.startSelect);
    return this;
  };

  EventGrid.prototype.onWindowSize = function() {
    var newHeight;
    this.setWidth(this.config.steps * this.config.stepWidth);
    newHeight = Math.max(this.getParent().getHeight(), this.rowHeight * (this.maxNoteIndex - this.minNoteIndex + 3));
    return this.setHeight(newHeight);
  };


  /*
  000000000  00000000   000   0000000    0000000   00000000  00000000 
     000     000   000  000  000        000        000       000   000
     000     0000000    000  000  0000  000  0000  0000000   0000000  
     000     000   000  000  000   000  000   000  000       000   000
     000     000   000  000   0000000    0000000   00000000  000   000
   */

  EventGrid.prototype.setTime = function(time) {
    var c, _i, _len, _ref, _results;
    this.timeposx = time * this.config.stepWidth / this.config.stepSecs;
    _ref = this.activeCells;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push(c.setWidth(this.timeposx - c.relPos().x));
    }
    return _results;
  };

  EventGrid.prototype.addNote = function(note) {
    if (note.type === 'trigger') {
      return this.noteTrigger(note.note);
    } else {
      return this.noteRelease(note.note);
    }
  };

  EventGrid.prototype.noteTrigger = function(noteName) {
    var c, newRange, noteIndex, oldMaxIndex, oldRange, relIndex, y, _i, _len, _ref;
    c = new EventCell({
      parent: this,
      height: this.rowHeight - 2,
      noteName: noteName
    });
    noteIndex = Keyboard.noteIndex(noteName);
    oldMaxIndex = this.maxNoteIndex;
    oldRange = this.maxNoteIndex - this.minNoteIndex;
    this.minNoteIndex = Math.min(this.minNoteIndex, noteIndex);
    this.maxNoteIndex = Math.max(this.maxNoteIndex, noteIndex);
    newRange = this.maxNoteIndex - this.minNoteIndex;
    if (oldMaxIndex < this.maxNoteIndex) {
      _ref = this.children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        c.moveBy(0, (this.maxNoteIndex - oldMaxIndex) * this.rowHeight);
      }
    }
    if (oldRange !== newRange) {
      this.setHeight((newRange + 3) * this.rowHeight);
    }
    relIndex = noteIndex - this.minNoteIndex;
    y = (newRange - relIndex + 1) * this.rowHeight;
    c.moveTo(this.timeposx, y);
    return this.activeCells.push(c);
  };

  EventGrid.prototype.noteRelease = function(noteName) {
    var c, _i, _len, _ref;
    _ref = this.activeCells;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      if (c.config.noteName === noteName) {
        c.setWidth(Math.max(this.timeposx - c.relPos().x, 1));
        this.activeCells.splice(this.activeCells.indexOf(c), 1);
        return;
      }
    }
  };

  EventGrid.prototype.removeAllCells = function() {
    var c, _i, _len, _ref;
    this.minNoteIndex = 9 * 12;
    this.maxNoteIndex = 0;
    this.activeCells = [];
    _ref = this.children();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c.close();
    }
    return this.onWindowSize();
  };


  /*
  000   000   0000000   000      000   000  00000000
  000   000  000   000  000      000   000  000     
   000 000   000000000  000      000   000  0000000 
     000     000   000  000      000   000  000     
      0      000   000  0000000   0000000   00000000
   */

  EventGrid.prototype.addValue = function(valueWidget) {
    return log({
      "file": "./coffee/audio/timeline/eventgrid.coffee",
      "class": "EventGrid",
      "line": 105,
      "args": ["valueWidget"],
      "method": "addValue",
      "type": "."
    }, 'value', valueWidget.elem.id, valueWidget.config.value);
  };

  EventGrid.prototype.setValue = function(cell, valueWidget) {
    var colIndex, rowIndex;
    rowIndex = cell.config.index;
    colIndex = cell.column().config.index;
    if (__indexOf.call(this.rowColumns[rowIndex], colIndex) < 0) {
      this.rowColumns[rowIndex].push(colIndex);
    }
    cell.clear();
    return cell.insertChild(valueWidget.config);
  };


  /*
   0000000  00000000  000      00000000   0000000  000000000
  000       000       000      000       000          000   
  0000000   0000000   000      0000000   000          000   
       000  000       000      000       000          000   
  0000000   00000000  0000000  00000000   0000000     000
   */

  EventGrid.prototype.startSelect = function(event) {
    Selectangle.start(this);
    return event.stop();
  };

  return EventGrid;

})(Widget);


/*

000000000  000  00     00  00000000  00000000   000   000  000      00000000  00000000 
   000     000  000   000  000       000   000  000   000  000      000       000   000
   000     000  000000000  0000000   0000000    000   000  000      0000000   0000000  
   000     000  000 0 000  000       000   000  000   000  000      000       000   000
   000     000  000   000  00000000  000   000   0000000   0000000  00000000  000   000
 */

TimeRuler = (function(_super) {
  __extends(TimeRuler, _super);

  function TimeRuler() {
    this.onCellDown = __bind(this.onCellDown, this);
    this.setTime = __bind(this.setTime, this);
    this.off = __bind(this.off, this);
    this.on = __bind(this.on, this);
    this.init = __bind(this.init, this);
    return TimeRuler.__super__.constructor.apply(this, arguments);
  }

  TimeRuler.prototype.init = function(cfg, defs) {
    var c, children, r, _i, _j, _len, _ref, _ref1;
    cfg = _.def(cfg, defs);
    cfg = _.def(cfg, {
      stepWidth: 50
    });
    children = [];
    for (r = _i = 0, _ref = cfg.steps; 0 <= _ref ? _i < _ref : _i > _ref; r = 0 <= _ref ? ++_i : --_i) {
      children.push({
        type: cfg.cell,
        "class": 'RulerCell off',
        style: {
          position: 'absolute',
          left: '%dpx'.fmt(r * cfg.stepWidth),
          top: '0px',
          width: '%dpx'.fmt(cfg.stepWidth),
          textAlign: 'center'
        },
        index: r,
        text: '<i class="fa fa-%s"></i>'.fmt(r % 4 && 'circle-o' || r % 8 && 'dot-circle-o' || 'circle')
      });
    }
    TimeRuler.__super__.init.call(this, cfg, {
      type: 'TimeRuler',
      noMove: true,
      noSelect: true,
      children: children,
      style: {
        position: 'relative'
      }
    });
    this.linex = 0;
    this.cell = this.children();
    _ref1 = this.cell;
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      c = _ref1[_j];
      c.elem.addEventListener('mousedown', this.onCellDown);
    }
    return this;
  };

  TimeRuler.prototype.on = function(step) {
    var e;
    e = this.cell[step].elem;
    e.removeClassName('off');
    return e.addClassName('on');
  };

  TimeRuler.prototype.off = function(step) {
    var e;
    e = this.cell[step].elem;
    e.removeClassName('on');
    return e.addClassName('off');
  };

  TimeRuler.prototype.setTime = function(time) {
    return this.linex = time * this.config.stepWidth / this.config.stepSecs;
  };

  TimeRuler.prototype.onCellDown = function(event) {
    this.getWindow().setStep(event.target.getWidget().config.index);
    return event.stop();
  };

  return TimeRuler;

})(Widget);

//# sourceMappingURL=timeline.js.map
