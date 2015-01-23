var Widget = new function() {
	var defaultConfig = {
		hasTitle: true,
		hasClose: true,
		hasShade: true,
		isMovable: true,
		isShaded: false,
		parentID: 'content',
		title: "widget"
	};

	var widgetFunctions = new function() {
		this.config = null;

		this.addTitleBar = function() {
			var title = newElement('div').addClassName('title');
			title.insert(this.config.title);
			this.insert(title);
			if (this.config.isMovable) {
				new dragObject(this, title);
			}
		}

		this.addCloseButton = function() {
			button = newElement('div').addClassName('close');
			this.insert(button);
			var widget = this;
			button.on('click', function() {
				widget.close();
			});
		}

		this.close = function() {
			this.remove();
		}

		this.addShadeButton = function() {
			button = newElement('div').addClassName('shade');
			this.insert(button);
			var widget = this;
			button.on('click', function() {
				widget.shade();
			});
		}

		this.shade = function() {
			if (this.config.isShaded) {
				this.setHeight(this.config.height);

				// adjust height for border size
				diff = this.getHeight() - this.config.height;
				if (diff) this.setHeight(this.config.height - diff);

				this.config.isShaded = false;
			} else {
				this.config.height = this.getHeight();
				this.setHeight(this.headerSize());
				this.config.isShaded = true;
			}
		}

		this.addSizeButton = function() {
			var button = newElement('div').addClassName('size');
			this.insert(button);
			var drag = null;

			button.on('mousedown', function(event, sender) {
				var element = $(sender.id);
				var widget = $(element.parentElement.id);
				drag.lowerBound = new Position(0, widget.headerSize());
				log(drag);
			});

			var moveCallback = function(newPos, element) {
				log('move');
				var widget = $(element.parentElement.id);
				var layout = $(element.id).getLayout();
				widget.setWidth(newPos.x + layout.get('border-box-width'));
				widget.setHeight(newPos.y + layout.get('border-box-height'));
			};

			drag = new dragObject(button, null, new Position(0, this.headerSize()), new Position(99999, 99999), null,
				moveCallback);
			log(drag);
		}

		this.moveTo = function(x, y) {
			this.style.left = "%dpx".fmt(x);
			this.style.top = "%dpx".fmt(y);
		}

		this.setWidth = function(w) {
			if (w != null) {
				this.style.width = "%dpx".fmt(w);
			}
		}

		this.setHeight = function(h) {
			if (h != null) {
				this.style.height = "%dpx".fmt(h);
			}
		}

		this.resize = function(w, h) {
			this.setWidth(w);
			this.setHeight(h);
		}

		this.headerSize = function() {
			var children = Selector.findChildElements(this, ['*.title', '*.close', '*.shade']);
			for (i = 0; i < children.length; i++) {
				var height = children[i].getLayout().get('padding-box-height');
				if (height) return height;
			}
			return 0;
		}

	}();

	this.closeAll = function() {
		$$(".widget").each(function(widget) {
			widget.close();
		});
	}

	this.create = function(cfg) {
		var widget = newElement('div').addClassName('widget'); // create widget div
		Object.extend(widget, widgetFunctions); // merge in widget functions
		widget.config = Object.clone(defaultConfig); // copy default config to widget
		widget.config = Object.extend(widget.config, cfg); // merge in argument config

		// log("Widget.new config", widget.config);

		if (widget.config.hasClose) {
			widget.addCloseButton();
		}
		if (widget.config.hasShade) {
			widget.addShadeButton();
		}
		if (widget.config.hasTitle) {
			widget.addTitleBar();
		}
		if (widget.config.hasSize) {
			widget.addSizeButton();
		} else if (widget.config.isMovable) {
			new dragObject(widget);
		}
		if (widget.config.parentID) {
			$(widget.config.parentID).insert(widget);
		}
		if (widget.config.x != null && widget.config.y != null) {
			widget.moveTo(widget.config.x, widget.config.y);
		}
		if (widget.config.width != null || widget.config.height != null) {
			widget.resize(widget.config.width, widget.config.height);
		}
		return widget;
	};

}();
