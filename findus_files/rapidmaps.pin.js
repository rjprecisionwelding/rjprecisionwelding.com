function RMPin (options) {

	this.PID = options.PID;
	this.map = options.map;
	this.name = options.name;
	this.visible = options.visible;
	this.icons = {
	
		normal: {
			
			url: options.icon.url,
			anchor: new google.maps.Point(options.icon.anchor.x / (options.icon.retina ? 2 : 1), options.icon.anchor.y / (options.icon.retina ? 2 : 1)),
			scaledSize: new google.maps.Size(options.icon.size.width / (options.icon.retina ? 2 : 1), options.icon.size.height / (options.icon.retina ? 2 : 1)),
			retina: options.icon.retina
			
		},
		hidden: {
		
			url: "images/hidden_pin.png",
			anchor: new google.maps.Point(5, 5),
			scaledSize: new google.maps.Size(10, 10)
			
		}
		
	}

	this.marker = new google.maps.Marker({
	
		map: this.map,
		position: options.location,
		icon: this.icons.normal,
		title: this.name,
		animation: options.animation ? google.maps.Animation.DROP : null,
		visible: options.visible,
		draggable: options.draggable
		
	});
	
	if (options.draggable) {
	
		this.arrow = new google.maps.Marker({
		
			zIndex: this.marker.getZIndex() - 1,
			visible: false
			
		});
		
		this.arrow.bindTo("position", this.marker);
		this.arrow.bindTo("map", this.marker);
		
		this.resetArrow();
	
	}
	
	this.action = options.action;
	
	switch (this.action.type) {
	
		case "label":
	
			this.label = new google.maps.InfoWindow({
				
				content: options.label.content,
				visible: options.label.visible
				
			});
			
			if (options.label.visible) {
			
				this.label.open(this.map, this.marker);
				
			}
		
			var instance = this;
			
			google.maps.event.addListener(instance.marker, "click", function () {
			
				if (instance.label.getMap() == null) {
				
					instance.label.open(instance.map, instance.marker);
				
				}
				
				else {
					
					instance.label.close();
					
				}
				
			});
		
		break;
		
		case "url_in":
		
			google.maps.event.addListener(this.marker, "click", function () {
			
				window.open(options.action.url, "_top");
				
			});
		
		break;
		
		case "url_out":
		
			google.maps.event.addListener(this.marker, "click", function () {
			
				window.open(options.action.url, "_blank");
				
			});
		
		break;
	
	}
	
	this.circle = new google.maps.Circle({
	
		map: options.circles ? this.map : null,
		radius: options.radius,
		fillColor: options.fill.color,
		fillOpacity: options.fill.opacity,
		strokeColor: options.stroke.color,
		strokeOpacity: options.stroke.opacity,
		strokeWeight: options.stroke.thickness
	
	});
	
	this.circle.bindTo("center", this.marker, "position");

}

RMPin.prototype.setIcon = function (icon) {

	this.icons.normal = {
		
		url: icon.url,
		anchor: new google.maps.Point(icon.anchor.x / (icon.retina ? 2 : 1), icon.anchor.y / (icon.retina ? 2 : 1)),
		scaledSize: new google.maps.Size(icon.size.width / (icon.retina ? 2 : 1), icon.size.height / (icon.retina ? 2 : 1)),
		retina: icon.retina
		
	};

	if (this.arrow) {
	
		this.resetArrow();
		
	}
	
	this.setVisible(this.visible);

}



RMPin.prototype.setSelect = function (selected) {

	if (this.arrow) {
	
		this.arrow.setVisible(selected);
		
	}

}

RMPin.prototype.setVisible = function (visible) {

	this.visible = visible;
	this.marker.setIcon(visible ? this.icons.normal : this.icons.hidden);
	this.resetArrow();

}

RMPin.prototype.removeMarker = function () {

	this.marker.setMap(null);
	this.circle.setMap(null);

}

RMPin.prototype.resetArrow = function () {
	
	this.arrow.setIcon({
		
		url: "images/arrow.png",
		anchor: new google.maps.Point(15, 40 + this.marker.getIcon().anchor.y),
		scaledSize: new google.maps.Size(30, 40)
		
	});
	
}