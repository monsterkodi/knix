###

00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000

###

document.observe "dom:loaded", ->

    # _________________________________________________________________________ init

    knix.init
        console: true
        # console: 'shade'

    # _________________________________________________________________________ widget test

    # Test.connectors()
    # Test.stageButtons()
    # Test.helloSlider()
    # Test.sliderAndValue()
    # Test.svgPath()
    Test.audio()

    # StyleSwitch.toggle()
    # $('show_about').click()

    windows = \
        [
            {
                "title": "high",
                "minFreq": 2000,
                "x": 10,
                "y": 40,
                "freq": 0,
                "maxFreq": 14000,
                "minWidth": 150,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasInput": false
                    },
                    {
                        "type": "spinner",
                        "id": "shape",
                        "value": 0,
                        "values": [
                            "sine",
                            "triangle",
                            "sawtooth",
                            "square"
                        ]
                    },
                    {
                        "type": "sliderspin",
                        "id": "frequency",
                        "value": 0,
                        "minValue": 2000,
                        "maxValue": 14000
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "title": "mid",
                "minFreq": 400,
                "maxFreq": 2000,
                "freq": 400,
                "x": 10,
                "y": 240,
                "minWidth": 150,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasInput": false
                    },
                    {
                        "type": "spinner",
                        "id": "shape",
                        "value": 0,
                        "values": [
                            "sine",
                            "triangle",
                            "sawtooth",
                            "square"
                        ]
                    },
                    {
                        "type": "sliderspin",
                        "id": "frequency",
                        "value": 400,
                        "minValue": 400,
                        "maxValue": 2000
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "title": "low",
                "minFreq": 1,
                "maxFreq": 400,
                "freq": 333,
                "shape": "square",
                "x": 10,
                "y": 440,
                "minWidth": 150,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasInput": false
                    },
                    {
                        "type": "spinner",
                        "id": "shape",
                        "value": 3,
                        "values": [
                            "sine",
                            "triangle",
                            "sawtooth",
                            "square"
                        ]
                    },
                    {
                        "type": "sliderspin",
                        "id": "frequency",
                        "value": 333,
                        "minValue": 1,
                        "maxValue": 400
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "gain": 0,
                "x": 100,
                "y": 142,
                "title": "gain",
                "minWidth": 240,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasOutput": true
                    },
                    {
                        "type": "sliderspin",
                        "id": "gain",
                        "value": 0,
                        "minValue": 0,
                        "maxValue": 1
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "gain": 0,
                "x": 100,
                "y": 342,
                "title": "gain",
                "minWidth": 240,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasOutput": true
                    },
                    {
                        "type": "sliderspin",
                        "id": "gain",
                        "value": 0,
                        "minValue": 0,
                        "maxValue": 1
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "gain": 0.3,
                "x": 100,
                "y": 542,
                "title": "gain",
                "minWidth": 240,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasOutput": true
                    },
                    {
                        "type": "sliderspin",
                        "id": "gain",
                        "value": 0.3,
                        "minValue": 0,
                        "maxValue": 1
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "x": 400,
                "y": 42,
                "scaleX": 1,
                "scaleY": 1,
                "triggerY": 0,
                "title": "analyser",
                "children": [
                    {
                        "type": "jacks",
                        "audio": {}
                    },
                    {
                        "id": "analyser_canvas",
                        "type": "canvas",
                        "style": {
                            "width": "100%",
                            "height": "100%"
                        }
                    },
                    {
                        "type": "sliderspin",
                        "id": "scaleX",
                        "value": 1,
                        "minValue": 1,
                        "maxValue": 20,
                        "valueStep": 1
                    },
                    {
                        "type": "sliderspin",
                        "id": "triggerY",
                        "value": 0,
                        "minValue": -1,
                        "maxValue": 1,
                        "spinStep": 0.01
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "x": 600,
                "y": 42,
                "freq": 440,
                "minFreq": 100,
                "maxFreq": 12000,
                "detune": 0,
                "minDetune": -1000,
                "maxDetune": 1000,
                "gain": 1,
                "minGain": 0,
                "maxGain": 1,
                "Q": 1,
                "minQ": 0,
                "maxQ": 50,
                "filter": "bandpass",
                "title": "filter",
                "minWidth": 240,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {}
                    },
                    {
                        "type": "spinner",
                        "id": "filter",
                        "value": 0,
                        "values": [
                            "bandpass",
                            "lowpass",
                            "highpass",
                            "notch",
                            "allpass"
                        ]
                    },
                    {
                        "type": "sliderspin",
                        "id": "frequency",
                        "value": 440,
                        "minValue": 100,
                        "maxValue": 12000
                    },
                    {
                        "type": "sliderspin",
                        "id": "detune",
                        "value": 0,
                        "minValue": -1000,
                        "maxValue": 1000
                    },
                    {
                        "type": "sliderspin",
                        "id": "Q",
                        "value": 1,
                        "minValue": 0,
                        "maxValue": 50,
                        "spinStep": 0.01
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "x": 600,
                "y": 300,
                "scaleX": 1,
                "scaleY": 1,
                "triggerY": 0,
                "title": "analyser",
                "children": [
                    {
                        "type": "jacks",
                        "audio": {}
                    },
                    {
                        "id": "analyser_canvas",
                        "type": "canvas",
                        "style": {
                            "width": "100%",
                            "height": "100%"
                        }
                    },
                    {
                        "type": "sliderspin",
                        "id": "scaleX",
                        "value": 1,
                        "minValue": 1,
                        "maxValue": 20,
                        "valueStep": 1
                    },
                    {
                        "type": "sliderspin",
                        "id": "triggerY",
                        "value": 0,
                        "minValue": -1,
                        "maxValue": 1,
                        "spinStep": 0.01
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "master": true,
                "gain": 0,
                "x": 400,
                "y": 544,
                "title": "master",
                "minWidth": 240,
                "minHeight": 60,
                "children": [
                    {
                        "type": "jacks",
                        "audio": {},
                        "hasOutput": false
                    },
                    {
                        "type": "sliderspin",
                        "id": "gain",
                        "value": 0,
                        "minValue": 0,
                        "maxValue": 1
                    }
                ],
                "child": null,
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            },
            {
                "title": "console",
                "class": "console-window",
                "x": 720,
                "y": 26,
                "width": 720,
                "height": 768,
                "content": "scroll",
                "showMethods": true,
                "showClasses": true,
                "buttons": [
                    {
                        "class": "window-button-right",
                        "child": {
                            "type": "icon",
                            "icon": "octicon-trashcan"
                        }
                    },
                    {
                        "type": "window-button-left",
                        "child": {
                            "type": "icon",
                            "icon": "octicon-diff-added"
                        }
                    }
                ],
                "child": null,
                "children": [
                    {
                        "class": "console",
                        "text": "<span class=\"tiny-text\" style=\"vertical-align:top\">console - knix version 0.2.6</span>",
                        "noMove": true
                    }
                ],
                "type": "window",
                "parent": "stage_content",
                "hasClose": true,
                "hasShade": true,
                "resize": true,
                "isMovable": true,
                "isShaded": false,
                "elem": "div"
            }
        ]
        
    # for w in windows
    #     knix.get w
