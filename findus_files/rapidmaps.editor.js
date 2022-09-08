/**
Create a new editor.

<pre>
options = {
	version: plugin version,
	edit: true if in plugin edit mode,
	restore: {
		zoom: zoom level,
		center: {
			lat: latitude of map center,
			lng: longitude of map center
		},
		type: map type,
		cluster: true to cluster (group) multiple pins,
		traffic: true to shaw traffic,
		weather: {
			weather: true to show weather,
			clouds: true to show clouds,
			units: temperature unit (celsius or fahrenheit)
		},
		controls: {
			pan: true to show pan control,
			zoom: zoom control (small, large, default or none),
			map: map type control (bar, menu, default or none)
			street: true to show street view control
		},
		scrollwheel: true to use scrollwheel to zoom,
		kml: {
			visible: true to use kml data,
			url: url of kml data,
			clickable: true to make kml layer clickable,
			viewport: true to adapt map zoom to kml data
		},
		photos: {
			visible: true to show photos,
			type: photos filter (tag or user),
			filter: filter value based on type
		},
		groups: [
			{
				name: group name,
				icon: {
					url: url for default group icon,
					size: {
						width: width of default group icon,
						height: height of default group icon
					},
					anchor: {
						x: horizontal position of default group icon anchor,
						y: vertical position of default group icon anchor
					},
					retina: true if retina
				},
				fill: {
					color: area color,
					opacity: area opacity
				},
				stroke: {
					color: path color,
					opacity: path opacity,
					thickness: path thickness
				},
				circles: true to show circles on pins,
				area: true to show area,
				path: true to show path,
				route: {
					visible: true to show route,
					type: route type (driving, bycicle or walking)
				},
				pins: [
					{
						name: pin name,
						visible: true to show pin on map,
						icon: {
							url: icon url,
							size: {
								width: icon width,
								height: icon height
							},
							anchor: {
								x: horizontal position of pin icon anchor,
								y: vertical position of pin icon anchor
							},
							retina: true if retina
						},
						location: {
							lat: latitude of pin,
							lng: longitude of pin
						},
						radius: circle radius in meters,
						label: {
							visible: true to show label on startup,
							content: label content
						},
						action: {
							type: click action (label, url_in, url_out, none),
							url: link for url_in and url_out types
						}
					},
					...
				]
			},
			...
		]
	}
}
</pre>

@author Roberto Tremonti
@version 3.0
@constructor
@this {RMEditor}
@param {string} map HTML ID of map element.
@param {object} options See code above.
*/
function RMEditor (map, options) {

	this.edit = options.edit || false;
	this.GID = 0;
	this.groups = [];
	this.center = options.restore ? new google.maps.LatLng(options.restore.center.lat, options.restore.center.lng) : new google.maps.LatLng(0, 0);
	
	var instance = this;
	var zoom = options.restore ? options.restore.zoom : 3;
	var scrollwheel = options.restore ? options.restore.scrollwheel : false;
	var pan = this.edit ? true : options.restore.controls.pan;
	var street = this.edit ? false : options.restore.controls.street;
	var zoomControl = true;
	var zoomControlStyle = google.maps.ZoomControlStyle.DEFAULT;
	var mapControl = true;
	var mapControlStyle = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
	
	if (!this.edit) {
	
		switch (options.restore.controls.zoom) {
			
			case "small":
			
				var zoomControl = true;
				var zoomControlStyle = google.maps.ZoomControlStyle.SMALL;
				
			break;
			
			case "large":
			
				var zoomControl = true;
				var zoomControlStyle = google.maps.ZoomControlStyle.LARGE;
				
			break;
			
			case "default":
			
				var zoomControl = true;
				var zoomControlStyle = google.maps.ZoomControlStyle.DEFAULT;
				
			break;
			
			case "none":
			
				var zoomControl = false;
				var zoomControlStyle = "";
				
			break;
			
		}
	
		switch (options.restore.controls.map) {
			
			case "bar":
			
				var mapControl = true;
				var mapControlStyle = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
				
			break;
			
			case "dropdown":
			
				var mapControl = true;
				var mapControlStyle = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
				
			break;
			
			case "default":
			
				var mapControl = true;
				var mapControlStyle = google.maps.MapTypeControlStyle.DEFAULT;
				
			break;
			
			case "none":
			
				var mapControl = false;
				var mapControlStyle = "";
				
			break;
			
		}
		
	}
	
	this.map = new google.maps.Map(document.getElementById(map), {
		
		center: this.center,
		zoom: zoom,
		mapTypeId: options.restore ? google.maps.MapTypeId[options.restore.type.toUpperCase()] : google.maps.MapTypeId.ROADMAP,
		scrollwheel: scrollwheel,
		panControl: pan,
		mapTypeControl: mapControl,
		zoomControl: zoomControl,
		streetViewControl: street,
		mapTypeControlOptions: {
			
			style: mapControlStyle
			
		},
		zoomControlOptions: {
			
			style: zoomControlStyle
			
		}
		
	});
	
	if (this.edit) {
	
		google.maps.event.addListener(this.map, "zoom_changed", function () {
		
			RMCocoa.mapChanged(instance.map.getCenter(), instance.map.getZoom(), instance.map.getMapTypeId());
		
		});
		
		google.maps.event.addListener(this.map, "maptypeid_changed", function () {
		
			RMCocoa.mapChanged(instance.map.getCenter(), instance.map.getZoom(), instance.map.getMapTypeId());
		
		});
		
		google.maps.event.addListener(this.map, "idle", function () {
		
			RMCocoa.mapChanged(instance.map.getCenter(), instance.map.getZoom(), instance.map.getMapTypeId());
		
		});
	
	}
	
	else if (options.restore && options.restore.cluster == true) {
		
		this.cluster = new MarkerClusterer(this.map);
		
	}
	
	this.photos = new google.maps.panoramio.PanoramioLayer();
	this.traffic = new google.maps.TrafficLayer();
	this.weather = new google.maps.weather.WeatherLayer({
		
		clickable: false
		
	});
	this.clouds = new google.maps.weather.CloudLayer();
	
	google.maps.event.addListenerOnce(this.map, "idle", function () {
	
		if (instance.edit) {
		
			RMCocoa.editorReady();
			
			instance.addSearchbox();
		
			google.maps.event.addListener(instance.map, "rightclick", function (event) {
			
				var GID = -1;
				
				if (instance.groups.length > 0) {
				
					GID = instance.groups[instance.groups.length - 1].GID;
				
				}
				
				if (GID == -1) {
				
					GID = instance.addGroup({
					
						name: "Group"
					
					});
					
					RMCocoa.groupCreated(GID, "Group");
				
				}
				
				var pin = instance.addPin(GID, {
				
					name: "Pin",
					location: {
					
						lat: event.latLng.lat(),
						lng: event.latLng.lng()
					
					}
				
				});
				
				RMCocoa.pinCreated(GID, pin.PID, "Pin", event.latLng);
			
			});
			
		}
				
		if (options.restore) {
		
			instance.restoreMap(options.restore);
			
		}

		else {
		
			RMCocoa.mapChanged(instance.map.getCenter(), instance.map.getZoom(), instance.map.getMapTypeId());
		
		}
	
	});
	
	google.maps.event.addListener(this.map, "idle", function () {
	
		instance.center = instance.map.getCenter();
		
	});
	
	google.maps.event.addDomListener(window, "resize", function () {
	
		instance.map.setCenter(instance.center);
		
	});

}

