class Hbox extends Widget

    constructor: (cfg) ->

        super cfg,
            type: 'hbox'
            style:
                display: 'table'
            child:
                type: 'content'
                style:
                    display: 'table-row'
                    width:   '100%'

        # add display: 'table-cell' to children

    insertChild: (cfg) ->

        child = super cfg
        child.elem.style.display = 'table-cell'
        child
