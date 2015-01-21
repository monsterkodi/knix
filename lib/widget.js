
var Widget = new function() {

    var defaultConfig = {
        hasTitle: true,
        hasClose: true,
        isMovable: true,
        parentID: 'content',
        title: "widget"
    };

    var WidgetFunctions = new function()
    {
        this._title = null;
        this.config = null;

        this.addTitle = function()
        {
            console.log("addTitle %s".fmt(str(this)));
            var title = newElement('div').addClassName('title');
            title.insert(this.config.title);
            this.insert(title);
            this._title = title;
            if (this.config.isMovable)
            {
                new dragObject(this, title);
            }
        }

        this.addClose = function()
        {
            var close = newElement('div').addClassName('close');
            if (this.config.hasTitle)
            {
                this._title.insert(close);
            }
            else
            {
                this.insert(close);
            }
        }

        this.moveTo = function(x,y)
        {
            this.style.left = "%dpx".fmt(x);
            this.style.top  = "%dpx".fmt(y);
        }
    }();

    this.new = function(cfg)
    {
        var widget = newElement('div').addClassName('widget'); // create widget div
        Object.extend(widget, WidgetFunctions); // merge in widget functions
        widget.config = Object.clone(defaultConfig); // copy default config to widget
        widget.config = Object.extend(widget.config, cfg); // merge in argument config

        log("Widget.new config", widget.config);

        if      (widget.config.hasTitle ) { widget.addTitle(); }
        else if (widget.config.isMovable) { new dragObject(widget); }
        if      (widget.config.hasClose ) { widget.addClose(); }
        if      (widget.config.parentID ) { $(widget.config.parentID).insert(widget); }
        if      (widget.config.x != null && widget.config.y != null) { widget.moveTo(widget.config.x, widget.config.y); }
        return widget;
    };

}();