/**
Att searchbox to map's editor.

@private
*/
RMEditor.prototype.addSearchbox = function () {
	
	var instance = this;
	
	var input = document.getElementById("rapidmaps-searchbox");
	
	input.style.display = "inline";
	
	this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchbox = new google.maps.places.Autocomplete(input);

	google.maps.event.addListener(searchbox, "place_changed", function () {
	
		var GID = -1;
		var place = searchbox.getPlace();
		
		if (!place.geometry) {
		
			return;
			
		}
		
		instance.map.setCenter(place.geometry.location);
			
		if (instance.groups.length > 0) {
		
			GID = instance.groups[instance.groups.length - 1].GID;
		
		}
		
		if (GID == -1) {
		
			GID = instance.addGroup({
			
				name: "Group"
			
			});
			
			RMCocoa.groupCreated(GID, "Group");
		
		}
		
		var pin = instance.addPin(GID, {
		
			name: place.name,
			location: {
			
				lat: place.geometry.location.lat(),
				lng: place.geometry.location.lng()
			
			}
		
		});
		
		RMCocoa.pinCreated(GID, pin.PID, place.name, place.geometry.location);
		
	});
	
}

/**
Set map options.

<pre>
options = {
	photos: {
		visible: true to show Panoramio layer,
		type: filter type (user or tag),
		filter: filter value
	},
	traffic: true to show traffic,
	[weather]: {
		weather: true to show weather,
		clouds: true to show clous,
		units: temperature units,
	},
	[kml]: {
		visible: true to show KML layer,
		url: KML/KMZ or GeoRSS URL,
		clickable: true to accept mouse clicks,
		viewport: true to preserve viewport
	},
	[type]: map type (roadmap, satellite, hybrid or terrain),
	[zoom]: zoom level,
	[center]: {
		lat: map latitude,
		lng: map longitude
	}
}
</pre>

@param {object} options See code above.
*/
RMEditor.prototype.setMap = function (options) {
	
	if (options.zoom) {
	
		this.map.setZoom(options.zoom);
	
	}
	
	if (options.center) {
	
		this.map.setCenter(new google.maps.LatLng(options.center.lat, options.center.lng));
	
	}
	
	if (options.weather) {
	
		this.weather.setOptions({
	
			map: options.weather.weather ? this.map : null,
			temperatureUnits: (options.weather.units == "fahrenheit") ? google.maps.weather.TemperatureUnit.FAHRENHEIT : google.maps.weather.TemperatureUnit.CELSIUS
			
		});
		this.clouds.setMap(options.weather.clouds ? this.map : null);
		
		
	}
	
	if (options.kml) {
	
		new google.maps.KmlLayer(options.kml.url, {
		
			map: options.kml.visible ? this.map : null,
			clickable: options.kml.clickable,
			preserveViewport: options.kml.viewport
			
		});
	
	}
	
	this.traffic.setMap(options.traffic ? this.map : null);

	if (options.photos.type == "user") {
	
		this.photos.setTag(null);
		this.photos.setUserId(options.photos.filter);
	
	}
	
	else {
	
		this.photos.setTag(options.photos.filter);
		this.photos.setUserId(null);
		
	}

	this.photos.setMap(options.photos.visible ? this.map : null);

}

