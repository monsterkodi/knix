
var Widget = new function() {

    var defaultConfig = {
        hasTitle:  true,
        hasClose:  true,
        hasShade:  true,
        isMovable: true,
        parentID:  'content',
        title:     "widget"
    };

    var widgetFunctions = new function()
    {
        this.config = null;

        this.addTitleBar = function()
        {
            console.log("addTitle %s".fmt(str(this)));
            var title = newElement('div').addClassName('title');
            title.insert(this.config.title);
            this.insert(title);
            if (this.config.isMovable)
            {
                new dragObject(this, title);
            }
        }

        this.addCloseButton = function()
        {
            button = newElement('div').addClassName('close');
            this.insert(button);
            var widget = this;
            button.on('click', function() { widget.close(); });
        }

        this.close = function()
        {
            log('close');
            this.remove();
        }

        this.addShadeButton = function()
        {
            button = newElement('div').addClassName('shade');
            this.insert(button);
            var widget = this;
            button.on('click', function() { widget.shade(); });
        }

        this.shade = function()
        {
            log('shade');

            if (this.getHeight() > 20)
            {
                this.config.height = this.getHeight();
                this.setHeight(20);
            }
            else
            {
                this.setHeight(this.config.height);
            }
        }

        this.moveTo = function(x,y)
        {
            this.style.left = "%dpx".fmt(x);
            this.style.top  = "%dpx".fmt(y);
        }

        this.setWidth = function(w)
        {
            if (w != null) { this.style.width = "%dpx".fmt(w); }
            log(this.style);
            log(this.style.width);
        }

        this.setHeight = function(h)
        {
            if (h != null) { this.style.height = "%dpx".fmt(h); }
        }

        this.resize = function(w,h)
        {
            log(w,h);
            this.setWidth(w);
            this.setHeight(h);
        }

    }();

    this.new = function(cfg)
    {
        var widget = newElement('div').addClassName('widget'); // create widget div
        Object.extend(widget, widgetFunctions); // merge in widget functions
        widget.config = Object.clone(defaultConfig); // copy default config to widget
        widget.config = Object.extend(widget.config, cfg); // merge in argument config

        log("Widget.new config", widget.config);

        if      (widget.config.hasClose ) { widget.addCloseButton(); }
        if      (widget.config.hasShade ) { widget.addShadeButton(); }
        if      (widget.config.hasTitle ) { widget.addTitleBar(); }
        else if (widget.config.isMovable) { new dragObject(widget); }
        if      (widget.config.parentID ) { $(widget.config.parentID).insert(widget); }
        if      (widget.config.x != null && widget.config.y != null) { widget.moveTo(widget.config.x, widget.config.y); }
        if      (widget.config.width != null || widget.config.height != null) { widget.resize(widget.config.width, widget.config.height); }
        return widget;
    };

}();
