/* eslint-disable max-len */
/* eslint-disable no-undef */
markerModule = (function () {
	let myMarker; // The specific marker for the address searched
	let markers = []; // All the markers from the search
	const routeMarkers = [];
	let mapBoundaries;
	let infoWindow;

	// Create a marker and display it on the map
	function showMyMarker(address, location) {
		myMarker = new google.maps.Marker({
			position: location,
			map,
			title: address,
		});
		centerPos = markerModule.getMarkerPos();
	}

	// Adds the address of the marker
	function addMarkerAddress(marker) {
		const markerLatLng = new google.maps.LatLng({
			lat: marker.getPosition().lat(),
			lng: marker.getPosition().lng(),
		});

		directionsModule.addAddress(marker.getTitle(), markerLatLng);
	}

	// Adds the markers passed as a parameter to the array and displays them on the map
	function markerOnMap(markers, map) {
		markers.forEach(element => element.setMap(map));
	}

	// Displays all the markers in the array
	function showMarkers(markers) {
		markerOnMap(markers, map);
	}

	// Hides the markers from the map, doesn't remove them
	function hideMarkers(markers) {
		markerOnMap(markers, null);
	}

	// Removes the markers being passed as a parameter (from the map and the array)
	function removeMarkers(someMarkers) {
		hideMarkers(someMarkers);
		markers = markers.filter(element => someMarkers.indexOf(element) === -1);
	}

	// Removes route markers (from the map and the array)
	function removeRouteMarkers() {
		removeMarkers(routeMarkers);
	}

	$('#removeAllButton').click(() => {
		hideMarkers(markers);
		markers = [];
	});

	// When the element 'typeOfPlace' changes, it marks all places near myMarker's location
	const typeOfPlace = document.getElementById('typeOfPlace');
	typeOfPlace.addEventListener('change', () => {
		if (typeOfPlace.value !== '') markerModule.mark();
	});

	// When 'radius' changes, it marks all places near myMarker with this newly set radius
	const range = document.getElementById('radius');

	range.addEventListener('change', () => {
		markerModule.mark();
	});

	range.addEventListener('input', () => {
		showValue(range.value);
	});

	// Creates a marker that, when clicked, displays the info on the place
	createMarker = function (place) {
		const icono = {
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25),
		};

		const marker = new google.maps.Marker({
			map,
			position: place.geometry.location,
			title: `${place.name}\n${place.vicinity}`,
			icon: icono,
		});

		markers.push(marker);

		google.maps.event.addListener(marker, 'dblclick', () => {
			addMarkerAddress(marker);
		});

		google.maps.event.addListener(marker, 'rightclick', () => {
			let index;
			markers.forEach((element, i) => {
				if (element === marker) {
					markers[i].setMap(null);
					index = i;
					markers.splice(index, 1);
				}
			});
		});

		// When the marker is clicked, it shows the picture, name and rating
		const placeLoc = place.geometry.location;
		google.maps.event.addListener(marker, 'click', function () {
			let url;

			streetViewModule.setStreetView(placeLoc);
			let rating = 'No tiene';
			if (place.rating) rating = place.rating.toString(); // Adds the info about the place to the marker window

			if (place.photos) {
				url = place.photos[0].getUrl({ maxWidth: 80, maxHeight: 80 });
			}

			const { name } = place;
			const nameOfPlace = place.vecinity;

			if (url) {
				if (nameOfPlace) {
					infoWindow.setContent(`
				<h3>${name}</h3>
				<img src=${url}>
				<p> Rating: ${rating}</p>
				<p> Direccion: ${nameOfPlace}</p>`);
				} else {
					infoWindow.setContent(`
				<h3>${name}</h3>
				<img src=${url}>
				<p> Rating: ${rating}</p>`);
				}
			} else {
				infoWindow.setContent(`<h3>${name}</h3>`);
			}

			infoWindow.open(map, this);
		});
	};

	// Extends the boundaries of the map given the place passed onto the function
	function extendBoundaries(place) {
		if (place.geometry.viewport) {
			mapBoundaries.union(place.geometry.viewport);
		} else {
			mapBoundaries.extend(place.geometry.location);
		}
		map.fitBounds(mapBoundaries);
	}

	// Shows the marker when the address field is pressed
	function init() {
		$('#address').keypress(event => {
			if (event.key === 'Enter') markerModule.showMyMarker();
		});

		infoWindow = new google.maps.InfoWindow();
		mapBoundaries = new google.maps.LatLngBounds();
	}

	function myMarkerExists() {
		return myMarker !== undefined;
	}

	function getMarkerPos() {
		return myMarker.getPosition();
	}

	// Adds the marker with its route and assigns it the corresponding letters; when clicked, it checks its position on StreetView
	function addRouteMarker(address, letters, isInitial) {
		removeMarkers(routeMarkers);

		let zIndex = 1;
		if (isInitial) zIndex = 2;

		function addMarkerWithStreetView(address, location) {
			const marker = new google.maps.Marker({
				map,
				position: location,
				label: letters,
				animation: google.maps.Animation.DROP,
				draggable: false,
				zIndex,
			});

			mapBoundaries.extend(location);
			google.maps.event.addListener(marker, 'click', () => streetViewModule.setStreetView(marker.position));
			routeMarkers.push(marker);
		}

		geocodingModule.useAddress(address, addMarkerWithStreetView);
		map.fitBounds(mapBoundaries);
	}

	// Marks the places in the array results and extends the map boundaries considering the new places
	function markPlaces(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			Array.from(results).forEach(element => {
				createMarker(element);
				extendBoundaries(element);
			});
		} else alert(`Geocode was not successful for the following reason: ${status}`);
	}

	// Marks the places near my position
	function mark() {
		let position;
		removeMarkers(markers);

		if (markerModule.myMarkerExists()) {
			position = markerModule.getMarkerPos();
			centerPos = position;
		} else position = centerPos;

		if (typeOfPlace.value !== '') placesModule.searchPlacesNearby(position);
	}

	return {
		init,
		myMarkerExists,
		getMarkerPos,
		showMyMarker,
		addRouteMarker,
		removeMarkers,
		markPlaces,
		mark,
	};
}());
