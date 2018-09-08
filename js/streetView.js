streetViewModule = (function () {
  var paronama; // StreetView

  function init() {
    let centerPos = map.getCenter();
    panorama = new google.maps.StreetViewPanorama(document.getElementById('streetView'), {
      position: centerPos,
      pov: {
        heading: 34,
        pitch: 10
      }
    });
    map.setStreetView(panorama);
  }

  function setStreetView(centerPos) {
    panorama.setPosition(centerPos);
  }

  return {
    init,
    setStreetView
  };
})();