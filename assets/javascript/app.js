var userLocation;

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('mapDiv'), {
        center: {
            lat: 39.739,
            lng: -104.9903
        },
        zoom: 8
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            userLocation = pos;

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
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

function drawEventMarker(name, description, lat, lon) {
    var contentString = `<div id="content">
    <h1 id="firstHeading" class="firstHeading">${name}</h1>
    <div id="bodyContent">
    <p>${description}</p>
    </div>
    </div>`;

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lon
        },
        map: map,
        title: name
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
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
function eventCall() {
  var apiKey = "JsML7nJWQcCg3rCb";
  // Perfoming an AJAX GET request to our queryURL
  var search;

  var queryUrl = "https://api.eventful.com/json/events/search?app_key=" + apiKey + "&where=32.746682,-117.162741&within=25";

  $.ajax({
    url: queryUrl,
    method: "GET",
    dataType: "json"
  })
    .done(function(response) {
        console.log(queryUrl);
        console.log(response.events.event[0].latitude);
        console.log(response.events.event[0].longitude);

    })
    .fail(function(err) {
      throw err;
    });
}






