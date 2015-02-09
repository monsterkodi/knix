var Test;

Test = (function() {
  function Test() {}

  Test.connectorBox = function() {
    return knix.get({
      title: 'connector',
      hasSize: true,
      minWidth: 200,
      minHeight: 150,
      x: 100,
      y: 100,
      children: [
        {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              "class": 'slot'
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
              "class": 'signal'
            }
          ]
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              "class": 'slot'
            }, {
              id: 'slider2',
              type: 'slider',
              value: 50,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              "class": 'signal'
            }
          ]
        }, {
          type: 'hbox',
          children: [
            {
              type: 'connector',
              "class": 'slot'
            }, {
              id: 'slider3',
              type: 'slider',
              value: 50,
              style: {
                width: '100%'
              }
            }, {
              type: 'connector',
              "class": 'signal'
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
        }
      ]
    });
  };

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

  Test.sliderHello = function() {
    var b;
    b = knix.get({
      type: 'button',
      text: 'slider hello',
      parent: 'menu',
      onClick: function() {
        knix.get({
          title: 'hello',
          hasSize: true,
          minWidth: 130,
          center: true,
          children: [
            {
              id: 'slider',
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
              slot: 'setValue'
            }
          ]
        });
        return $('slider').widget.setValue(33.3);
      }
    });
    return b.elem.click();
  };

  Test.sliderAndValue = function() {
    var b;
    b = knix.get({
      type: 'button',
      text: 'slider & value',
      parent: 'menu',
      onClick: function() {
        return knix.get({
          y: 30,
          title: 'slider & value',
          hasSize: true,
          width: 150,
          minWidth: 150,
          minHeight: 150,
          maxHeight: 150,
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
              type: 'relative',
              child: {
                type: 'button',
                text: 'ok',
                "class": 'top-right',
                onClick: function() {
                  return this.getWindow().close();
                }
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
    return b.elem.click();
  };

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
            v = this.slotArg(v);
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

document.observe("dom:loaded", function() {
  var c, wid;
  wid = knix.init();
  c = new Console();
  Test.connectorBox();
  Test.connectorBox().setPos(pos(200, 400));
  Test.connectorBox().setPos(pos(200, 600));
  Test.connectorBox().setPos(pos(400, 200));
  c.raise();
});

//# sourceMappingURL=main.js.map
