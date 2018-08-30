placesModule = (function () {
  var placesService; // To get places nearby and data about them (pics, rating, etc)

  // Autocomplete users input and establish the boundaries with a 20k-mts-radius circle
  function autocomplete() {
    var autocompletePlaces = getAutocompletePlaces();
    if (autocompletePlaces.input == undefined || autocompletePlaces.places.length == 0) return;
    autocompletePlaces.places.addListener('place_changed', function () {
      var place = autocompletePlaces.places.getPlace();
      geocodingModule.useAddress($('#address').val(), directionsModule.addAndDisplayAddress);
      map.panTo(place.geometry.location);
      map.setZoom(12);
      search();
    });
  }

  function getAutocompletePlaces() {
    var autocompletePlaces, inputField;
    $('#left-panel .write-input').change(function () {
      inputField = this;
      let center;

      if ($('#address').val() != '' && lastAddressGeolocated != undefined) center = lastAddressGeolocated;
      else if (usersLocation != undefined) center = usersLocation;
      else return;

      console.log('Center: ' + center);

      circle = new google.maps.Circle({
        center: center,
        radius: 20000,
        visible: false
      });

      autocompletePlaces = new google.maps.places.Autocomplete(this, {
          strictBounds: true
        }),
        autocompletePlaces.setBounds(circle.getBounds());
    });
    return {
      input: inputField,
      places: autocompletePlaces
    };
  }

  function init() {
    placesService = new google.maps.places.PlacesService(map);
    autocomplete();
  }

  // Search places by the specified type in the 'typeOfPlace' field
  function searchPlacesNearby(position) {
    let typeOfPlace = document.getElementById('typeOfPlace').value;
    let radius = document.getElementById('radius').value;
    // console.log(placesService);
    placesService.nearbySearch({
      location: position,
      radius: radius,
      type: typeOfPlace
    }, markerModule.markPlaces);
  }

  return {
    init,
    searchPlacesNearby
  };
})();