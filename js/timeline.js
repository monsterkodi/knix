
/*

000000000  000  00     00  00000000  000      000  000   000  00000000
   000     000  000   000  000       000      000  0000  000  000     
   000     000  000000000  0000000   000      000  000 0 000  0000000 
   000     000  000 0 000  000       000      000  000  0000  000     
   000     000  000   000  00000000  0000000  000  000   000  00000000
 */
var EventCell, EventGrid, Quantiser, TimeRuler, Timeline,
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
    this.trash = __bind(this.trash, this);
    this.onGridMouseDown = __bind(this.onGridMouseDown, this);
    this.editMode = __bind(this.editMode, this);
    this.onGridSize = __bind(this.onGridSize, this);
    this.onFollowState = __bind(this.onFollowState, this);
    this.onScroll = __bind(this.onScroll, this);
    this.setSpeed = __bind(this.setSpeed, this);
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
      minHeight: 200,
      buttons: Timeline.toolButtons,
      children: [
        {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'noteIn'
            }, {
              type: 'sliderspin',
              "class": 'speed',
              value: cfg.stepSecs,
              sliderStep: 0.001,
              spinStep: 0.001,
              spinFormat: "%1.3f",
              minValue: 0.01,
              maxValue: 0.5,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              signal: 'noteOut'
            }
          ]
        }, {
          type: 'TimeRuler',
          steps: cfg.steps,
          stepWidth: cfg.stepWidth
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
    this.ruler = this.getChild('TimeRuler');
    this.line = this.getChild('EventLine');
    this.box = this.getChild('EventGridBox');
    this.scrollElem = this.box.elem;
    this.grid.timeline = this;
    this.grid.connect('mousedown', this.onGridMouseDown);
    this.box.connect('mousedown', this.onGridMouseDown);
    this.box.config.noMove = true;
    this.connect('playpause:trigger', this.playPause);
    this.connect('follow:onState', this.onFollowState);
    this.connect('stop:trigger', this.stop);
    this.connect('record:onState', this.record);
    this.connect('EventGridBox:scroll', this.onScroll);
    this.connect('trash:trigger', this.trash);
    this.connect('EventGrid:size', this.onGridSize);
    this.connect('speed:onValue', this.setSpeed);
    this.connect('speed:onValue', 'grid:setSpeed');
    this.numSteps = this.config.steps;
    this.step = {
      index: -1,
      secs: 0
    };
    this.elem.style.maxWidth = '%dpx'.fmt(this.config.steps * this.config.stepWidth + 38);
    this.getChild('quantise').setState('on');
    return this;
  };


  /*
  0000000    000   000  000000000  000000000   0000000   000   000   0000000
  000   000  000   000     000        000     000   000  0000  000  000     
  0000000    000   000     000        000     000   000  000 0 000  0000000 
  000   000  000   000     000        000     000   000  000  0000       000
  0000000     0000000      000        000      0000000   000   000  0000000
   */

  Timeline.toolButtons = [
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
      type: 'toggle',
      "class": 'follow',
      states: ['off', 'on'],
      icons: ['fa-unlink', 'fa-link']
    }, {
      type: 'toggle',
      "class": 'editMode',
      configKey: 'editMode',
      keys: ['e'],
      state: 'single',
      states: ['multi', 'single'],
      icons: ['fa-th', 'fa-pencil']
    }, {
      align: 'right',
      type: 'toggle',
      "class": 'quantise',
      configKey: 'grid.quantiser.state',
      keys: ['q'],
      states: ['off', 'on'],
      icons: ['fa-square-o', 'fa-check-square']
    }, {
      type: 'toggle',
      "class": 'quantiseSteps',
      configKey: 'grid.quantiser.quantiseSteps',
      state: 2,
      states: [1, 2, 4, 8],
      icons: ['fa-circle-o', 'fa-dot-circle-o', 'fa-bullseye', 'fa-circle']
    }, {
      type: 'toggle',
      "class": 'quantiseMode',
      configKey: 'grid.quantiser.quantiseMode',
      state: 'start length',
      states: ['length', 'start', 'start length'],
      icons: ['fa-minus-square', 'fa-plus-square', 'fa-h-square']
    }, {
      "class": 'trash',
      icon: 'fa-trash-o'
    }
  ];


  /*
  00000000  000   000  00000000  000   000  000000000   0000000
  000       000   000  000       0000  000     000     000     
  0000000    000 000   0000000   000 0 000     000     0000000 
  000          000     000       000  0000     000          000
  00000000      0      00000000  000   000     000     0000000
   */

  Timeline.prototype.setSpeed = function(v) {
    return this.config.stepSecs = _.value(v);
  };

  Timeline.prototype.onScroll = function(event) {
    return this.ruler.moveTo(-event.target.scrollLeft);
  };

  Timeline.prototype.onFollowState = function(event) {
    return this.follow = event.detail.state === 'on';
  };

  Timeline.prototype.onGridSize = function(event) {
    return this.line.setHeight(this.grid.getHeight());
  };

  Timeline.prototype.editMode = function(state) {
    this.config.editMode = state;
    return this.grid.elem.setStyle({
      cursor: (state === 'multi') && 'crosshair' || 'pointer'
    });
  };

  Timeline.prototype.onGridMouseDown = function(event) {
    var c, relPos, selected, wid, _i, _len, _ref;
    if (this.config.editMode === 'multi') {
      Selectangle.start(this.grid);
    } else {
      selected = false;
      _ref = this.grid.allChildren();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wid = _ref[_i];
        if (wid.elem.hasClassName('selected')) {
          wid.elem.removeClassName('selected');
          selected = true;
        }
      }
      if (!selected) {
        relPos = Stage.absPos(event).minus(this.box.absPos());
        c = this.grid.addNote({
          event: 'trigger',
          noteName: this.grid.noteNameAtPos(relPos),
          width: this.config.stepWidth,
          x: relPos.x,
          y: relPos.y
        });
        this.grid.activeCells.splice(this.grid.activeCells.indexOf(c), 1);
      }
    }
    return event.stop();
  };

  Timeline.prototype.trash = function() {
    this.stopCells();
    this.grid.removeAllCells();
    return this.onGridSize();
  };

  Timeline.prototype.sizeWindow = function() {
    var height, width;
    Timeline.__super__.sizeWindow.apply(this, arguments);
    this.content.setWidth(this.contentWidth());
    this.content.setHeight(this.contentHeight());
    this.getChild('hbox').setWidth(this.contentWidth() - 10);
    height = this.content.innerHeight() - 96;
    width = this.content.innerWidth() - 40;
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
      this.grid.scrollToCells([this.grid.addNote(event.detail)]);
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
      noteName: c.config.noteName,
      event: 'trigger'
    });
  };

  Timeline.prototype.releaseCell = function(c) {
    return this.emit('noteOut', {
      noteName: c.config.noteName,
      event: 'release'
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
    this.getChild('record').setState('off');
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
    this.onMoveStart = __bind(this.onMoveStart, this);
    this.onDragSize = __bind(this.onDragSize, this);
    this.onDragMove = __bind(this.onDragMove, this);
    this.onMoveStop = __bind(this.onMoveStop, this);
    this.minWidth = __bind(this.minWidth, this);
    this.init = __bind(this.init, this);
    return EventCell.__super__.constructor.apply(this, arguments);
  }

  EventCell.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    EventCell.__super__.init.call(this, cfg, {
      type: 'EventCell',
      resize: 'horizontal',
      style: {
        position: 'absolute',
        borderRadius: '%dpx'.fmt(cfg.height / 2)
      }
    });
    new DragSize({
      moveStart: this.onMoveStart,
      moveStop: this.onMoveStop,
      onMove: this.onDragMove,
      onSize: this.onDragSize,
      doMove: false,
      elem: this.elem
    });
    return this;
  };

  EventCell.prototype.minWidth = function() {
    return 1;
  };

  EventCell.prototype.onMoveStop = function(drag) {
    return this.getParent().clearDeltas();
  };

  EventCell.prototype.onDragMove = function(drag) {
    return this.getParent().moveCellsBy(this.getParent().selectedCells(), drag.delta.x, drag.delta.y);
  };

  EventCell.prototype.onDragSize = function(drag) {
    return this;
  };

  EventCell.prototype.onMoveStart = function(drag, event) {
    this.getParent().clearDeltas();
    if (!event.shiftKey && this.getWindow().config.editMode === 'single') {
      knix.deselectAll();
    }
    return this.elem.addClassName('selected');
  };

  EventCell.prototype.trigger = function() {
    return log({
      "file": "./coffee/audio/timeline/eventcell.coffee",
      "class": "EventCell",
      "line": 45,
      "args": ["drag", "event"],
      "method": "trigger",
      "type": "."
    }, "<span class='console-type'>@config.note:</span>", this.config.note);
  };

  EventCell.prototype.release = function() {
    return log({
      "file": "./coffee/audio/timeline/eventcell.coffee",
      "class": "EventCell",
      "line": 46,
      "args": ["drag", "event"],
      "method": "release",
      "type": "."
    }, "<span class='console-type'>@config.note:</span>", this.config.note);
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
    this.setValue = __bind(this.setValue, this);
    this.addValue = __bind(this.addValue, this);
    this.prepareState = __bind(this.prepareState, this);
    this.removeAllCells = __bind(this.removeAllCells, this);
    this.noteNameAtPos = __bind(this.noteNameAtPos, this);
    this.noteIndexAtPos = __bind(this.noteIndexAtPos, this);
    this.noteIndexAtY = __bind(this.noteIndexAtY, this);
    this.roundToNoteY = __bind(this.roundToNoteY, this);
    this.noteRelease = __bind(this.noteRelease, this);
    this.noteTrigger = __bind(this.noteTrigger, this);
    this.addNote = __bind(this.addNote, this);
    this.setSpeed = __bind(this.setSpeed, this);
    this.setTime = __bind(this.setTime, this);
    this.cellMaxima = __bind(this.cellMaxima, this);
    this.selectedCells = __bind(this.selectedCells, this);
    this.scrollToSelectedCells = __bind(this.scrollToSelectedCells, this);
    this.scrollToCells = __bind(this.scrollToCells, this);
    this.scrollToCell = __bind(this.scrollToCell, this);
    this.scrollToPos = __bind(this.scrollToPos, this);
    this.clearDeltas = __bind(this.clearDeltas, this);
    this.moveCellsBy = __bind(this.moveCellsBy, this);
    this.onKey = __bind(this.onKey, this);
    this.onWindowSize = __bind(this.onWindowSize, this);
    this.init = __bind(this.init, this);
    return EventGrid.__super__.constructor.apply(this, arguments);
  }

  EventGrid.prototype.init = function(cfg, defs) {
    cfg = _.def(cfg, defs);
    EventGrid.__super__.init.call(this, cfg, {
      "class": 'EventGrid',
      noMove: true,
      rowHeight: 14,
      style: {
        position: 'relative',
        cursor: 'pointer'
      }
    });
    this.quantiser = new Quantiser({
      grid: this,
      steps: 1,
      mode: 'start'
    });
    this.setHeight(this.config.rowHeight * Keyboard.numNotes());
    this.timeline = void 0;
    this.timeposx = 0;
    this.activeCells = [];
    document.addEventListener('keypress', this.onKey);
    return this;
  };

  EventGrid.prototype.onWindowSize = function() {
    return this.setWidth(this.config.steps * this.config.stepWidth);
  };

  EventGrid.prototype.onKey = function(event, e) {
    this.quantiser.moveCellsInDirection(this.selectedCells(), event.key);
    return this.clearDeltas();
  };

  EventGrid.prototype.moveCellsBy = function(cells, dx, dy) {
    return this.quantiser.moveCellsBy(cells, dx, dy);
  };

  EventGrid.prototype.clearDeltas = function() {
    var c, _i, _len, _ref, _results;
    _ref = this.selectedCells();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _results.push(delete c.config.delta);
    }
    return _results;
  };


  /*
   0000000   0000000  00000000    0000000   000      000    
  000       000       000   000  000   000  000      000    
  0000000   000       0000000    000   000  000      000    
       000  000       000   000  000   000  000      000    
  0000000    0000000  000   000   0000000   0000000  0000000
   */

  EventGrid.prototype.scrollToPos = function(p) {
    var left, top, viewHeight, viewWidth;
    viewWidth = this.elem.parentElement.widget.getWidth();
    left = Math.min(p.x, this.elem.parentElement.scrollLeft);
    left = Math.max(p.x - viewWidth, left);
    left = Math.min(this.getWidth() - viewWidth, left);
    this.elem.parentElement.scrollLeft = left;
    viewHeight = this.elem.parentElement.widget.getHeight();
    top = Math.min(p.y, this.elem.parentElement.scrollTop);
    top = Math.max(p.y - viewHeight + this.config.rowHeight, top);
    top = Math.min(this.getHeight() - viewHeight, top);
    return this.elem.parentElement.scrollTop = top;
  };

  EventGrid.prototype.scrollToCell = function(cell) {
    return this.scrollToPos(cell.relPos());
  };

  EventGrid.prototype.scrollToCells = function(cells) {
    var maxpos, minpos, oldLeft, oldTop, _ref;
    _ref = this.cellMaxima(cells), minpos = _ref[0], maxpos = _ref[1];
    oldTop = this.elem.parentElement.scrollTop;
    oldLeft = this.elem.parentElement.scrollLeft;
    this.scrollToPos(maxpos);
    this.scrollToPos(minpos);
    return pos(oldLeft - this.elem.parentElement.scrollLeft, oldTop - this.elem.parentElement.scrollTop);
  };

  EventGrid.prototype.scrollToSelectedCells = function() {
    return this.scrollToCells(this.selectedCells());
  };

  EventGrid.prototype.selectedCells = function() {
    var s, _i, _len, _ref, _results;
    _ref = this.elem.select('.selected');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      _results.push(s.widget);
    }
    return _results;
  };

  EventGrid.prototype.cellMaxima = function(cells) {
    var c, maxpos, minpos, p, _i, _len;
    minpos = pos(Number.MAX_VALUE, Number.MAX_VALUE);
    maxpos = pos(0, 0);
    for (_i = 0, _len = cells.length; _i < _len; _i++) {
      c = cells[_i];
      p = c.relPos();
      minpos = minpos.min(p);
      maxpos = maxpos.max(p.plus(pos(c.getWidth(), this.config.rowHeight)));
    }
    return [minpos, maxpos];
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

  EventGrid.prototype.setSpeed = function(speed) {
    this.config.stepSecs = _.value(speed);
    return log({
      "file": "./coffee/audio/timeline/eventgrid.coffee",
      "class": "EventGrid",
      "line": 102,
      "args": ["speed"],
      "method": "setSpeed",
      "type": "."
    }, "<span class='console-type'>@config.stepSecs:</span>", this.config.stepSecs);
  };

  EventGrid.prototype.addNote = function(note) {
    if (note.event === 'trigger') {
      return this.noteTrigger(note);
    } else {
      return this.noteRelease(note);
    }
  };

  EventGrid.prototype.noteTrigger = function(note) {
    var c, noteIndex, x, y;
    c = new EventCell(note, {
      parent: this,
      height: this.config.rowHeight - 2
    });
    noteIndex = Keyboard.noteIndex(c.config.noteName);
    x = c.config.x == null ? this.timeposx : c.config.x;
    y = c.config.y == null ? this.getHeight() - (noteIndex + 1) * this.config.rowHeight : c.config.y;
    this.quantiser.cellAddedAt(c, pos(x, y));
    this.activeCells.push(c);
    return c;
  };

  EventGrid.prototype.noteRelease = function(note) {
    var c, _i, _len, _ref;
    _ref = this.activeCells;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      if (c.config.noteName === note.noteName) {
        c.setWidth(Math.max(this.timeposx - c.relPos().x, 1));
        this.activeCells.splice(this.activeCells.indexOf(c), 1);
        return c;
      }
    }
  };

  EventGrid.prototype.roundToNoteY = function(y) {
    return this.getHeight() - this.config.rowHeight * (1 + this.noteIndexAtY(y));
  };

  EventGrid.prototype.noteIndexAtY = function(y) {
    return _.clamp(0, Keyboard.maxNoteIndex(), Math.floor((this.getHeight() - y - 1) / this.config.rowHeight));
  };

  EventGrid.prototype.noteIndexAtPos = function(pos) {
    return this.noteIndexAtY(pos.y);
  };

  EventGrid.prototype.noteNameAtPos = function(pos) {
    return Keyboard.allNoteNames()[this.noteIndexAtPos(pos)];
  };

  EventGrid.prototype.removeAllCells = function() {
    var c, _i, _len, _ref;
    this.activeCells = [];
    _ref = this.children();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c.close();
    }
    return this.onWindowSize();
  };

  EventGrid.prototype.prepareState = function() {
    var c;
    return this.config.children = (function() {
      var _i, _len, _ref, _results;
      _ref = this.children();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.config);
      }
      return _results;
    }).call(this);
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
      "line": 154,
      "args": ["valueWidget"],
      "method": "addValue",
      "type": "."
    }, 'value', "<span class='console-type'>valueWidget.elem.id:</span>", valueWidget.elem.id, "<span class='console-type'>valueWidget.config.value:</span>", valueWidget.config.value);
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

  return EventGrid;

})(Widget);