/**
Geolocalize home.

@private
*/
RMEditor.prototype.setHome = function (move) {

	if (google.loader.ClientLocation) {
	
		var location = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
	
		if (move) {
		
			this.map.panTo(location);
			this.map.setZoom(12);
		
		}
	
	}

}

/**
Restore map, groups and pins.

<pre>
options = {
	zoom: zoom level,
	center: {
		lat: latitude of map center,
		lng: longitude of map center
	},
	type: map type (roadmap, satellite, hybrid or terrain),
	traffic: true to show traffic,
	photos: {
		visible: true to show Panoramio layer,
		type: filter type (user or tag),
		filter: filter value
	},
	weather: {
		weather: true to show weather,
		clouds: true to show clous,
		units: temperature units
	},
	kml: {
		visible: true to show KML layer,
		url: KML/KMZ or GeoRSS URL,
		clickable: true to accept mouse clicks,
		viewport: true to preserve viewport,
	},
	groups: [
		{
			name: group name,
			fill: {
				color: fill color,
				opacity: fill opacity
			},
			stroke: {
				color: stroke color,
				opacity: stroke opacity,
				thickness: stroke thickness
			},
			circles: true to show circles,
			area: true to show area,
			path: true to show path,
			route: {
				visible: true to show route,
				type: route type (driving, walking or bicycling)
			},
			pins: [
				{
					name: pin name,
					visible: true to show pin,
					location: {
						lat: pin latitude,
						lng: pin longitude
					},
					radius: circle radius,
					icon: {
						url: icon URL,
						size: {
							width: icon width,
							height: icon height
						},
						anchor: {
							x: anchor X position,
							y: anchor Y position
						},
						retina: false if not retina
					},
					label: {
						visible: true to show label,
						content: label content
					},
					action: {
						type: click action (label, url_in, url_out or none),
						url: link for url_in and url_out types
					}
				},
				...
			]
		},
		...
	]
}
</pre>

@private
*/
RMEditor.prototype.restoreMap = function (options) {

	this.setMap({
	
		type: options.type,
		zoom: options.zoom,
		center: options.center,
		traffic: options.traffic,
		weather: options.weather,
		photos: options.photos,
		kml: options.kml
	
	});
	
	this.restoreGroups(options.groups);
	
	if (this.edit) {
	
		RMCocoa.restoreCompleted();
		
	}

}

