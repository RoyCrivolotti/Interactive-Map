markerModule = (function () {
  var myMarker; // The specific marker for the address searched
  var markers = []; // All the markers from the search
  var routeMarkers = [];
  var mapBoundaries;
  var infoWindow;

  // Create a marker and display it on the map
  function showMyMarker(address, location) {
    myMarker = new google.maps.Marker({
      position: location,
      map: map,
      title: address
    });
    centerPos = markerModule.getMarkerPos();
    /* TODO: Create a marker in in position passed in and display it
    Don't forget: title, animation.
    Assign it to myMarker */
  }

  // Adds the address of the marker
  function addMarkerAddress(marker) {
    console.log('Marker loc: ' + marker.getPosition().lat() + ',' + marker.getPosition().lng());
    var markerLatLng = new google.maps.LatLng({
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng()
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

  // Removes all markers from the map and the array
  function removeMarkersPlaces() {
    removeMarkers(markersLugares);
  }

  // When the element 'typeOfPlace' changes, it marks all places near myMarker's location
  var typeOfPlace = document.getElementById('typeOfPlace');
  typeOfPlace.addEventListener('change', function () {
    if (typeOfPlace.value != '') markerModule.mark();
  });

  // When 'radius' changes, it marks all places near myMarker with this newly set radius
  var range = document.getElementById('radius');

  range.addEventListener('change', function () {
    markerModule.mark();
  });

  range.addEventListener('input', function () {
    showValue(range.value);
  });

  // Creates a marker that, when clicked, displays the info on the place
  createMarker = function (place) {
    var icono = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name + '\n' + place.vicinity,
      icon: icono
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'dblclick', function () {
      addMarkerAddress(marker);
    });

    google.maps.event.addListener(marker, 'rightclick', function () {
      var index;
      markers.forEach((i, element) => {
        if (markers[i] == marker) {
          markers[i].setMap(null);
          index = i;
          markers.splice(index, 1);
        }
      });
    });

    // When the marker is clicked, it shows the picture, name and rating
    var placeLoc = place.geometry.location;
    google.maps.event.addListener(marker, 'click', function () {
      streetViewModule.setStreetView(placeLoc);
      var rating = 'No tiene';
      if (place.rating) rating = place.rating.toString(); // Adds the info about the place to the marker window
      if (place.photos) var url = place.photos[0].getUrl({
        'maxWidth': 80,
        'maxHeight': 80
      });
      var name = place.name;
      var nameOfPlace = place.vecinity;

      if (url) {
        if (nameOfPlace) infoWindow.setContent('<h3>' + name + '</h3>' + '<img src=' + url + '>' + '<p> Rating: ' + rating + '</p>' + '<p> Direccion: ' + nameOfPlace + '</p>');
        else infoWindow.setContent('<h3>' + name + '</h3>' + '<img src=' + url + '>' + '<p> Rating: ' + rating + '</p>');
      } else infoWindow.setContent('<h3>' + name + '</h3>');

      infoWindow.open(map, this);
    });
  }

  // Extends the boundaries of the map given the place passed onto the function
  function extendBoundaries(place) {
    if (place.geometry.viewport) mapBoundaries.union(place.geometry.viewport);
    else mapBoundaries.extend(place.geometry.location);
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
    return myMarker != undefined;
  }

  function getMarkerPos() {
    return myMarker.getPosition();
  }

  // Adds the marker with its route and assigns it the corresponding letters; when clicked, it checks its position on StreetView
  function addRouteMarker(address, letters, isInitial) {
    removeMarkers(routeMarkers);

    var zIndex = 1;
    if (isInitial) zIndex = 2;

    function addMarkerWithStreetView(address, location) {
      var marker = new google.maps.Marker({
        map: map,
        position: location,
        label: letters,
        animation: google.maps.Animation.DROP,
        draggable: false,
        zIndex: zIndex
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
    console.log(status);
    if (status === google.maps.places.PlacesServiceStatus.OK) Array.from(results).forEach(element => {
      createMarker(element);
      extendBoundaries(element);
    });
    else alert('Geocode was not successful for the following reason: ' + status);
  }

  // Marks the places near my position
  function mark() {
    var position;
    removeMarkers(markers);
    console.log('Place: ' + document.getElementById('typeOfPlace').value)

    if (markerModule.myMarkerExists()) {
      position = markerModule.getMarkerPos();
      centerPos = position;
    } else position = centerPos;

    console.log('Nearby() called with: ' + position.toString());
    if (typeOfPlace.value != '') placesModule.searchPlacesNearby(position);
    map.panTo(position);
  }

  return {
    init,
    myMarkerExists,
    getMarkerPos,
    showMyMarker,
    addRouteMarker,
    removeMarkers,
    markPlaces,
    mark
  };
})();