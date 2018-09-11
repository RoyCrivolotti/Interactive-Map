# Interactive-Map

Small project; trying Google's Geocoding API while studying APIs and JS modules for a full stack course. Mostly Vanilla JS, some jQuery. No CSS frameworks or anything of the sort.

To make it work and try it out you have to get an API key and use it onin line 97 of the index.html document, where you'll find the following script tag

  <script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?v=3&key=YOUR_API_KEY&libraries=places&callback=initMap' async defer></script>

In short, get your credentials (https://developers.google.com/maps/documentation/javascript/get-api-key) and replace 'YOUR_API_KEY' with your key.

In a future update I'll probably change the front-end and make it more responsive. As of right now this will have to do since front-end design and responsiveness weren't the point of this project, but rather working with a nice API and javascript modules, writing some decent js code. Regardless, I'll probably change the front when I have some spare time just for the sake of it, to make it all tidier.
