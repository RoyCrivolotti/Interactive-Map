placesModule = (function () {
  var placesService // To get places nearby and data about them (pics, rating, etc.)

  // Autocomplete users input and establish the boundaries with a 20k-mts-radius circle
  function autocomplete() {
    /* Autocomplete the 4 text fields (the addresses the user can input).
    Create a circle with a 20k mts radius and set the boundaries of the address search (the circle is, obviously, not to be seen on the map) */
  }

  function init() {
    placesService = new google.maps.places.PlacesService(map);
    autocomplete();
  }

  // Search places by the specified type in the 'typeOfPlace' field
  function searchPlacesNearby(position) {
    let typeOfPlace = document.getElementById('typeOfPlace');
    let radius = document.getElementById('radius');
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