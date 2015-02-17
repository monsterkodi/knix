
/*

    000000000 00000000  0000000  000000000
       000    000      000          000
       000    0000000   0000000     000
       000    000            000    000
       000    00000000  0000000     000
 */
var Test;

Test = (function() {
  function Test() {}


  /*
  
       0000000  0000000   000   000  000   000  00000000  0000000 000000000  0000000   00000000
      000      000   000  0000  000  0000  000  000      000         000    000   000  000   000
      000      000   000  000 0 000  000 0 000  000000   000         000    000   000  0000000
      000      000   000  000  0000  000  0000  000      000         000    000   000  000   000
       0000000  0000000   000   000  000   000  00000000  0000000    000     0000000   000   000
   */

  Test.connectorBox = function() {
    return knix.get({
      title: 'connector',
      resize: 'horizontal',
      x: 100,
      y: 100,
      children: [
        {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'slider:setValue'
            }, {
              id: 'slider',
              type: 'slider',
              value: 50,
              style: {
                width: '100%'
              }
            }, {
              id: 'value',
              type: 'value',
              format: "%3.0f",
              value: 50,
              style: {
                minWidth: '80px'
              }
            }, {
              type: 'connector',
              signal: 'value:onValue'
            }
          ]
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'slider2:setValue'
            }, {
              id: 'slider2',
              type: 'slider',
              value: 50,
              style: {
                width: '50%'
              }
            }, {
              id: 'slider3',
              type: 'slider',
              value: 0,
              minValue: 20,
              maxValue: 80,
              valueStep: 10,
              style: {
                width: '50%'
              }
            }, {
              type: 'connector',
              signal: 'slider3:onValue'
            }
          ]
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              slot: 'slider4:setValue'
            }, {
              id: 'slider4',
              type: 'slider',
              value: 50,
              valueStep: 20,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              signal: 'slider4:onValue'
            }
          ]
        }, {
          type: 'button',
          text: '<i class="fa fa-cog fa-spin"></i> ok',
          style: {
            clear: 'both'
          },
          onClick: function() {
            return this.getWindow().close();
          }
        }
      ],
      connect: [
        {
          signal: 'slider:onValue',
          slot: 'value:setValue'
        }, {
          signal: 'value:onValue',
          slot: 'slider:setValue'
        }, {
          signal: 'slider2:onValue',
          slot: 'slider3:setValue'
        }, {
          signal: 'slider3:onValue',
          slot: 'slider2:setValue'
        }
      ]
    });
  };

  Test.connectors = function() {
    var b;
    b = knix.get({
      type: 'button',
      text: 'connectors',
      parent: 'menu',
      onClick: function() {
        var a, c, d;
        a = Test.connectorBox();
        b = Test.connectorBox().setPos(pos(200, 400));
        c = Test.connectorBox().setPos(pos(200, 600));
        d = Test.connectorBox().setPos(pos(400, 200));
        return new Connection({
          source: a.connector('value:onValue'),
          target: b.connector('slider2:setValue')
        });
      }
    });
    return b.elem.click();
  };


  /*
  
      00000000    0000000   000000000  000   000
      000   000  000   000     000     000   000
      00000000   000000000     000     000000000
      000        000   000     000     000   000
      000        000   000     000     000   000
   */

  Test.svgPath = function() {
    var end, endHead, pth, start, startHead;
    pth = knix.get({
      type: 'path'
    });
    start = knix.get({
      x: pth.config.start[0],
      y: pth.config.start[1],
      type: 'button',
      path: pth
    });
    end = knix.get({
      x: pth.config.end[0],
      y: pth.config.end[1],
      type: 'button',
      path: pth
    });
    startHead = knix.get({
      x: pth.config.startHead[0],
      y: pth.config.startHead[1],
      type: 'button',
      path: pth,
      style: {
        backgroundColor: '#ff0'
      }
    });
    endHead = knix.get({
      x: pth.config.endHead[0],
      y: pth.config.endHead[1],
      type: 'button',
      path: pth,
      style: {
        backgroundColor: '#f00'
      }
    });
    Drag.create({
      target: start.elem,
      onMove: function(drag, event) {
        var p;
        p = drag.absPos(event);
        return pth.setStart([p.x, p.y]);
      }
    });
    Drag.create({
      target: startHead.elem,
      onMove: function(drag, event) {
        var p;
        p = drag.absPos(event);
        return pth.setStartHead([p.x, p.y]);
      }
    });
    Drag.create({
      target: end.elem,
      onMove: function(drag, event) {
        var p;
        p = drag.absPos(event);
        return pth.setEnd([p.x, p.y]);
      }
    });
    return Drag.create({
      target: endHead.elem,
      onMove: function(drag, event) {
        var p;
        p = drag.absPos(event);
        return pth.setEndHead([p.x, p.y]);
      }
    });
  };


  /*
  
       000   000  00000000  000      000       0000000      0000000   000      000  0000000    00000000  00000000
       000   000  000       000      000      000   000    000        000      000  000   000  000       000   000
       000000000  0000000   000      000      000   000     0000000   000      000  000   000  0000000   0000000
       000   000  000       000      000      000   000          000  000      000  000   000  000       000   000
       000   000  00000000  0000000  0000000   0000000      0000000   0000000  000  0000000    00000000  000   000
   */

  Test.helloSlider = function() {
    var b;
    return b = knix.get({
      type: 'button',
      text: 'hello slider',
      parent: 'menu',
      onClick: function() {
        var w;
        w = knix.get({
          title: 'hello',
          resize: true,
          minWidth: 130,
          center: true,
          children: [
            {
              type: 'slider',
              hasBar: true,
              hasKnob: true,
              valueStep: 5
            }, {
              type: 'value',
              format: "%3.2f",
              valueStep: 21
            }, {
              type: 'button',
              text: 'ok',
              onClick: function() {
                return this.getWindow().close();
              }
            }
          ],
          connect: [
            {
              signal: 'slider:onValue',
              slot: 'value:setValue'
            }
          ]
        });
        return w.resolveSlot('slider:setValue')(33.3);
      }
    });
  };


  /*
  
    0000000   000      000  0000000    00000000  00000000       000   000   0000000   000     000   000  00000000
   000        000      000  000   000  000       000   000      000   000  000   000  000     000   000  000
    0000000   000      000  000   000  0000000   0000000         000 000   000000000  000     000   000  0000000
         000  000      000  000   000  000       000   000         000     000   000  000     000   000  000
    0000000   0000000  000  0000000    00000000  000   000          0      000   000  0000000  0000000   00000000
   */

  Test.sliderAndValue = function() {
    var b;
    return b = knix.get({
      type: 'button',
      text: 'slider & value',
      parent: 'menu',
      onClick: function() {
        return knix.get({
          y: 30,
          minWidth: 200,
          title: 'slider & value',
          resize: 'horizontal',
          children: [
            {
              id: 'slider_1',
              type: 'slider',
              value: 50.0
            }, {
              id: 'slider_2',
              type: 'slider',
              hasKnob: true,
              hasBar: true,
              value: 70.0
            }, {
              id: 'value',
              type: 'value',
              value: 50,
              format: "%3.2f"
            }, {
              type: 'button',
              text: 'ok',
              onClick: function() {
                return this.getWindow().close();
              }
            }
          ],
          connect: [
            {
              signal: 'slider_2:onValue',
              slot: 'value:setValue'
            }, {
              signal: 'value:onValue',
              slot: 'slider_1:setValue'
            }
          ]
        });
      }
    });
  };


  /*
  
       0000000  000000000  0000000    0000000   00000000
      000          000    000   000  000        000
       0000000     000    000000000  000  0000  0000000
            000    000    000   000  000   000  000
       0000000     000    000   000   0000000   00000000
   */

  Test.stageButtons = function() {
    knix.get({
      id: 'slider_3',
      type: 'slider',
      hasKnob: false,
      hasBar: false,
      parent: 'stage_content',
      width: 200,
      x: 150,
      y: 30,
      maxValue: 255,
      connect: [
        {
          signal: 'onValue',
          slot: function(v) {
            var c;
            v = _.arg(v);
            return c = 'rgba(%d,0,0,0.2)'.fmt(v);
          }
        }
      ]
    });
    knix.get({
      parent: 'stage_content',
      type: 'slider',
      hasKnob: true,
      hasBar: true,
      width: 200,
      x: 150,
      y: 60
    });
    knix.get({
      parent: 'stage_content',
      type: 'slider',
      hasKnob: true,
      hasBar: false,
      width: 200,
      x: 150,
      y: 90
    });
    knix.get({
      parent: 'stage_content',
      type: 'value',
      width: 200,
      x: 150,
      y: 120
    });
    return knix.get({
      parent: 'stage_content',
      type: 'button',
      text: 'del',
      width: 200,
      x: 150,
      y: 150,
      onClick: knix.closeAll
    });
  };

  return Test;

})();


