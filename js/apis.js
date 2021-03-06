/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
let map;
let infoWindow;
let centerPos;
let usersLocation;
let lastAddressGeolocated;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: -34.599067,
			lng: -58.554811,
		},
		zoom: 11,
	});
	infoWindow = new google.maps.InfoWindow();

	// Try HTML5 geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(centerPosition => {
			centerPos = {
				lat: centerPosition.coords.latitude,
				lng: centerPosition.coords.longitude,
			};

			usersLocation = {
				lat: centerPosition.coords.latitude,
				lng: centerPosition.coords.longitude,
			};

			infoWindow.setPosition(centerPos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);

			setTimeout(() => {
				infoWindow.close();
			}, 1000);

			map.panTo(centerPos);
		}, () => handleLocationError(true, infoWindow, map.getCenter()));
	} else {
		// browser doesn't support geoLocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	geocodingModule.init();
	markerModule.init();
	directionsModule.init();
	placesModule.init();
	streetViewModule.init();

	const removeAllButton = document.getElementById('removeAllButton');
	map.controls[google.maps.ControlPosition.LEFT].push(removeAllButton);
}

function handleLocationError(browserHasGeolocation, infoWindow, centerPos) {
	infoWindow.setPosition(centerPos);
	infoWindow.setContent(browserHasGeolocation
		? 'Error: The Geolocation service failed.'
		: 'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}