/**
Create a new group.

<pre>
options = {
	name: group name,
	[GID]: group ID,
	[fill]: {
		color: fill color,
		opacity: fill opacity
	},
	[stroke]: {
		color: stroke color,
		opacity: stroke opacity,
		thickness: stroke thickness
	},
	[icon]: {
		url: icon URL,
		size: {
			width: icon width,
			height: icon height
		},
		anchor: {
			x: anchor X position,
			y: anchor Y position
		},
		retina: false if not retina
	},
	[area]: true to show area,
	[path]: true to show path,
	[circles]: true to show circles,
	[route]: {
		visible: true to show route,
		type: route type
	}
}
</pre>

@param {object} options See code above
@returns {integer} ID of new group.
*/
RMEditor.prototype.addGroup = function (options) {

	var GID = options.GID || this.getGID();
	
	this.groups.push(new RMGroup({
	
		GID: GID,
		map: this.map,
		name: options.name,
		edit: this.edit,
		fill: options.fill || {
			
				color: "72a0e1",
				opacity: 0.25
			
		},
		stroke: options.stroke || {
		
			color: "72a0e1",
			opacity: 1,
			thickness: 2
		
		},
		icon: options.icon || {
		
			url: "images/pin.png",
			size: {
			
				width: 30,
				height: 44
			
			},
			anchor: {
			
				x: 14,
				y: 40
			
			},
            retina: true
		
		},
		area: options.area || false,
		path: options.path || false,
		circles: options.circles || false,
		route: {
		
			visible: options.route ? options.route.visible : false,
			type: options.route ? options.route.type : google.maps.TravelMode.DRIVING
		
		}
	
	}));
	
	return GID;

}

/**
Get a new GID.

@private
*/
RMEditor.prototype.getGID = function () {

	while (this.getGroup(this.GID) != null) {
		
		this.GID++;
		
	}
	
	return this.GID;
	
}

/**
Retrieve group object.

@private
*/
RMEditor.prototype.getGroup = function (GID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		if (this.groups[i].GID == GID) {
		
			return this.groups[i];
			
		}
		
	}
	
	return null;

}

/**
Remove group.

@param {integer} GID group ID.
*/
RMEditor.prototype.removeGroup = function (GID) {

	var group = this.getGroup(GID);
	
	for (var i = group.pins.length - 1; i >= 0; i--) {
	
		group.removePin(group.pins[i].PID);
	
	}

	for (var i = 0; i < this.groups.length; i++) {
	
		if (this.groups[i].GID == GID) {
		
			this.groups.splice(i, 1);
			return;
		
		}
	
	}

}

/**
Set group options.

<pre>
object = {
	name: group name,
	fill: {
		color: fill color,
		opacity: fill opacity
	},
	stroke: {
		color: stroke color,
		opacity: stroke opacity,
		thickness: stroke thickness
	},
	circles: true to show circles,
	area: true to show area,
	path: true to show path,
	route: {
		visible: true to show route,
		type: route type
	},
	[icon]: {
		url: icon URL,
		size: {
			width: icon width,
			height: icon height,
		},
		anchor: {
			x: anchor X position,
			y: anchor Y position
		},
		retina: false if not retina
	}
}
</pre>

@param {integer} GID Group ID.
@param {object} options See code above.
*/
RMEditor.prototype.setGroup = function (GID, options) {

	var group = this.getGroup(GID);
	
	group.setGroup(options);
	
	if (this.edit) {
	
		RMCocoa.pathLength(GID, google.maps.geometry.spherical.computeLength(group.path.getPath()));
		RMCocoa.areaSurface(GID, google.maps.geometry.spherical.computeArea(group.area.getPath()));
		
	}

}

