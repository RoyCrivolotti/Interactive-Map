/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
placesModule = (function () {
	let placesService; // To get places nearby and data about them (pics, rating, etc)

	// Autocomplete users input and establish the boundaries with a 20k-mts-radius circle
	function autocomplete() {
		const autocompletePlaces = getAutocompletePlaces();
		if (autocompletePlaces.input == undefined || autocompletePlaces.places.length === 0) {
			return;
		}

		autocompletePlaces.places.addListener('place_changed', () => {
			geocodingModule.useAddress($('#address').val(), directionsModule.addAndDisplayAddress);
		});
	}

	function getAutocompletePlaces() {
		let autocompletePlaces;
		let inputField;

		$('#left-panel .write-input').focus(event => {
			inputField = event.target;
			let center;

			if ($('#address').val() !== '' && lastAddressGeolocated !== undefined) {
				center = lastAddressGeolocated;
			} else if (usersLocation !== undefined) {
				center = usersLocation;
			} else return;

			circle = new google.maps.Circle({ center, radius: 20000, visible: false });

			autocompletePlaces = new google.maps.places.Autocomplete(inputField, { strictBounds: true });
			autocompletePlaces.setBounds(circle.getBounds());
		});

		return { input: inputField, places: autocompletePlaces };
	}

	function init() {
		placesService = new google.maps.places.PlacesService(map);
		autocomplete();
	}

	// Search places by the specified type in the 'typeOfPlace' field
	function searchPlacesNearby(position) {
		const typeOfPlace = document.getElementById('typeOfPlace').value;
		const radius = document.getElementById('radius').value;

		placesService.nearbySearch({
			location: position,
			radius,
			type: typeOfPlace,
		}, markerModule.markPlaces);
	}

	return { init, searchPlacesNearby };
}());
