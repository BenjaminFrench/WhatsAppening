var map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('mapDiv'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
}

function meetupCall() {
  var apiKey = "4f744e465f2424426f5d1a5b2532ab";
  // Perfoming an AJAX GET request to our queryURL
  var search;

  var queryUrl = "https://api.meetup.com/2/open_events?zip=80222&radius=5&key=" + apiKey;
// https://api.meetup.com/2/open_events?zip=80210&key=4f744e465f2424426f5d1a5b2532ab
  $.ajax({
    url: queryUrl,
    method: "GET"
  })
    .done(function(response) {
        console.log(queryUrl);
        console.log(response.results[0].venue.lat);
        console.log(response.results[0].venue.lon);
        //response.results[0]
    })
    .fail(function(err) {
      throw err;
    });
}






