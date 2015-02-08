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

    insertChild: (cfg) ->

        child = super cfg
        child.elem.style.display = 'table-cell'
        child.elem.style.marginLeft = '10px'
        child