/*

    00     00   0000000   000  000   000
    000   000  000   000  000  0000  000
    000000000  000000000  000  000 0 000
    000 0 000  000   000  000  000  0000
    000   000  000   000  000  000   000
 */

document.observe("dom:loaded", function() {
  var an, g1, g2, g3, gm, o1, o2, o3;
  knix.init({
    console: true
  });
  o1 = new Oscillator({
    title: 'high',
    minFreq: 2000,
    x: 10,
    y: 40
  });
  o2 = new Oscillator({
    title: 'mid',
    minFreq: 400,
    maxFreq: 2000,
    freq: 400,
    x: 10,
    y: 240
  });
  o3 = new Oscillator({
    title: 'low',
    minFreq: 1,
    maxFreq: 400,
    freq: 200,
    shape: 'triangle',
    x: 10,
    y: 440
  });
  g1 = new Gain({
    gain: 0.0,
    x: 100,
    y: 142
  });
  g2 = new Gain({
    gain: 0.0,
    x: 100,
    y: 342
  });
  g3 = new Gain({
    gain: 0.3,
    x: 100,
    y: 542
  });
  an = new Analyser({
    width: 500,
    height: 300,
    x: 400,
    y: 42
  });
  gm = new Gain({
    master: true,
    gain: 0.0,
    x: 400,
    y: 544
  });
  new Connection({
    source: o1.connector('audio:out'),
    target: g1.connector('audio:in')
  });
  new Connection({
    source: o2.connector('audio:out'),
    target: g2.connector('audio:in')
  });
  new Connection({
    source: o3.connector('audio:out'),
    target: g3.connector('audio:in')
  });
  new Connection({
    source: g1.connector('audio:out'),
    target: an.connector('audio:in')
  });
  new Connection({
    source: g2.connector('audio:out'),
    target: an.connector('audio:in')
  });
  new Connection({
    source: g3.connector('audio:out'),
    target: an.connector('audio:in')
  });
  new Connection({
    source: an.connector('audio:out'),
    target: gm.connector('audio:in')
  });
});

//# sourceMappingURL=main.js.map
