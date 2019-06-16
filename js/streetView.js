/* eslint-disable max-len */
/* eslint-disable no-undef */
streetViewModule = (function () {
	let paronama; // StreetView

	function init() {
		panorama = new google.maps.StreetViewPanorama(document.getElementById('streetView'), {
			position: map.getCenter(),
			pov: {
				heading: 34,
				pitch: 10,
			},
		});

		map.setStreetView(panorama);

		panorama.addListener('position_changed', () => map.setCenter(panorama.getPosition()));
	}

	function setStreetView(centerPos) {
		panorama.setPosition(centerPos);
	}

	return {
		init,
		setStreetView,
	};
}());
