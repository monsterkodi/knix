document.observe("dom:loaded", function() {
  var p, set, svg, wid;
  wid = knix;
  wid.init();
  svg = wid.get({
    id: 'stage_svg',
    type: 'svg'
  });
  set = svg.s.set();
  p = svg.s.path();
  p.M(100, 100).Q(200, 100, 200, 200).Q(200, 300, 300, 300);
  set.add(p);
  set.attr({
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });
  set.stroke({
    color: "rgba(255,150,0,0.2)",
    width: 16
  }).fill('none');
  wid.get({
    type: 'button',
    id: 'hello',
    text: 'hello',
    parent: 'menu',
    onClick: function() {
      log('hello!');
      return wid.get({
        y: 30,
        title: 'hello',
        hasSize: true,
        width: 130,
        minWidth: 130,
        minHeight: 150,
        maxHeight: 150,
        children: [
          {
            id: 'slider_1',
            type: 'slider',
            value: 50.0,
            valueStep: 10
          }, {
            id: 'slider_2',
            type: 'slider',
            hasKnob: true,
            hasBar: true,
            value: 70.0,
            valueMin: 0.0,
            valueMax: 100.0,
            valueStep: 1
          }, {
            type: 'value',
            value: 50,
            valueMin: -20,
            valueMax: 80,
            valueStep: 1,
            format: "%3.2f",
            connect: [
              {
                signal: 'slider_2:onValue',
                slot: 'setValue'
              }, {
                signal: 'onValue',
                slot: 'slider_1:setValue'
              }
            ]
          }, {
            type: 'relative',
            children: [
              {
                type: 'button',
                text: 'ok',
                "class": 'top-left',
                onClick: function() {
                  return this.getWindow().getChild('no').close();
                }
              }, {
                type: 'button',
                id: 'no',
                text: 'no',
                "class": 'top-right',
                onClick: function() {
                  return this.getWindow().close();
                }
              }
            ]
          }
        ]
      });
    }
  });
  this.stageButtons = function() {
    wid.get({
      id: 'slider_3',
      type: 'slider',
      hasKnob: false,
      hasBar: false,
      width: 200,
      x: 150,
      y: 30,
      valueMin: 0,
      valueMax: 255,
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
    wid.get({
      type: 'slider',
      hasKnob: true,
      hasBar: true,
      width: 200,
      x: 150,
      y: 60
    });
    wid.get({
      type: 'slider',
      hasKnob: true,
      hasBar: false,
      width: 200,
      x: 150,
      y: 90
    });
    wid.get({
      type: 'value',
      width: 200,
      x: 150,
      y: 120
    });
    return wid.get({
      type: 'button',
      text: 'del',
      width: 200,
      x: 150,
      y: 150,
      onClick: wid.closeAll
    });
  };
  wid.get({
    type: 'button',
    text: 'del',
    parent: 'footer',
    onClick: function() {
      return wid.closeAll();
    }
  });
  $('hello').click();
  Console.menu();
  Console.create();
  document.stageButtons();
});

//# sourceMappingURL=main.js.map
