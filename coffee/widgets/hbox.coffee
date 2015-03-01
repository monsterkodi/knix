###

000   000  0000000     0000000   000   000
000   000  000   000  000   000   000 000 
000000000  0000000    000   000    00000  
000   000  000   000  000   000   000 000 
000   000  0000000     0000000   000   000

###

class Hbox extends Widget
    
    init: (cfg, defs) =>

        cfg = _.def cfg, defs
        spacing = cfg.spacing? and cfg.spacing or 5
        super cfg,
            type: 'hbox'
            style:
                display:       'table'
                borderSpacing: '%dpx 0px'.fmt spacing
                marginRight:   '-%dpx'.fmt spacing
                marginLeft:    '-%dpx'.fmt spacing
        @

    insertChild: (cfg) =>

        child = super cfg

        child.elem.style.display       = 'table-cell'
        child.elem.style.marginLeft    = '10px'
        child.elem.style.verticalAlign = 'middle'

        child
