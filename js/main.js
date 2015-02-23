
/*

000000000  00000000   0000000  000000000
   000     000       000          000   
   000     0000000   0000000      000   
   000     000            000     000   
   000     00000000  0000000      000
 */
var Test;

Test = (function() {
  function Test() {}


  /*
  
   0000000   000   000  0000000    000   0000000 
  000   000  000   000  000   000  000  000   000
  000000000  000   000  000   000  000  000   000
  000   000  000   000  000   000  000  000   000
  000   000   0000000   0000000    000   0000000
   */

  Test.delayNodes = function() {
    var a1, a2, d1, g1, g2, gm, o1;
    o1 = new Oscillator({
      title: 'low',
      minFreq: 1,
      maxFreq: 1000,
      freq: 333,
      shape: 'sine',
      x: 20,
      y: 50
    });
    g1 = new Gain({
      gain: 0.5,
      x: 20,
      y: 200
    });
    a1 = new Analyser({
      x: 300,
      y: 42
    });
    a2 = new Analyser({
      x: 300,
      y: 350
    });
    d1 = new Delay({
      x: 830,
      y: 42,
      delay: 5,
      maxDelay: 10
    });
    g2 = new Gain({
      gain: 0.5,
      x: 830,
      y: 200
    });
    gm = new Gain({
      master: true,
      gain: 0.0,
      x: 300,
      y: 650
    });
    new Connection({
      source: o1.connector('audio:out'),
      target: g1.connector('audio:in')
    });
    new Connection({
      source: g1.connector('audio:out'),
      target: a1.connector('audio:in')
    });
    new Connection({
      source: a1.connector('audio:out'),
      target: d1.connector('audio:in')
    });
    new Connection({
      source: a1.connector('audio:out'),
      target: g2.connector('audio:in')
    });
    new Connection({
      source: d1.connector('audio:out'),
      target: g2.connector('audio:in')
    });
    new Connection({
      source: g2.connector('audio:out'),
      target: a2.connector('audio:in')
    });
    new Connection({
      source: a2.connector('audio:out'),
      target: gm.connector('audio:in')
    });
  };

  Test.audioNodes = function() {
    var a4, an, f4, g1, g2, g3, gm, o1, o2, o3;
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
      freq: 333,
      shape: 'square',
      x: 10,
      y: 440
    });
    g1 = new Gain({
      gain: 0.0,
      x: 250,
      y: 40
    });
    g2 = new Gain({
      gain: 0.0,
      x: 250,
      y: 240
    });
    g3 = new Gain({
      gain: 0.3,
      x: 250,
      y: 440
    });
    an = new Analyser({
      x: 500,
      y: 42
    });
    f4 = new Filter({
      x: 1050,
      y: 42
    });
    a4 = new Analyser({
      x: 500,
      y: 400
    });
    gm = new Gain({
      master: true,
      gain: 0.0,
      x: 1050,
      y: 400
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
      target: f4.connector('audio:in')
    });
    new Connection({
      source: f4.connector('audio:out'),
      target: a4.connector('audio:in')
    });
    new Connection({
      source: a4.connector('audio:out'),
      target: gm.connector('audio:in')
    });
  };

  Test.audio = function() {
    var a, b;
    a = knix.get({
      type: 'button',
      text: 'audio',
      parent: 'menu',
      onClick: function() {
        return Test.audioNodes();
      }
    });
    b = knix.get({
      type: 'button',
      text: 'delay',
      parent: 'menu',
      onClick: function() {
        return Test.delayNodes();
      }
    });
    return a.elem.click();
  };


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
  knix.init({
    console: 'shade'
  });
  Test.audio();
  return {
    "windows": [
      {
        "gain": 0,
        "x": 100,
        "y": 142,
        "title": "gain",
        "minWidth": 240,
        "resize": "horizontal",
        "children": [
          {
            "type": "jacks",
            "audio": {},
            "hasOutput": true,
            "children": [
              {
                "type": "connector",
                "in": "audio",
                "audio": {},
                "class": "in",
                "noMove": true,
                "elem": "div",
                "id": "connector.cddfcf1f-b13b-4089-83b8-99c67d2337a4",
                "parentId": "jacks.72ecb47b-b1ca-42c5-9801-fcba06735c7a"
              }, {
                "type": "jack_content",
                "style": {
                  "width": "100%",
                  "height": "20px"
                },
                "elem": "div",
                "id": "jack_content.4585dbd0-e3cf-435b-827d-fedffc94a0f4",
                "parentId": "jacks.72ecb47b-b1ca-42c5-9801-fcba06735c7a"
              }, {
                "type": "connector",
                "out": "audio",
                "audio": {},
                "class": "out",
                "noMove": true,
                "elem": "div",
                "id": "connector.b593feeb-fd45-44f2-ba80-92a17e775bac",
                "parentId": "jacks.72ecb47b-b1ca-42c5-9801-fcba06735c7a"
              }
            ],
            "spacing": 5,
            "style": {
              "display": "table",
              "borderSpacing": "5px 0px",
              "marginRight": "-5px",
              "marginLeft": "-5px"
            },
            "elem": "div",
            "id": "jacks.72ecb47b-b1ca-42c5-9801-fcba06735c7a",
            "parentId": "content.0401e425-5477-4e85-bc4c-89c3bb7091a6"
          }, {
            "type": "sliderspin",
            "id": "gain",
            "value": 0,
            "minValue": 0,
            "maxValue": 1,
            "children": [
              {
                "type": "connector",
                "slot": "gain:setValue",
                "class": "slot",
                "noMove": true,
                "elem": "div",
                "id": "connector.ff1b42d7-26af-4324-9e1d-e7423f157c79",
                "parentId": "gain"
              }, {
                "type": "slider",
                "id": "gain_slider",
                "value": 0,
                "minValue": 0,
                "maxValue": 1,
                "style": {
                  "width": "90%"
                },
                "minWidth": 50,
                "child": {
                  "type": "slider-bar",
                  "child": {
                    "type": "slider-knob",
                    "elem": "div",
                    "id": "slider-knob.7208098f-ff1d-411e-9004-2d16b7cebaf7",
                    "parentId": "slider-bar.3efa9e1f-b063-4b4a-a514-38db71f05330"
                  },
                  "elem": "div",
                  "id": "slider-bar.3efa9e1f-b063-4b4a-a514-38db71f05330",
                  "parentId": "gain_slider"
                },
                "noMove": true,
                "elem": "div",
                "parentId": "gain"
              }, {
                "type": "spin",
                "id": "gain",
                "value": 0,
                "minValue": 0,
                "maxValue": 1,
                "valueStep": 0.01,
                "minWidth": 100,
                "format": "%3.2f",
                "style": {
                  "width": "10%"
                },
                "horizontal": true,
                "child": {
                  "elem": "table",
                  "type": "spin-table",
                  "child": {
                    "elem": "tr",
                    "type": "spin-row",
                    "children": [
                      {
                        "elem": "td",
                        "type": "spin-td",
                        "child": {
                          "type": "icon",
                          "icon": "octicon-triangle-left",
                          "child": {
                            "elem": "span",
                            "type": "octicon",
                            "class": "octicon-triangle-left",
                            "id": "octicon.a03d53b6-3d16-4be3-83d8-a0c6d3833897",
                            "parentId": "icon.e806e807-251e-4404-a378-df33c05b70ff"
                          },
                          "elem": "div",
                          "id": "icon.e806e807-251e-4404-a378-df33c05b70ff",
                          "parentId": "spin-td.3a6dd626-15b8-4522-8a59-e46fc39740ec"
                        },
                        "id": "spin-td.3a6dd626-15b8-4522-8a59-e46fc39740ec",
                        "parentId": "spin-row.301e9928-76ed-412b-a7bc-7e868b7ee4bc"
                      }, {
                        "elem": "td",
                        "type": "spin-content",
                        "child": {
                          "type": "input",
                          "class": "spin-input",
                          "elem": "input",
                          "id": "input.384e5897-b88f-484f-8ec3-fe152fc12913",
                          "parentId": "spin-content.5b27a5e4-f9e8-4771-8a07-76694688128d"
                        },
                        "id": "spin-content.5b27a5e4-f9e8-4771-8a07-76694688128d",
                        "parentId": "spin-row.301e9928-76ed-412b-a7bc-7e868b7ee4bc"
                      }, {
                        "elem": "td",
                        "type": "spin-td",
                        "child": {
                          "type": "icon",
                          "icon": "octicon-triangle-right",
                          "child": {
                            "elem": "span",
                            "type": "octicon",
                            "class": "octicon-triangle-right",
                            "id": "octicon.2f5ab0e0-6933-43f3-b998-f4b08459bf6d",
                            "parentId": "icon.7ee540a0-f1a3-459e-bbd3-00ec236a526f"
                          },
                          "elem": "div",
                          "id": "icon.7ee540a0-f1a3-459e-bbd3-00ec236a526f",
                          "parentId": "spin-td.e51332d9-16c1-4838-8c93-74a658d3f13d"
                        },
                        "id": "spin-td.e51332d9-16c1-4838-8c93-74a658d3f13d",
                        "parentId": "spin-row.301e9928-76ed-412b-a7bc-7e868b7ee4bc"
                      }
                    ],
                    "id": "spin-row.301e9928-76ed-412b-a7bc-7e868b7ee4bc",
                    "parentId": "spin-table.acb38a0c-b9c0-429d-b7c3-dd078ef61524"
                  },
                  "id": "spin-table.acb38a0c-b9c0-429d-b7c3-dd078ef61524",
                  "parentId": "gain"
                },
                "noMove": true,
                "elem": "div",
                "parentId": "gain"
              }, {
                "type": "connector",
                "signal": "gain:onValue",
                "class": "signal",
                "noMove": true,
                "elem": "div",
                "id": "connector.a3fa311e-8972-4ed4-80c6-c5d6ac059fb7",
                "parentId": "gain"
              }
            ],
            "spacing": 5,
            "style": {
              "display": "table",
              "borderSpacing": "5px 0px",
              "marginRight": "-5px",
              "marginLeft": "-5px"
            },
            "elem": "div",
            "parentId": "content.0401e425-5477-4e85-bc4c-89c3bb7091a6"
          }
        ],
        "child": null,
        "type": "window",
        "parent": "stage_content",
        "hasClose": true,
        "hasShade": true,
        "isMovable": true,
        "isShaded": false,
        "elem": "div",
        "id": "window.eaeca209-7b8b-4395-9973-b1a9cb9d4934",
        "parentId": "stage_content"
      }, {
        "x": 600,
        "y": 42,
        "delay": 0.005,
        "maxDelay": 5,
        "minDelay": 0,
        "title": "delay",
        "minWidth": 240,
        "resize": "horizontal",
        "children": [
          {
            "type": "jacks",
            "audio": {},
            "children": [
              {
                "type": "connector",
                "in": "audio",
                "audio": {},
                "class": "in",
                "noMove": true,
                "elem": "div",
                "id": "connector.b2bb8680-8093-4015-92e5-c61e65750740",
                "parentId": "jacks.85328b61-f6b2-414d-b8a0-bc3aa0443404"
              }, {
                "type": "jack_content",
                "style": {
                  "width": "100%",
                  "height": "20px"
                },
                "elem": "div",
                "id": "jack_content.22aa641d-d642-402d-9a86-892923ef0adc",
                "parentId": "jacks.85328b61-f6b2-414d-b8a0-bc3aa0443404"
              }, {
                "type": "connector",
                "out": "audio",
                "audio": {},
                "class": "out",
                "noMove": true,
                "elem": "div",
                "id": "connector.10a1bde2-353a-40e8-a8b9-498dbe98bf79",
                "parentId": "jacks.85328b61-f6b2-414d-b8a0-bc3aa0443404"
              }
            ],
            "spacing": 5,
            "style": {
              "display": "table",
              "borderSpacing": "5px 0px",
              "marginRight": "-5px",
              "marginLeft": "-5px"
            },
            "elem": "div",
            "id": "jacks.85328b61-f6b2-414d-b8a0-bc3aa0443404",
            "parentId": "content.91fd5c6d-d73b-484a-bd58-3b0adb2a9273"
          }, {
            "type": "sliderspin",
            "id": "delay",
            "value": 0.8153846153846154,
            "minValue": 0,
            "maxValue": 5,
            "spinStep": 0.00001,
            "spinFormat": "%3.5f",
            "children": [
              {
                "type": "connector",
                "slot": "delay:setValue",
                "class": "slot",
                "noMove": true,
                "elem": "div",
                "id": "connector.4860cbdb-9019-4e8c-b80c-4094dc3316db",
                "parentId": "delay"
              }, {
                "type": "slider",
                "id": "delay_slider",
                "value": 0.8153800000000001,
                "minValue": 0,
                "maxValue": 5,
                "style": {
                  "width": "90%"
                },
                "minWidth": 50,
                "child": {
                  "type": "slider-bar",
                  "child": {
                    "type": "slider-knob",
                    "elem": "div",
                    "id": "slider-knob.07f30356-7a2f-4d66-a5fd-cad99bb60621",
                    "parentId": "slider-bar.f3e0bdc1-ac87-41fa-bc70-37d6fcd26e7f"
                  },
                  "elem": "div",
                  "id": "slider-bar.f3e0bdc1-ac87-41fa-bc70-37d6fcd26e7f",
                  "parentId": "delay_slider"
                },
                "noMove": true,
                "elem": "div",
                "parentId": "delay"
              }, {
                "type": "spin",
                "id": "delay",
                "value": 0.8153800000000001,
                "minValue": 0,
                "maxValue": 5,
                "valueStep": 0.00001,
                "minWidth": 100,
                "format": "%3.5f",
                "style": {
                  "width": "10%"
                },
                "horizontal": true,
                "child": {
                  "elem": "table",
                  "type": "spin-table",
                  "child": {
                    "elem": "tr",
                    "type": "spin-row",
                    "children": [
                      {
                        "elem": "td",
                        "type": "spin-td",
                        "child": {
                          "type": "icon",
                          "icon": "octicon-triangle-left",
                          "child": {
                            "elem": "span",
                            "type": "octicon",
                            "class": "octicon-triangle-left",
                            "id": "octicon.2cad265e-c402-46df-b703-927b78dd5eac",
                            "parentId": "icon.aa690f81-e709-465f-a2b1-4ba4a8f1acb4"
                          },
                          "elem": "div",
                          "id": "icon.aa690f81-e709-465f-a2b1-4ba4a8f1acb4",
                          "parentId": "spin-td.0b9f8007-08f3-4b27-bb05-5ab2b6bb4d32"
                        },
                        "id": "spin-td.0b9f8007-08f3-4b27-bb05-5ab2b6bb4d32",
                        "parentId": "spin-row.d9c86e18-3cea-4ff4-aff3-44af3dcf4c6f"
                      }, {
                        "elem": "td",
                        "type": "spin-content",
                        "child": {
                          "type": "input",
                          "class": "spin-input",
                          "elem": "input",
                          "id": "input.ba09bbb9-da8f-43c6-824b-7d0ecdfeddd1",
                          "parentId": "spin-content.d5247dc0-d6cd-45ec-ac91-80f62a4d1dae"
                        },
                        "id": "spin-content.d5247dc0-d6cd-45ec-ac91-80f62a4d1dae",
                        "parentId": "spin-row.d9c86e18-3cea-4ff4-aff3-44af3dcf4c6f"
                      }, {
                        "elem": "td",
                        "type": "spin-td",
                        "child": {
                          "type": "icon",
                          "icon": "octicon-triangle-right",
                          "child": {
                            "elem": "span",
                            "type": "octicon",
                            "class": "octicon-triangle-right",
                            "id": "octicon.c46091fd-008c-4502-8a02-4e91f936b0f0",
                            "parentId": "icon.b86e3619-6230-4d73-8c21-160f28d19f92"
                          },
                          "elem": "div",
                          "id": "icon.b86e3619-6230-4d73-8c21-160f28d19f92",
                          "parentId": "spin-td.625bad26-7221-4325-98fe-5f282d6a03fe"
                        },
                        "id": "spin-td.625bad26-7221-4325-98fe-5f282d6a03fe",
                        "parentId": "spin-row.d9c86e18-3cea-4ff4-aff3-44af3dcf4c6f"
                      }
                    ],
                    "id": "spin-row.d9c86e18-3cea-4ff4-aff3-44af3dcf4c6f",
                    "parentId": "spin-table.bc4b924a-da9f-407e-bffb-8c788b1ee16b"
                  },
                  "id": "spin-table.bc4b924a-da9f-407e-bffb-8c788b1ee16b",
                  "parentId": "delay"
                },
                "noMove": true,
                "elem": "div",
                "parentId": "delay"
              }, {
                "type": "connector",
                "signal": "delay:onValue",
                "class": "signal",
                "noMove": true,
                "elem": "div",
                "id": "connector.a2aed23b-7be6-453f-9b67-dd692eb19a3b",
                "parentId": "delay"
              }
            ],
            "spacing": 5,
            "style": {
              "display": "table",
              "borderSpacing": "5px 0px",
              "marginRight": "-5px",
              "marginLeft": "-5px"
            },
            "elem": "div",
            "parentId": "content.91fd5c6d-d73b-484a-bd58-3b0adb2a9273"
          }
        ],
        "child": null,
        "type": "window",
        "parent": "stage_content",
        "hasClose": true,
        "hasShade": true,
        "isMovable": true,
        "isShaded": false,
        "elem": "div",
        "id": "window.4a908d7a-22a4-4cb0-bff3-ad4c3eaab33f",
        "parentId": "stage_content"
      }, {
        "title": "low",
        "minFreq": 1,
        "maxFreq": 1000,
        "freq": 333,
        "shape": "sine",
        "x": 10,
        "y": 440,
        "minWidth": 150,
        "resize": "horizontal",
        "children": [
          {
            "type": "jacks",
            "audio": {},
            "hasInput": false,
            "children": [
              {
                "type": "jack_content",
                "style": {
                  "width": "100%",
                  "height": "20px"
                },
                "elem": "div",
                "id": "jack_content.187ff704-0759-40e1-b9a3-b4129c7a27f6",
                "parentId": "jacks.4ab060d6-fd89-4667-a6c5-685a1feb7ee0"
              }, {
                "type": "connector",
                "out": "audio",
                "audio": {},
                "class": "out",
                "noMove": true,
                "elem": "div",
                "id": "connector.267fbcb8-bb64-46da-b5de-912cd140993f",
                "parentId": "jacks.4ab060d6-fd89-4667-a6c5-685a1feb7ee0"
              }
            ],
            "spacing": 5,
            "style": {
              "display": "table",
              "borderSpacing": "5px 0px",
              "marginRight": "-5px",
              "marginLeft": "-5px"
            },
            "elem": "div",
            "id": "jacks.4ab060d6-fd89-4667-a6c5-685a1feb7ee0",
            "parentId": "content.ed915ed4-4e40-45f0-9afa-9ad42caa72ae"
          }, {
            "type": "spinner",
            "id": "shape",
            "value": 0,
            "values": ["sine", "triangle", "sawtooth", "square"],
            "tooltip": false,
            "valueStep": 1,
            "minValue": 0,
            "maxValue": 3,
            "horizontal": true,
            "child": {
              "elem": "table",
              "type": "spin-table",
              "child": {
                "elem": "tr",
                "type": "spin-row",
                "children": [
                  {
                    "elem": "td",
                    "type": "spin-td",
                    "child": {
                      "type": "icon",
                      "icon": "octicon-triangle-left",
                      "child": {
                        "elem": "span",
                        "type": "octicon",
                        "class": "octicon-triangle-left",
                        "id": "octicon.e2d13741-25a6-46db-9315-acbeb4529619",
                        "parentId": "icon.811a6bdd-4fd0-45ca-a70d-830656d3cf08"
                      },
                      "elem": "div",
                      "id": "icon.811a6bdd-4fd0-45ca-a70d-830656d3cf08",
                      "parentId": "spin-td.1e2f721a-0bea-44c0-b658-a52f0a5c5f8d"
                    },
                    "id": "spin-td.1e2f721a-0bea-44c0-b658-a52f0a5c5f8d",
                    "parentId": "spin-row.60e287a0-d083-4969-b250-b2b5528b1d8b"
                  }, {
                    "elem": "td",
                    "type": "spin-content",
                    "child": {
                      "type": "input",
                      "class": "spin-input",
                      "elem": "input",
                      "id": "input.f58f73d0-97de-41d1-b35a-067969d45f47",
                      "parentId": "spin-content.8fa6ec1b-ff54-465f-a320-f5f2afabd547"
                    },
                    "id": "spin-content.8fa6ec1b-ff54-465f-a320-f5f2afabd547",
                    "parentId": "spin-row.60e287a0-d083-4969-b250-b2b5528b1d8b"
                  }, {
                    "elem": "td",
                    "type": "spin-td",
                    "child": {
                      "type": "icon",
                      "icon": "octicon-triangle-right",
                      "child": {
                        "elem": "span",
                        "type": "octicon",
                        "class": "octicon-triangle-right",
                        "id": "octicon.d37ed984-ff51-4c00-9e90-5f792e6ff873",
                        "parentId": "icon.2f4124ec-2b8b-4092-9a13-e76ff5144d76"
                      },
                      "elem": "div",
                      "id": "icon.2f4124ec-2b8b-4092-9a13-e76ff5144d76",
                      "parentId": "spin-td.78f32e70-e77a-4457-8b7e-a8bfcb6c61c8"
                    },
                    "id": "spin-td.78f32e70-e77a-4457-8b7e-a8bfcb6c61c8",
                    "parentId": "spin-row.60e287a0-d083-4969-b250-b2b5528b1d8b"
                  }
                ],
                "id": "spin-row.60e287a0-d083-4969-b250-b2b5528b1d8b",
                "parentId": "spin-table.bfc68c92-052d-4ca8-a054-458dee75c893"
              },
              "id": "spin-table.bfc68c92-052d-4ca8-a054-458dee75c893",
              "parentId": "shape"
            },
            "noMove": true,
            "elem": "div",
            "parentId": "content.ed915ed4-4e40-45f0-9afa-9ad42caa72ae"
          }, {
            "type": "sliderspin",
            "id": "frequency",
            "value": 333,
            "minValue": 1,
            "maxValue": 1000,
            "children": [
              {
                "type": "connector",
                "slot": "frequency:setValue",
                "class": "slot",
                "noMove": true,
                "elem": "div",
                "id": "connector.9d98d81a-3d2e-4111-8993-11279f62cd97",
                "parentId": "frequency"
              }, {
                "type": "slider",
                "id": "frequency_slider",
                "value": 333,
                "minValue": 1,
                "maxValue": 1000,
                "style": {
                  "width": "90%"
                },
                "minWidth": 50,
                "child": {
                  "type": "slider-bar",
                  "child": {
                    "type": "slider-knob",
                    "elem": "div",
                    "id": "slider-knob.45b1d89e-2875-437c-b0ee-141c1718b2ef",
                    "parentId": "slider-bar.230b4a36-a2d0-4c16-9b0b-b31ea6843b81"
                  },
                  "elem": "div",
                  "id": "slider-bar.230b4a36-a2d0-4c16-9b0b-b31ea6843b81",
                  "parentId": "frequency_slider"
                },
                "noMove": true,
                "elem": "div",
                "parentId": "frequency"
              }, {
                "type": "spin",
                "id": "frequency",
                "value": 333,
                "minValue": 1,
                "maxValue": 1000,
                "valueStep": 1,
                "minWidth": 100,
                "format": "%3.2f",
                "style": {
                  "width": "10%"
                },
                "horizontal": true,
                "child": {
                  "elem": "table",
                  "type": "spin-table",
                  "child": {
                    "elem": "tr",
                    "type": "spin-row",
                    "children": [
                      {
                        "elem": "td",
                        "type": "spin-td",
                        "child": {
                          "type": "icon",
                          "icon": "octicon-triangle-left",
                          "child": {
                            "elem": "span",
                            "type": "octicon",
                            "class": "octicon-triangle-left",
                            "id": "octicon.b4708b7f-ee39-4426-a6d4-9754fd744577",
                            "parentId": "icon.f7ba08bd-7029-4c64-b244-6eeff5841c9b"
                          },
                          "elem": "div",
                          "id": "icon.f7ba08bd-7029-4c64-b244-6eeff5841c9b",
                          "parentId": "spin-td.a578066b-5c0c-4f4f-87ac-3529b5d8ba5c"
                        },
                        "id": "spin-td.a578066b-5c0c-4f4f-87ac-3529b5d8ba5c",
                        "parentId": "spin-row.2ea2a607-a51d-4d35-9aa9-505f09a7f59f"
                      }, {
                        "elem": "td",
                        "type": "spin-content",
                        "child": {
                          "type": "input",
                          "class": "spin-input",
                          "elem": "input",
                          "id": "input.270bb054-f6d9-4b82-9d45-bac041b8013f",
                          "parentId": "spin-content.b99417e4-5006-4b1e-90bc-defebf2f0446"
                        },
                        "id": "spin-content.b99417e4-5006-4b1e-90bc-defebf2f0446",
                        "parentId": "spin-row.2ea2a607-a51d-4d35-9aa9-505f09a7f59f"
                      }, {
                        "elem": "td",
                        "type": "spin-td",
                        "child": {
                          "type": "icon",
                          "icon": "octicon-triangle-right",
                          "child": {
                            "elem": "span",
                            "type": "octicon",
                            "class": "octicon-triangle-right",
                            "id": "octicon.b9b6fd3e-dcec-4c3a-8cc3-1f5b4079a486",
                            "parentId": "icon.39fb731e-4e01-4553-a5b0-537f79e7fcec"
                          },
                          "elem": "div",
                          "id": "icon.39fb731e-4e01-4553-a5b0-537f79e7fcec",
                          "parentId": "spin-td.37a68b48-d1d4-430c-a1be-57be4e73a004"
                        },
                        "id": "spin-td.37a68b48-d1d4-430c-a1be-57be4e73a004",
                        "parentId": "spin-row.2ea2a607-a51d-4d35-9aa9-505f09a7f59f"
                      }
                    ],
                    "id": "spin-row.2ea2a607-a51d-4d35-9aa9-505f09a7f59f",
                    "parentId": "spin-table.9ed1e2b3-3f3f-46cb-a958-7b70372684c9"
                  },
                  "id": "spin-table.9ed1e2b3-3f3f-46cb-a958-7b70372684c9",
                  "parentId": "frequency"
                },
                "noMove": true,
                "elem": "div",
                "parentId": "frequency"
              }, {
                "type": "connector",
                "signal": "frequency:onValue",
                "class": "signal",
                "noMove": true,
                "elem": "div",
                "id": "connector.1ea4af33-9b7e-481c-bb23-675e0f8c9ee3",
                "parentId": "frequency"
              }
            ],
            "spacing": 5,
            "style": {
              "display": "table",
              "borderSpacing": "5px 0px",
              "marginRight": "-5px",
              "marginLeft": "-5px"
            },
            "elem": "div",
            "parentId": "content.ed915ed4-4e40-45f0-9afa-9ad42caa72ae"
          }
        ],
        "child": null,
        "type": "window",
        "parent": "stage_content",
        "hasClose": true,
        "hasShade": true,
        "isMovable": true,
        "isShaded": false,
        "elem": "div",
        "id": "window.5eda8e8f-142c-4769-8d6f-666766c3b6a3",
        "parentId": "stage_content"
      }
    ],
    "connections": [["connector.267fbcb8-bb64-46da-b5de-912cd140993f", "connector.cddfcf1f-b13b-4089-83b8-99c67d2337a4"], ["connector.b593feeb-fd45-44f2-ba80-92a17e775bac", "connector.b2bb8680-8093-4015-92e5-c61e65750740"], ["connector.1ea4af33-9b7e-481c-bb23-675e0f8c9ee3", "connector.ff1b42d7-26af-4324-9e1d-e7423f157c79"], ["connector.a3fa311e-8972-4ed4-80c6-c5d6ac059fb7", "connector.4860cbdb-9019-4e8c-b80c-4094dc3316db"], ["connector.a2aed23b-7be6-453f-9b67-dd692eb19a3b", "connector.9d98d81a-3d2e-4111-8993-11279f62cd97"]]
  };
});

//# sourceMappingURL=main.js.map
