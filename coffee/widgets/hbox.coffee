###

    000   000  0000000     0000000   000   000
    000   000  000   000  000   000   000 000
    000000000  0000000    000   000    00000
    000   000  000   000  000   000   000 000
    000   000  0000000     0000000   000   000

###

class Hbox extends Widget

    constructor: (config) ->

        cfg = _.def config,
            spacing: 5

        super cfg,
            type: 'hbox'
            style:
                display: 'table'
                borderSpacing: '%dpx 0px'.fmt cfg.spacing
                marginRight:   '-%dpx'.fmt cfg.spacing
                marginLeft:    '-%dpx'.fmt cfg.spacing
            child:
                type: 'content'
                style:
                    display: 'table-row'
                    width:   '100%'

    insertChild: (cfg) =>

        child = super cfg

        if cfg.type == 'content'
            @content = child.id
        else
            child.elem.style.display = 'table-cell'
            child.elem.style.marginLeft = '10px'

        child
