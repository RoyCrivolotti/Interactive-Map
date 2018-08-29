geocodingModule = (function () {
  var geocoder // given an address, returns coords

  function useAddress(address, functionToCall) {
    var locObj = geocoder.geocode({
      'address': address
    }, function (results, status) {
      if (status === 'OK') {
        functionToCall(address, results[0].geometry.location);
      } else alert('Geocode was not successful for the following reasons: ' + status);
    });
  }

  function init() {
    var that = this;
    geocoder = new google.maps.Geocoder();

    // When you enter an address, it's added and displayed
    document.querySelector('#address').addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        var address = document.getElementById('address').value;
        that.useAddress(address, directionsModule.addAndDisplayAddress);
      }
    });
  }

  return {
    useAddress,
    init
  };
})();