/**
Select all pins in a group.

@param {integer} GID group ID.
*/
RMEditor.prototype.selectGroup = function (GID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		for (var j = 0; j < this.groups[i].pins.length; j++) {
		
			var pin = this.groups[i].pins[j];
		
			pin.setSelect(this.groups[i].GID == GID);
		
		}
	
	}

}

/**
Zoom and pan map to show all pins in a group.

@param {integer} GID group ID.
*/
RMEditor.prototype.zoomGroup = function (GID) {

	var group = this.getGroup(GID);
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < group.pins.length; i++) {
	
		bounds.extend(group.pins[i].marker.getPosition());
		
	}
	
	this.map.fitBounds(bounds);

}

/**
Restore groups and pins.

@private
*/
RMEditor.prototype.restoreGroups = function (groups) {

	for (var i = 0; i < groups.length; i++) {
	
		var group = groups[i];
	
		var GID = this.addGroup({
		
			name: group.name,
			GID: group.GID,
			stroke: group.stroke,
			fill: group.fill,
			icon: group.icon,
			circles: group.circles,
			path: group.path,
			area: group.area,
			route: {
			
				visible: false,
				type: group.route.type
			
			}
		
		});
		
		this.restorePins(GID, group.pins);
		
		if (group.route.visible) {
		
			var group = this.getGroup(GID);
			
			group.route.visible = true;
			group.findRoute();
		
		}
	
	}

}

/**
Add a new pin to the group.

<pre>
options = {
	name: pin name,
	[PID]: pin ID,
	[radius]: circle radius,
	[visible]: false to hide pin,
	[location]: {
		lat: pin latitude,
		lng: pin longitude
	},
	[icon]: {
		url: icon URL,
		size: {
			width: icon width,
			height: icon height
		},
		anchor: {
			x: anchor X position,
			y: anchor Y position
		},
		retina: false if not retina
	},
	[label]: {
		content: label content,
		visible: true to show on load
	},
	[action]: {
		type: action type (label, url_in, url_out or none),
		url: url for "url_in" or "url_out" actions
	},
	[index]: group position,
	[animation]: false to disable animation
}
</pre>

@param {integer} GID
@param {object} options See code above.
@returns {object} PID, latitude and londitude of new pin.
*/
RMEditor.prototype.addPin = function (GID, options) {

	var visible = (typeof options.visible == "undefined") ? true : options.visible;

	if (options.icon) {
	
		options.icon.url = options.icon.url;
	
	}

	var group = this.getGroup(GID);
	
	var PID = group.addPin({
	
		index: options.index || group.length,
		name: options.name,
		PID: options.PID || null,
		visible: visible,
		location: options.location ? new google.maps.LatLng(options.location.lat, options.location.lng) : this.map.getCenter(),
		radius: options.radius || 1609,
		map: this.map,
		draggable: this.edit,
		icon: options.icon || null,
		label: (!this.edit && options.label) ? options.label : {
		
			content: "",
			visible: false
			
		},
		action: (!this.edit && options.action) ? options.action : {
		
			type: "none",
			url: ""
		
		},
		animation: (typeof options.animation == "undefined") ? true : options.animation
		
	});
	
	if (this.cluster && visible) {
		
		this.cluster.addMarker(group.getPin(PID).marker);
		
	}
	
	if (this.edit) {
	
		var instance = this;
		
		google.maps.event.addListener(group.getPin(PID).marker, "click", function () {
		
			instance.selectPin(GID, PID);
		
		});
		
		google.maps.event.addListener(group.getPin(PID).marker, "rightclick", function () {
		
			instance.removePin(GID, PID);
			
			RMCocoa.removePin(GID, PID);
			RMCocoa.pathLength(GID, google.maps.geometry.spherical.computeLength(group.path.getPath()));
			RMCocoa.areaSurface(GID, google.maps.geometry.spherical.computeArea(group.area.getPath()));
	
		});
		
		google.maps.event.addListener(group.getPin(PID).arrow, "rightclick", function () {
		
			instance.removePin(GID, PID);
			RMCocoa.removePin(GID, PID);
	
		});
		
		google.maps.event.addListener(group.getPin(PID).marker, "drag", function (event) {
		
			for (var i = 0; i < instance.getGroup(GID).pins.length; i++) {
			
				if (instance.getGroup(GID).pins[i].PID == PID) {
				
					instance.getGroup(GID).path.getPath().setAt(i, event.latLng);
					instance.getGroup(GID).area.getPath().setAt(i, event.latLng);
					
					return;
				
				}
				
			}
			
		});
		
		google.maps.event.addListener(group.getPin(PID).arrow, "drag", function (event) {
		
			for (var i = 0; i < instance.getGroup(GID).pins.length; i++) {
			
				if (instance.getGroup(GID).pins[i].PID == PID) {
				
					instance.getGroup(GID).path.getPath().setAt(i, event.latLng);
					instance.getGroup(GID).area.getPath().setAt(i, event.latLng);
					
					return;
				
				}
				
			}
			
		});
		
		google.maps.event.addListener(group.getPin(PID).marker, "dragend", function (event) {
		
			instance.getGroup(GID).findRoute();
			
			RMCocoa.movePin(GID, PID, instance.getGroup(GID).getPin(PID).marker.getPosition());
			RMCocoa.pathLength(GID, google.maps.geometry.spherical.computeLength(instance.getGroup(GID).path.getPath()));
			RMCocoa.areaSurface(GID, google.maps.geometry.spherical.computeArea(instance.getGroup(GID).area.getPath()));
		
		});
		
		google.maps.event.addListener(group.getPin(PID).arrow, "dragend", function (event) {
		
			instance.getGroup(GID).findRoute();
			
			RMCocoa.movePin(GID, PID, instance.getGroup(GID).getPin(PID).marker.getPosition());
			RMCocoa.pathLength(GID, google.maps.geometry.spherical.computeLength(instance.getGroup(GID).path.getPath()));
			RMCocoa.areaSurface(GID, google.maps.geometry.spherical.computeArea(instance.getGroup(GID).area.getPath()));
		
		});
		
		this.selectPin(GID, PID);
	
		RMCocoa.pathLength(GID, google.maps.geometry.spherical.computeLength(group.path.getPath()));
		RMCocoa.areaSurface(GID, google.maps.geometry.spherical.computeArea(group.area.getPath()));
		
	}
	
	return {
	
		PID: PID,
		lat: group.getPin(PID).marker.getPosition().lat(),
		lng: group.getPin(PID).marker.getPosition().lng()
		
	};

}

