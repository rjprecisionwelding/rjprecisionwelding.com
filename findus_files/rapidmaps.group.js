function RMGroup (options) {
	
	this.GID = options.GID;
	this.PID = 0;
	this.map = options.map;
	this.name = options.name;
	this.edit = options.edit;
	this.pins = [];
	this.fill = options.fill;
	this.stroke = options.stroke;
	this.circles = options.circles;
	this.icon = options.icon;
	
	this.path = new google.maps.Polyline({
	
		map: options.path ? this.map : null,
		strokeColor: this.stroke.color,
		strokeOpacity: this.stroke.opacity,
		strokeWeight: this.stroke.thickness
	
	});
	this.area = new google.maps.Polygon({
	
		map: options.area ? this.map : null,
		fillColor: this.fill.color,
		fillOpacity: this.fill.opacity,
		strokeColor: this.stroke.color,
		strokeOpacity: this.stroke.opacity,
		strokeWeight: this.stroke.thickness
	
	});
	this.route = new google.maps.DirectionsRenderer({
	
		preserveViewport: true,
		suppressMarkers: true,
		suppressInfoWindows: true,
		polylineOptions: {
		
			clickable: false,
			strokeColor: this.stroke.color,
			strokeOpacity: this.stroke.opacity,
			strokeWeight: this.stroke.thickness
			
		}
		
	});
	this.route.type = options.route.type;
	this.route.visible = options.route.visible;

}

RMGroup.prototype.setGroup = function (options) {

	this.name = options.name;
	this.fill = options.fill;
	this.stroke = options.stroke;
	this.icon = options.icon || this.icon;
	this.circles = options.circles;
	
	this.path.setOptions({
	
		map: options.path ? this.map : null,
		strokeColor: this.stroke.color,
		strokeOpacity: this.stroke.opacity,
		strokeWeight: this.stroke.thickness
	
	});
	
	this.area.setOptions({
	
		map: options.area ? this.map : null,
		fillColor: this.fill.color,
		fillOpacity: this.fill.opacity,
		strokeColor: this.stroke.color,
		strokeOpacity: this.stroke.opacity,
		strokeWeight: this.stroke.thickness
	
	});
	
	this.route.setOptions({
	
		polylineOptions: {
			
			strokeColor: this.stroke.color,
			strokeOpacity: this.stroke.opacity,
			strokeWeight: this.stroke.thickness
			
		}
				
	});
	this.route.type = options.route.type;
	this.route.visible = options.route.visible;
	this.findRoute();
	
	for (var i = 0; i < this.pins.length; i++) {
	
		var pin = this.pins[i];
	
		pin.circle.setMap(options.circles ? this.map : null);
	
		pin.circle.setOptions({
		
			fillColor: this.fill.color,
			fillOpacity: this.fill.opacity,
			strokeColor: this.stroke.color,
			strokeOpacity: this.stroke.opacity,
			strokeWeight: this.stroke.thickness
			
		});
		
		if (options.icon) {
		
			pin.setIcon(options.icon);
		
		}
	
	}

}

RMGroup.prototype.getPID = function () {

	while (this.getPin(this.PID) != null) {
	
		this.PID++;
		
	}
	
	return this.PID;
	
}

RMGroup.prototype.getPin = function (PID) {

	for (var i = 0; i < this.pins.length; i++) {
	
		if (this.pins[i].PID == PID) {
		
			return this.pins[i];
		
		}
		
	}

}

RMGroup.prototype.addPin = function (options) {

	var PID = options.PID || this.getPID();
	
	var pin = new RMPin({
	
		PID: PID,
		map: options.map,
		name: options.name,
		radius: options.radius,
		location: options.location,
		icon: options.icon || this.icon,
		visible: options.visible,
		draggable: options.draggable,
		label: {
		
			content: options.label.content,
			visible: options.label.visible
			
		},
		action: options.action,
		circles: this.circles,
		stroke: this.stroke,
		fill: this.fill,
		animation: options.animation
	
	})
	
	this.pins.splice(options.index, 0, pin);
		
	this.path.getPath().insertAt(options.index, options.location);
	this.area.getPath().insertAt(options.index, options.location);
	
	this.findRoute();
	
	return PID;

}

RMGroup.prototype.removePin = function (PID) {

	var pin = null;
	
	this.getPin(PID).removeMarker();

	for (var i = 0; i < this.pins.length; i++) {
	
		if (this.pins[i].PID == PID) {
		
			pin = this.pins[i];
		
			this.pins.splice(i, 1);
			this.path.getPath().removeAt(i);
			this.area.getPath().removeAt(i);
			
			break;
		
		}
	
	}

	this.findRoute();
	
	return pin;

}

RMGroup.prototype.setPin = function (PID, options) {

	var pin = this.getPin(PID);
	var location = new google.maps.LatLng(options.location.lat, options.location.lng);
	
	pin.name = options.name;
	pin.marker.setTitle(options.name);
	pin.circle.setRadius(options.radius);
	
	pin.setVisible(options.visible);
	
	if (options.icon) {
		
		pin.setIcon(options.icon);
	
	}
	
	this.getPin(PID).marker.setPosition(location);
	
	for (var i = 0; i < this.pins.length; i++) {
			
		if (this.pins[i].PID == PID) {
		
			this.path.getPath().setAt(i, location);
			this.area.getPath().setAt(i, location);
			
			break;
		
		}
		
	}
	
	this.findRoute();

}

RMGroup.prototype.findRoute = function () {

	if (this.route.visible && this.pins.length > 1) {
	
		var waypoints = [];
		
		for (var i = 1; i < this.pins.length - 1; i++) {
		
			waypoints.push({
			
				location: this.pins[i].marker.getPosition(),
				stopover: false
				
			});
		
		}
		
		var request = {
	
			origin: this.pins[0].marker.getPosition(),
			destination: this.pins[this.pins.length - 1].marker.getPosition(),
			travelMode: (this.route.type == "walking") ? google.maps.TravelMode.WALKING : ((this.route.type == "bicycling") ? google.maps.TravelMode.BICYCLING : google.maps.TravelMode.DRIVING),
			unitSystem: google.maps.UnitSystem.METRIC,
			waypoints: waypoints
	
		};
		
		var instance = this;
		var service = new google.maps.DirectionsService();
		
		service.route(request, function (result, status) {
		
			switch (status) {
			
				case google.maps.DirectionsStatus.OK:
				
					// this is because directions are asynchronous
					if (instance.pins.length > 1) {
				
						instance.route.setDirections(result);
						instance.route.setMap(instance.map);
						
						if (instance.edit) {
						
							RMCocoa.routeLength(instance.GID, result.routes[0].legs[0].distance);
							
						}
					
					}
					
				break;
				
				case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
					
					if (instance.route.getMap() != null) {
					
						instance.route.setMap(null);
			
						if (instance.edit) {
						
							RMCocoa.sendMessage("Due to Google Maps limitations in route calculation, the total of allowed points is 10.");
							
						}
						
					}
					
				break;
				
				case google.maps.DirectionsStatus.ZERO_RESULTS:
					
					if (instance.route.getMap() != null) {
					
						instance.route.setMap(null);
			
						if (instance.edit) {
						
							RMCocoa.sendMessage("No route could be found.");
							
						}
						
					}
				
				break;
				
			}
			
		});
		
	}
	
	else {
	
		this.route.setMap(null);
	
	}
	
}