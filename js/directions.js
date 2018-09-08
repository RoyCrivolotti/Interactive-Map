directionsModule = (function () {
  var addressService, addresDisplay;

  // Calculates the routes when from/to/midDest are modified
  function calculateRouteOnChange() {
    document.getElementById('howToGo').addEventListener('change', function () {
      directionsModule.calcAndDisplayRoutes();
    });

    document.getElementById('calcularMuchos').addEventListener('click', function () {
      directionsModule.calcAndDisplayRoutes();
    });

    let destinationsColl = $('.places');
    for (let i = 0; i < destinationsColl.length; i++) {
      destinationsColl[i].addEventListener('change', function () {
        if (document.getElementById('from').value != '' && document.getElementById('to').value != '') directionsModule.calcAndDisplayRoutes();
      });
    }
  }

  // Adds the addess to the list of midDestinationsColl (if they're not already in it)
  function addressToList(address, coords) {
    var midDestinationsColl = document.getElementById('midPoints');
    var needToAdd = true;

    for (let i = 0; i < midDestinationsColl.length; i++) {
      if (midDestinationsColl.options[i].text.replace(/\r?\n|\r/g, ' ') === address.replace(/\r?\n|\r/g, ' ')) needToAdd = false;
    }

    if (needToAdd) {
      var opt = document.createElement('option');
      opt.value = coords;
      opt.innerHTML = address;
      midDestinationsColl.appendChild(opt);
    }
  }

  // Adds the addess to the list of midDestinationsColl and displays it on street view (gets calledevery time an address is effectively entered on the '#address' field)
  function addAndDisplayAddress(address, location) {
    console.log('Address entered: ' + location.toString());
    var locationCoordsText = location.lat() + ',' + location.lng();
    addressToList(address, locationCoordsText);
    map.panTo(location);
    map.setZoom(14);
    centerPos = location;
    directionsModule.locationFoundWindow(location);

    streetViewModule.setStreetView(location);
    markerModule.showMyMarker(address, location);
  }

  function addAddress(address, location) {
    var locationCoordsText = location.lat() + ',' + location.lng();
    addressToList(address, locationCoordsText);
    map.panTo(location);
    directionsModule.locationFoundWindow(location);
    centerPos = location;
  }

  // Initializes the variables shown in the panel
  function init() {
    calculateRouteOnChange();
    // Adds the address when enter is pressed whilst being on the 'add' field
    $('#addDestination').keypress(function (event) {
      if (event.key === 'Enter' && hasNonEmptyChar($('#addDestination').val())) {
        var address = $('#addDestination').val();
        geocodingModule.useAddress(address, directionsModule.addAddress);
      }
    });

    // Calculates the routes when enter is pressed in 'from' and there is a non empty value in 'to'
    $('#from').keypress(function (event) {
      if (event.key === 'Enter') {
        geocodingModule.getAndPanToLocation($('#from').val());
        if (hasNonEmptyChar($('#to').val())) directionsModule.calcAndDisplayRoutes();
      }
    });

    // Calculates the routes when enter is pressed on 'to' and there is a non empry value on 'from'
    $('#to').keypress(function (event) {
      if (event.key === 'Enter') {
        geocodingModule.getAndPanToLocation($('#to').val());
        if (hasNonEmptyChar($('#from').val())) directionsModule.calcAndDisplayRoutes();
      }
    });

    addressService = new google.maps.DirectionsService();
    addresDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map,
      panel: document.getElementById('directions-panel-summary'),
      suppressMarkers: true
    });
  }

  // Calculates the routes between from and to and the mid-stops/destinations (depending on if the user set the way of transport as walking, driving or otherwise)
  function calcAndDisplayRoutes() {
    let from = $('#from').val();
    let to = $('#to').val();

    // '/\S/.test(string)' returns true if there's a non-blank character in the String, with tabs and newlines counting as whitespaces; is there is no non-blank char, it breaks execution
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

    var waypoints = [];

    var checkedMidPoints = document.querySelectorAll('#midPoints :checked');
    [].forEach.call(checkedMidPoints, element => {
      console.log("Element: " + element);
      waypoints.push({
        location: element.value,
        stopover: true
      });
    });

    let request = {
      origin: from,
      destination: to,
      travelMode: meansOfTransport,
      waypoints: waypoints,
      optimizeWaypoints: false
    };

    addressService.route(request, (result, status) => {
      if (status == 'OK') addresDisplay.setDirections(result);
    });
  }

  function locationFoundWindow(location) {
    infoWindow.setPosition(location);
    infoWindow.setContent('Location found.');
    infoWindow.open(map);
    setTimeout(function () {
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
    locationFoundWindow
  };
}());