/**
Remove pin.

@param {integer} GID Group ID.
@param {integer} PID Pin ID.
*/
RMEditor.prototype.removePin = function (GID, PID) {

	return this.getGroup(GID).removePin(PID);

}

/**
Set pin options.

<pre>
options = {
	name: pin name,
	visible: false to hide pin,
	radius: circle radius in meters,
	location: {
		lat: pin latitude,
		lng: pin longitude
	}
	[icon]: {
		url: icon URL,
		size: {
			width: icon width,
			height: icon height
		},
		anchor: {
			x: anchor X position,
			y: anchor Y position
		},
		retina: false if not retina
	}
}
</pre>

@param {integer} GID Group ID.
@param {integer} PID Pin ID.
@param {object} options See code above.
*/
RMEditor.prototype.setPin = function (GID, PID, options) {

	var group = this.getGroup(GID);
	
	group.setPin(PID, options);
	
	if (this.edit) {
	
		RMCocoa.pathLength(GID, google.maps.geometry.spherical.computeLength(group.path.getPath()));
		RMCocoa.areaSurface(GID, google.maps.geometry.spherical.computeArea(group.area.getPath()));
		
	}

}

/**
Select pin.

@param {integer} GID Group ID.
@param {integer} PID Pin ID.
*/
RMEditor.prototype.selectPin = function (GID, PID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		for (var j = 0; j < this.groups[i].pins.length; j++) {
		
			this.groups[i].pins[j].setSelect(this.groups[i].GID == GID && this.groups[i].pins[j].PID == PID);
		
		}
	
	}
	
	RMCocoa.selectPin(GID, PID);

}

/**
Pan map to show a pin.

@param {integer} GID Group ID.
@param {integer} PID Pin ID.
*/
RMEditor.prototype.zoomPin = function (GID, PID) {

	this.map.panTo(this.getGroup(GID).getPin(PID).marker.getPosition());

}

