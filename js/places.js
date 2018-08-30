placesModule = (function () {
  var placesService; // To get places nearby and data about them (pics, rating, etc)

  // Autocomplete users input and establish the boundaries with a 20k-mts-radius circle
  function autocomplete() {
    var autocompletePlaces = getAutocompletePlaces();
    if (autocompletePlaces.input == undefined || autocompletePlaces.places.length == 0) return;
    autocompletePlaces.places.addListener('place_changed', function () {
      var place = autocompletePlaces.places.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(12);
        search();
      } else autocompletePlaces.input.placeholder = 'Enter an address ⏎';
    });

    /* Autocomplete the 4 text fields (the addresses the user can input).
    Create a circle with a 20k mts radius and set the boundaries of the address search (the circle is, obviously, not to be seen on the map) */
  }

  function getAutocompletePlaces() {
    var autocompletePlaces, inputField;
    $('#left-panel .write-input').change(function () {
      inputField = this;
      let center;

      if ($('#from').val() != '') center = $('#from').val();
      else if ($('#address').val() != '' && lastAddressGeolocated != undefined) center = lastAddressGeolocated;
      else if (usersLocation != undefined) center = usersLocation;
      else return;

      circle = new google.maps.Circle({
        strokeOpacity: 0,
        fillOpacity: 0,
        center: center,
        radius: 20000
      });

      autocompletePlaces = new google.maps.places.Autocomplete(
        this, {
          types: ['geocode'],
        }
      );
      autocomplete.setBounds(circle.getBounds());
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
    let typeOfPlace = document.getElementById('typeOfPlace');
    let radius = document.getElementById('radius');
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