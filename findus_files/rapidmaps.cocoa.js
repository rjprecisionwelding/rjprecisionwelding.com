var RMCocoa = {};

RMCocoa.APIsLoaded = function () {

	console.log("Google Maps APIs are loaded.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.mapAPIsLoaded();
		
	}

}

RMCocoa.editorReady = function () {

	console.log("RapidMaps editor is ready.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.editorReady();
		
	}

}

RMCocoa.restoreCompleted = function () {

	console.log("Map restore is complete.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.mapRestoreCompleted();
		
	}

}

RMCocoa.mapChanged = function (location, zoom, type) {

	console.log("Map centered at location " + location + " with zoom " + zoom + " and type \"" + type + "\"");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.mapCenteredAtLatitude_andLongitude_withZoom_andType_(location.lat(), location.lng(), zoom, type);
		
	}
	
}

RMCocoa.groupCreated = function (GID, name) {

	console.log("Group " + GID + " with name \"" + name + "\" created.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.groupCreatedWithGid_andName_(GID, name);
		
	}

}

RMCocoa.pinCreated = function (GID, PID, name, location) {

	console.log("Pin " + PID + " with name \"" + name + "\" in group " + GID + " created at location " + location + ".");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.pinCreatedWithGid_andPid_andName_atLatitude_andLongitude_(GID, PID, name, location.lat(), location.lng());
		
	}
	
}

RMCocoa.movePin = function (GID, PID, location) {

	console.log("Pin " + PID + " in group " + GID + " moved to " + location + ".");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.movePinWithGid_andPid_toLatitude_andLongitude_(GID, PID, location.lat(), location.lng());
		
	}

}

RMCocoa.removePin = function (GID, PID) {

	console.log("Pin " + PID + " in group " + GID + " removed.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.removePinWithGid_andPid_(GID, PID);
	
	}

	

}

RMCocoa.selectPin = function (GID, PID) {

	console.log("Pin " + PID + " in group " + GID + " selected.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.selectPinWithGid_andPid_(GID, PID);
	
	}

}

RMCocoa.sendMessage = function (message) {

	console.log(message);
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.errorMessage_(message);
	
	}

}

RMCocoa.selectMap = function (type) {

	console.log("Map " + type + " selected.");
		
	if (typeof window.ORM != "undefined") {

		window.ORM.switchMapStyleTo_(type);
		
	}

}

RMCocoa.pathLength = function (GID, length) {

	console.log("Group " + GID + " path is " + (length / 1000).toFixed(2) + " km long.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.pathCalculatedWithGid_andLength_(GID, length);
	
	}

}

RMCocoa.areaSurface = function (GID, surface) {

	console.log("Group " + GID + " area is " + (surface / 1000 / 1000).toFixed(2) + " km² wide.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.areaCalculatedWithGid_andSurface_(GID, surface);
	
	}

}

RMCocoa.routeLength = function (GID, length) {

	console.log("Group " + GID + " route is " + length.text + " long.");
	
	if (typeof window.ORM != "undefined") {
	
		window.ORM.routeCalculatedWithGid_andLength_(GID, length.value);
	
	}

}