/**
Change order of pins.

<pre>
options = {
	GID: old Group ID,
	PID: old Pin ID,
	newGID: new Group ID,
	index: new position
}
</pre>

@param {object} options See code above.
*/
RMEditor.prototype.reorderPin = function (options) {

	var pin = this.removePin(options.GID, options.PID);
	
	return this.addPin(options.newGID, {
		
		name: pin.name,
		radius: pin.circle.getRadius(),
		visible: pin.visible,
		location: {
		
			lat: pin.marker.getPosition().lat(),
			lng: pin.marker.getPosition().lng()
			
		},
		icon: {
		
			url: pin.icons.normal.url,
			size: {
			
				width: pin.icons.normal.scaledSize.width * (pin.icons.normal.retina ? 2 : 1),
				height: pin.icons.normal.scaledSize.height * (pin.icons.normal.retina ? 2 : 1)
				
			},
			anchor: {
			
				x: pin.icons.normal.anchor.x * (pin.icons.normal.retina ? 2 : 1),
				y: pin.icons.normal.anchor.y * (pin.icons.normal.retina ? 2 : 1)
				
			},
			retina: pin.icons.normal.retina
			
		},
		label: pin.label,
		action: pin.action,
		index: options.index,
		animation: false
		
	});
	
	this.removePin(options.GID, options.PID);
	
	return this.addPin(newGID, options);
	
}

/**
Restore pins.

@private
*/
RMEditor.prototype.restorePins = function (GID, pins) {

	for (var i = 0; i < pins.length; i++) {
	
		var group = this.getGroup(GID);
		var pin = this.addPin(GID, {
		
			name: pins[i].name,
			PID: pins[i].PID,
			location: pins[i].location,
			icon: pins[i].icon,
			visible: this.edit || pins[i].visible,
			label: pins[i].label,
			radius: pins[i].radius,
			action: pins[i].action
		
		});
		
		if (this.edit) {
		
			group.getPin(pin.PID).setVisible(pins[i].visible);
		
		}
	
	}

}

/**
Bounce pin.

@param {integer} GID Group ID.
@param {integer} PID Pin ID.
*/
RMEditor.prototype.bouncePin = function (GID, PID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		for (var j = 0; j < this.groups[i].pins.length; j++) {
		
			this.groups[i].pins[j].marker.setAnimation((this.groups[i].GID == GID && this.groups[i].pins[j].PID == PID) ? google.maps.Animation.BOUNCE : null);
		
		}
	
	}

}

/**
Show pin's label.

@param {integer} GID Group ID.
@param {integer} PID Pin ID.
*/
RMEditor.prototype.showLabel = function (GID, PID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		for (var j = 0; j < this.groups[i].pins.length; j++) {
		
			if (typeof this.groups[i].pins[j].label != "undefined") {
			
				if (this.groups[i].GID == GID && this.groups[i].pins[j].PID == PID) {
					
					this.groups[i].pins[j].label.open(this.map, this.groups[i].pins[j].marker);
					
				}
				
				else {
					
					this.groups[i].pins[j].label.close();
					
				}
				
			}
		
		}
	
	}

}

/**
Show all pins in a group.

@param {integer} GID Group ID.
*/
RMEditor.prototype.showGroup = function (GID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		for (var j = 0; j < this.groups[i].pins.length; j++) {
		
			this.groups[i].pins[j].marker.setMap((this.groups[i].GID == GID || GID == -2) ? this.map : null);
		
		}
	
	}

}

/**
Show group's area.

@param {integer} GID Group ID.
*/
RMEditor.prototype.showArea = function (GID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		this.groups[i].area.setMap((this.groups[i].GID == GID || GID == -2) ? this.map : null);
	
	}

}

/**
Show group's path.

@param {integer} GID Group ID.
*/
RMEditor.prototype.showPath = function (GID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		this.groups[i].path.setMap((this.groups[i].GID == GID || GID == -2) ? this.map : null);
	
	}

}

/**
Show all pins' circles in a group.

@param {integer} GID Group ID.
*/
RMEditor.prototype.showCircles = function (GID) {

	for (var i = 0; i < this.groups.length; i++) {
	
		for (var j = 0; j < this.groups[i].pins.length; j++) {
		
			this.groups[i].pins[j].circle.setMap((this.groups[i].GID == GID || GID == -2) ? this.map : null);
		
		}
	
	}

}