/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-alert */
geocodingModule = (function () {
	let geocoder; // given an address, returns coords object

	function useAddress(address, functionToCall) {
		geocoder.geocode({
			address,
		}, (results, status) => {
			if (status === 'OK') {
				functionToCall(address, results[0].geometry.location);
				lastAddressGeolocated = results[0].geometry.location;
			} else {
				alert(`Geocode was not successful for the following reasons: ${status}`);
			}
		});
	}

	function getAndPanToLocation(address) {
		geocoder.geocode({ address }, (results, status) => {
			if (status === 'OK') {
				lastAddressGeolocated = results[0].geometry.location;
				centerPos = lastAddressGeolocated;
				map.panTo(lastAddressGeolocated);
				directionsModule.locationFoundWindow(lastAddressGeolocated);
				streetViewModule.setStreetView(lastAddressGeolocated);
			} else {
				alert(`Geocode was not successful for the following reasons: ${status}`);
			}
		});
	}

	function init() {
		const that = this;
		geocoder = new google.maps.Geocoder();

		// When you enter an address, it's added and displayed
		document.querySelector('#address').addEventListener('keypress', event => {
			if (event.key === 'Enter') {
				that.useAddress($('#address').val(), directionsModule.addAndDisplayAddress);
			}
		});
	}

	return { useAddress, init, getAndPanToLocation };
}());
