
var Scroller = new function()
{
    var defaultConfig = {
        vertical:   true,
        hasButtons: true,
        hasSlider:  true,
        parentID:  'content'
    };

    var scrollerFunctions = new function()
    {
        this.config = null;

        this.addButtons = function()
        {
            log('addButtons');
        }

        this.addSlider = function()
        {
            slider = newElement('div').addClassName('slider');
            this.insert(slider);
            var scroller = this;

            var slideCallback = function(newPos, element)
            {
                log(newPos);
            }

            var minPos = this.config.vertical ? new Position(0,20) : new Position(20,0);
            var maxPos = this.config.vertical ? new Position(0,99999) : new Position(99999,0);
            new dragObject(slider, null, minPos, maxPos, null, slideCallback);
        }

        this.moveTo = function(x,y)
        {
            this.style.left = "%dpx".fmt(x);
            this.style.top  = "%dpx".fmt(y);
        }

        this.setWidth = function(w)
        {
            if (w != null) { this.style.width = "%dpx".fmt(w); }
        }

        this.setHeight = function(h)
        {
            if (h != null) { this.style.height = "%dpx".fmt(h); }
        }

        this.resize = function(w,h)
        {
            this.setWidth(w);
            this.setHeight(h);
        }

    }();

    this.new = function(cfg)
    {
        var scroller = newElement('div').addClassName('scroller'); // create scroller div
        Object.extend(scroller, scrollerFunctions); // merge in scroller functions
        scroller.config = Object.clone(defaultConfig); // copy default config to scroller
        scroller.config = Object.extend(scroller.config, cfg); // merge in argument config

        // log("Scroller.new config", scroller.config);

        if (scroller.config.hasButtons) { scroller.addButtons(); }
        if (scroller.config.hasSlider)  { scroller.addSlider(); }
        if (scroller.config.parentID  ) { $(scroller.config.parentID).insert(scroller); }
        if (scroller.config.x != null && scroller.config.y != null) { scroller.moveTo(scroller.config.x, scroller.config.y); }
        if (scroller.config.width != null || scroller.config.height != null) { scroller.resize(scroller.config.width, scroller.config.height); }
        return scroller;
    };

}();