/*

 0000000   000   000   0000000   000   000  000000000  000   0000000  00000000  00000000 
000   000  000   000  000   000  0000  000     000     000  000       000       000   000
000 00 00  000   000  000000000  000 0 000     000     000  0000000   0000000   0000000  
000 0000   000   000  000   000  000  0000     000     000       000  000       000   000
 00000 00   0000000   000   000  000   000     000     000  0000000   00000000  000   000
 */

Quantiser = (function() {
  function Quantiser(cfg, defs) {
    this.state = __bind(this.state, this);
    this.quantiseSteps = __bind(this.quantiseSteps, this);
    this.quantiseMode = __bind(this.quantiseMode, this);
    this.cellAddedAt = __bind(this.cellAddedAt, this);
    this.moveCellsInDirection = __bind(this.moveCellsInDirection, this);
    this.moveCellsBy = __bind(this.moveCellsBy, this);
    this.moveCellTo = __bind(this.moveCellTo, this);
    this.init = __bind(this.init, this);
    this.init(cfg, defs);
  }

  Quantiser.prototype.init = function(cfg, defs) {
    this.config = _.def(cfg, defs);
    this.grid = this.config.grid;
    delete this.config.grid;
    log({
      "file": "./coffee/audio/timeline/quantiser.coffee",
      "class": "Quantiser",
      "line": 21,
      "args": ["cfg", "defs"],
      "method": "init",
      "type": "."
    }, "<span class='console-type'>@config:</span>", this.config);
    return this;
  };

  Quantiser.prototype.moveCellTo = function(cell, p) {
    var c, cw, d, newNoteIndex, noteIndex, oldPos;
    c = cell.config;
    oldPos = pos(c.x, c.y);
    d = p.minus(oldPos);
    if (c.delta != null) {
      p.add(c.delta);
    }
    p.x = _.floor(p.x, this.config.state === 'on' && this.config.mode.indexOf('start') >= 0 && this.grid.config.stepWidth * this.config.steps || 2);
    p.y = this.grid.roundToNoteY(p.y);
    if (p.x === c.x || p.y === c.y) {
      if (c.delta == null) {
        c.delta = pos(0, 0);
        if (p.x === c.x) {
          c.delta.x = d.x;
        }
        if (p.y === c.y) {
          c.delta.y = d.y;
        }
      } else {
        if (p.x === c.x) {
          c.delta.x += d.x;
        } else {
          c.delta.x = oldPos.x + d.x + c.delta.x - p.x;
        }
        if (p.y === c.y) {
          c.delta.y += d.y;
        } else {
          c.delta.y = oldPos.y + d.y + c.delta.y - p.y;
        }
      }
    }
    cell.moveTo(p.x, p.y);
    if (this.config.state === 'on' && this.config.mode.indexOf('length') >= 0) {
      cw = this.grid.config.stepWidth * this.config.steps;
      cell.setWidth(Math.max(cw, _.round(cell.getWidth(), cw)));
    }
    noteIndex = Keyboard.noteIndex(cell.config.noteName);
    newNoteIndex = this.grid.noteIndexAtPos(p);
    cell.config.noteName = Keyboard.allNoteNames()[newNoteIndex];
    return this.grid.scrollToCell(cell);
  };

  Quantiser.prototype.moveCellsBy = function(cells, dx, dy) {
    var c, maxpos, minpos, _i, _len, _ref, _results;
    _ref = this.grid.cellMaxima(cells), minpos = _ref[0], maxpos = _ref[1];
    dx = Math.max(dx, -minpos.x);
    dy = Math.max(dy, -minpos.y);
    dx = Math.min(dx, this.grid.getWidth() - maxpos.x);
    dy = Math.min(dy, this.grid.getHeight() - maxpos.y);
    _results = [];
    for (_i = 0, _len = cells.length; _i < _len; _i++) {
      c = cells[_i];
      _results.push(this.moveCellTo(c, c.relPos().plus(pos(dx, dy))));
    }
    return _results;
  };

  Quantiser.prototype.moveCellsInDirection = function(cells, direction) {
    var incr;
    if (direction === 'Up' || direction === 'Down') {
      this.moveCellsBy(cells, 0, direction === 'Up' && -this.grid.config.rowHeight || this.grid.config.rowHeight);
    }
    if (direction === 'Left' || direction === 'Right') {
      incr = this.config.state === 'off' && 2 || this.config.steps * this.grid.config.stepWidth;
      return this.moveCellsBy(cells, direction === 'Left' && -incr || incr, 0);
    }
  };

  Quantiser.prototype.cellAddedAt = function(cell, pos) {
    return this.moveCellTo(cell, pos);
  };

  Quantiser.prototype.quantiseMode = function(state) {
    return this.config.mode = state;
  };

  Quantiser.prototype.quantiseSteps = function(state) {
    return this.config.steps = state;
  };

  Quantiser.prototype.state = function(state) {
    return this.config.state = state;
  };

  return Quantiser;

})();


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
        text: '<i class="fa fa-%s"></i>'.fmt(r % 2 && 'circle-o' || r % 4 && 'dot-circle-o' || r % 8 && 'bullseye' || 'circle')
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

  TimeRuler.prototype.onCellDown = function(event) {
    this.getWindow().setStep(event.target.getWidget().config.index);
    return event.stop();
  };

  return TimeRuler;

})(Widget);

//# sourceMappingURL=timeline.js.map
