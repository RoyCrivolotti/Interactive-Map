var map, infoWindow, centerPos, usersLocation;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.599067,
      lng: -58.554811
    },
    zoom: 11
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (centerPosition) {
      centerPos,
      usersLocation = {
        lat: centerPosition.coords.latitude,
        lng: centerPosition.coords.longitude
      };
      infoWindow.setPosition(centerPos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);

      setTimeout(function () {
        infoWindow.close();
      }, 1000);

      map.setCenter(centerPos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // browser doesn't support geoLocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  geocodingModule.init()
  markerModule.init()
  directionsModule.init()
  placesModule.init()
  streetViewModule.init()
}

function handleLocationError(browserHasGeolocation, infoWindow, centerPos) {
  infoWindow.setPosition(centerPos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}