/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
directionsModule = (function () {
	let addressService; let
		addresDisplay;

	// Calculates the routes when from/to/midDest are modified
	function calculateRouteOnChange() {
		document.getElementById('howToGo').addEventListener('change', () => {
			directionsModule.calcAndDisplayRoutes();
		});

		document.getElementById('calcularMuchos').addEventListener('click', () => {
			directionsModule.calcAndDisplayRoutes();
		});

		$('.places').forEach(destination => {
			destination.addEventListener('change', () => {
				if (document.getElementById('from').value !== '' && document.getElementById('to').value !== '') {
					directionsModule.calcAndDisplayRoutes();
				}
			});
		});
	}

	// Adds the addess to the list of midDestinationsColl (if they're not already in it)
	function addressToList(address, coords) {
		const midDestinationsColl = document.getElementById('midPoints');
		let needToAdd = true;

		midDestinationsColl.forEach((destination, i) => {
			if (midDestinationsColl.options[i].text.replace(/\r?\n|\r/g, ' ') === address.replace(/\r?\n|\r/g, ' ')) {
				needToAdd = false;
			}
		});

		if (needToAdd) {
			const opt = document.createElement('option');
			opt.value = coords;
			opt.innerHTML = address;
			midDestinationsColl.appendChild(opt);
		}
	}

	// Adds the addess to the list of midDestinationsColl and displays it on street view (gets calledevery time an address is effectively entered on the '#address' field)
	function addAndDisplayAddress(address, location) {
		const locationCoordsText = `${location.lat()},${location.lng()}`;
		addressToList(address, locationCoordsText);

		map.panTo(location);
		map.setZoom(14);
		centerPos = location;

		directionsModule.locationFoundWindow(location);
		streetViewModule.setStreetView(location);
		markerModule.showMyMarker(address, location);
	}

	function addAddress(address, location) {
		const locationCoordsText = `${location.lat()},${location.lng()}`;
		addressToList(address, locationCoordsText);
		map.panTo(location);
		directionsModule.locationFoundWindow(location);
		centerPos = location;
	}

	// Initializes the variables shown in the panel
	function init() {
		calculateRouteOnChange();
		// Adds the address when enter is pressed whilst being on the 'add' field

		$('#addDestination').keypress(event => {
			if (event.key === 'Enter' && hasNonEmptyChar($('#addDestination').val())) {
				const address = $('#addDestination').val();
				geocodingModule.useAddress(address, directionsModule.addAddress);
			}
		});

		// Calculates the routes when enter is pressed in 'from' and there is a non empty value in 'to'
		$('#from').keypress(event => {
			if (event.key === 'Enter') {
				geocodingModule.getAndPanToLocation($('#from').val());

				if (hasNonEmptyChar($('#to').val())) {
					directionsModule.calcAndDisplayRoutes();
				}
			}
		});

		// Calculates the routes when enter is pressed on 'to' and there is a non empry value on 'from'
		$('#to').keypress(event => {
			if (event.key === 'Enter') {
				geocodingModule.getAndPanToLocation($('#to').val());
				if (hasNonEmptyChar($('#from').val())) directionsModule.calcAndDisplayRoutes();
			}
		});

		addressService = new google.maps.DirectionsService();
		addresDisplay = new google.maps.DirectionsRenderer({
			draggable: true,
			map,
			panel: document.getElementById('directions-panel-summary'),
			suppressMarkers: true,
		});
	}

	// Calculates the routes between from and to and the mid-stops/destinations (depending on if the user set the way of transport as walking, driving or otherwise)
	function calcAndDisplayRoutes() {
		const from = $('#from').val();
		const to = $('#to').val();

		if (!hasNonEmptyChar(from) || !hasNonEmptyChar(to)) return;

		let meansOfTransport = $('#howToGo');

		switch (meansOfTransport) {
		case 'Walking':
			meansOfTransport = 'WALKING';
			break;
		case 'Car':
			meansOfTransport = 'DRIVING';
			break;
		case 'Public transport':
			meansOfTransport = 'TRANSIT';
			break;
		default:
			meansOfTransport = 'DRIVING';
			break;
		}

		const waypoints = [];

		const checkedMidPoints = document.querySelectorAll('#midPoints :checked');

		[].forEach.call(checkedMidPoints, element => {
			waypoints.push({ location: element.value, stopover: true });
		});

		const request = {
			origin: from,
			destination: to,
			travelMode: meansOfTransport,
			waypoints,
			optimizeWaypoints: false,
		};

		addressService.route(request, (result, status) => {
			if (status === 'OK') addresDisplay.setDirections(result);
		});
	}

	function locationFoundWindow(location) {
		infoWindow.setPosition(location);
		infoWindow.setContent('Location found.');
		infoWindow.open(map);
		setTimeout(() => {
			infoWindow.close();
		}, 1000);
	}

	function hasNonEmptyChar(string) {
		return /\S/.test(string);
	}

	return {
		init,
		addAddress,
		addressToList,
		addAndDisplayAddress,
		calcAndDisplayRoutes,
		locationFoundWindow,
	};
}());
