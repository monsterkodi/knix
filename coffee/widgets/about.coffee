###

 0000000   0000000     0000000   000   000  000000000
000   000  000   000  000   000  000   000     000   
000000000  0000000    000   000  000   000     000   
000   000  000   000  000   000  000   000     000   
000   000  0000000     0000000    0000000      000   

###

class About extends Window
    
    init: (cfg, defs) =>        
    
        _.def cfg, defs

        @url = '::.info.json:home-url::'

        super cfg,
            title:     'about'
            id:        'about'
            resize:    'horizontal'
            width:     200
            center:    true
            children:
                [
                    type: 'about-svg'
                    text: '<svg viewBox="0 100 1100 600" height="66px" width="100px"><path class="about-svg-path" d="M 671.97461 153.66602 C 647.84887 153.75842 623.84771 163.63166 606.41211 182.95312 C 573.5922 219.3229 576.45513 275.40809 612.80859 308.24609 C 620.53294 315.22348 629.15009 320.58419 638.24414 324.36133 L 637.97852 511.20117 C 560.81033 441.59202 488.03551 367.51834 414.76367 293.89258 C 409.06942 288.42247 401.85831 285.1368 394.32812 284.25586 C 382.9265 281.82062 370.57957 285.05653 361.77344 293.91211 C 291.50652 362.08056 204.76321 455.25847 139.13477 510.65234 L 138.86523 319.25977 C 138.99507 306.54933 132.3051 294.74291 121.33594 288.32031 C 110.36678 281.89771 96.79809 281.84212 85.777344 288.17578 C 74.756593 294.50944 67.97298 306.26158 68 318.97266 C 68.0096 413.80238 68.032028 508.63329 68.017578 603.46289 C 68.452293 617.45841 77.087108 629.88453 90.052734 635.17188 C 103.01836 640.45922 117.88262 637.61638 127.98047 627.91602 L 245.27539 510.05273 L 362.08789 627.66016 C 367.94368 633.40258 375.28804 636.69048 382.85156 637.55469 C 391.36493 639.36349 400.38626 638.016 408.11914 633.48828 C 419.0883 627.06568 425.77828 615.25927 425.64844 602.54883 L 425.91797 411.1543 L 649.13477 628.46289 C 656.19683 635.24697 665.58871 638.66377 675.0332 638.30469 C 684.64495 638.71483 694.38139 635.23573 701.68164 627.89453 C 738.19192 592.47458 779.14942 550.30282 818.46875 510.1875 C 857.78815 550.30282 898.74753 592.47458 935.25781 627.89453 C 948.81591 641.52869 970.77308 641.86325 984.73828 628.64648 C 998.70348 615.42971 999.57834 593.48695 986.71094 579.19922 L 868.2207 460.60352 L 985.25586 344.67969 C 999.17946 330.95449 999.35554 308.54496 985.64844 294.60352 C 971.94134 280.66208 949.53147 280.4575 935.57227 294.14648 L 818.46875 411.75586 L 722.62109 315.49414 C 728.17633 311.66183 733.38264 307.13532 738.10547 301.91211 L 738.22461 301.78125 C 771.0084 265.37887 768.08923 209.29599 731.70312 176.49414 C 714.64714 161.11826 693.26203 153.58449 671.97461 153.66602 z M 672.16406 206.9668 C 680.66456 206.9343 689.20287 209.94212 696.01367 216.08203 C 710.54339 229.18049 711.71038 251.57511 698.61914 266.11133 L 698.57031 266.16406 C 685.4502 280.67423 663.0538 281.80626 648.53711 268.69336 C 634.02042 255.58047 632.87674 233.18531 645.98242 218.66211 C 652.94481 210.94666 662.53015 207.0037 672.16406 206.9668 z M 354.79492 401.0918 C 354.7939 440.9569 354.79438 480.82238 354.78906 520.6875 L 294.73633 461.20508 L 354.79492 401.0918 z M 709.10938 401.56055 L 768.7168 460.60352 L 709.10156 520.27148 C 709.10264 480.70103 709.1041 441.13102 709.10938 401.56055 z "/></svg>'
                ,
                    type: 'button'
                    child:
                        text:   'Home'
                        href:   @url
                ,
                    type: 'about-svg' # stolen from https://github.com/chloi/preprocessor-logos
                    text: '<svg viewbox="48 15 27 27" height="80px" width="80px" class="about-svg-path"><path class="about-svg-path" d="M58,20.4c-0.3-0.2-0.8-0.3-1.5-0.3c-0.2,0-0.4,0-0.6,0.1c-0.2,0.1-0.3,0.2-0.3,0.4s0.1,0.3,0.4,0.4 c0.2,0.1,0.6,0.2,1,0.2c0.4,0,0.7,0,0.9-0.1c0.4-0.1,0.9-0.2,1.3-0.4l0.6-0.3c0.5-0.2,1.2-0.7,1.6-0.8c0.7-0.2,1.4-0.3,2.1-0.3 c1.3,0,2.4,0.2,3.1,0.6c0.7,0.3,0.8,1.1,0.8,1.6c0,0.6-0.5,1.1-1.5,1.3C65.4,22.9,65,23,64.5,23c-0.8,0-1.5-0.1-2-0.3 c-0.5-0.2-0.7-0.4-0.7-0.7c0-0.2,0.2-0.4,0.5-0.5c0.1,0,0.3-0.1,0.5-0.1c0,0.3,0.3,0.6,0.8,0.7c0.2,0,0.4,0.1,0.7,0.1 c0.5,0,0.8-0.1,1.1-0.2c0.3-0.1,0.5-0.3,0.5-0.5c0-0.2-0.2-0.4-0.6-0.5c-0.4-0.1-0.8-0.2-1.4-0.2c-0.6,0-1,0-1.4,0.1 c-0.4,0.1-0.7,0.2-1,0.3s-0.6,0.2-0.9,0.3c-0.3,0.1-0.6,0.2-0.9,0.3c-0.7,0.2-1.4,0.4-2,0.4c-0.8,0-1.5-0.1-2.1-0.4 s-0.8-0.7-0.8-1.1c0-0.5,0.4-0.9,1.2-1c0.2,0,0.5-0.1,0.9-0.1c0.4,0,0.7,0,1,0.1c0.3,0.1,0.5,0.2,0.5,0.4S58.3,20.3,58,20.4z"/> <path class="kitty" d="M61.4,26.6c-9.7,0-11-2.3-11-2.3c0,1.2,0.3,2.4,0.7,3.5c-0.6,0.5-2.2,2-2.2,4.2c0,2.8,3.3,4.5,5.5,3.1 c0,0-3.7-0.5-3.7-3.8c0-1.2,0.4-2,1-2.5c0.9,2,2.2,3.5,2.6,4.1c0.8,1,1,0.7,1.5,2.6c0.4,1.6,4,2.5,6,2.5v0c0,0,0,0,0,0 c0,0,0,0,0,0v0c2-0.1,5.3-0.9,5.7-2.5c0.5-2,0.5-1.6,1.3-2.6c0.8-1,3.8-4.7,3.8-8.7C72.4,24.3,71.2,26.6,61.4,26.6z"/> <path class="kitty" d="M61.7,25.2v1.5c0,0-0.4,0-0.4,0s0.4,0,0.4,0V25.2c11,0,11-3,11-3l-1.3-1.3c2.7,2.7-8.6,3-9.9,3c-1.3,0-12.7-0.3-9.9-3 l-1,1.3C50.4,22.2,49.7,25.1,61.7,25.2z"/></svg>'
                ,
                    type: 'button'
                    child:
                        text:   'Credits'
                        href:   @url+'credits.html'
                ,
                    type: 'about-svg'
                    text: '<svg viewbox="0 0 16 16" width="80px" height="80px" class="kitty-svg"><path class="about-svg-path" d="M7.999,0.431c-4.285,0-7.76,3.474-7.76,7.761 c0,3.428,2.223,6.337,5.307,7.363c0.388,0.071,0.53-0.168,0.53-0.374c0-0.184-0.007-0.672-0.01-1.32 c-2.159,0.469-2.614-1.04-2.614-1.04c-0.353-0.896-0.862-1.135-0.862-1.135c-0.705-0.481,0.053-0.472,0.053-0.472 c0.779,0.055,1.189,0.8,1.189,0.8c0.692,1.186,1.816,0.843,2.258,0.645c0.071-0.502,0.271-0.843,0.493-1.037 C4.86,11.425,3.049,10.76,3.049,7.786c0-0.847,0.302-1.54,0.799-2.082C3.768,5.507,3.501,4.718,3.924,3.65 c0,0,0.652-0.209,2.134,0.796C6.677,4.273,7.34,4.187,8,4.184c0.659,0.003,1.323,0.089,1.943,0.261 c1.482-1.004,2.132-0.796,2.132-0.796c0.423,1.068,0.157,1.857,0.077,2.054c0.497,0.542,0.798,1.235,0.798,2.082 c0,2.981-1.814,3.637-3.543,3.829c0.279,0.24,0.527,0.713,0.527,1.437c0,1.037-0.01,1.874-0.01,2.129 c0,0.208,0.14,0.449,0.534,0.373c3.081-1.028,5.302-3.935,5.302-7.362C15.76,3.906,12.285,0.431,7.999,0.431z"/></svg>'
                ,
                    type: 'button'
                    child:
                        text:   'GitHub'
                        href:   'https://github.com/monsterkodi/knix'
                ,
                    style:
                        textAlign: 'center'
                    child:
                        elem: 'span'
                        type: 'tiny-text'
                        text: 'version %s'.fmt knix.version
                ]

    @show: ->
        log "about..."
        if $('about') then $('about').raise()
        else new About

    @menu: ->

        knix.create
            type:   'button'
            id:     'show_about'
            icon:   'octicon-info'
            class:  'tool-button'
            parent: 'tool'
            onClick: -> About.show()
