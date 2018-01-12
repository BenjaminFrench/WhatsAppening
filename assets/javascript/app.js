// Initialize Firebase
var config = {
    apiKey: "AIzaSyBHIV5XSLliD3AKA3waOvxWWKdlbzaPY5k",
    authDomain: "whatsappening-bbad6.firebaseapp.com",
    databaseURL: "https://whatsappening-bbad6.firebaseio.com",
    projectId: "whatsappening-bbad6",
    storageBucket: "whatsappening-bbad6.appspot.com",
    messagingSenderId: "1086287293802"
};
firebase.initializeApp(config);
var database = firebase.database();  

var userLocation;
var userLocated = false;

var map;
var infoWindow;
var geocoder;

var markers = [];

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('mapDiv'), {
        center: {
            lat: 39.739,
            lng: -104.9903
        },
        zoom: 8,
        gestureHandling: 'cooperative',        
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ['roadmap', 'terrain']
        }    
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
            userLocated = true;

            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Location found.');
            // infoWindow.open(map);
            
            // Center map on user's location
            map.setCenter(pos);
            var date = Date();
            console.log(date);
            var userInfo = { 
                time: date,
                lat: pos.lat,
                lon: pos.lng
            };
            // latitude: userLocation.pos.lat;
            // longitude:

            database.ref().push(userInfo);

            // Make api call with user's location and no search query
            meetupCall(0);
            
        },
        function () {
            // Geolocation failed
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    console.log("Geolocation has failed or been blocked by user.");
    userLocated = false;

    // show modal if geolocation fails or is blocked
    $("#exampleModal1").foundation('open');

    // infoWindow.setPosition(pos);
    // infoWindow.setContent(browserHasGeolocation ?
    //     'Error: The Geolocation service failed.' :
    //     'Error: Your browser doesn\'t support geolocation.');
    // infoWindow.open(map);
}

function codeZip() {
    var zip = $('#search-box').val().trim();
    geocoder.geocode( { 'address': zip}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function drawEventMarker(name, description, lat, lon, url, urlname, label) {
    // Make content string for the markers infowindow
    var contentString = `<div id="content">
    <h4 id="firstHeading" class="firstHeading">${name}</h4>
    <div id="bodyContent">
    <p>${description}</p>
    <p><a href="${url}">${urlname}</a></p>
    </div>
    </div>`;

    // Crete the infowindow
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    // Create the marker
    var marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lon
        },
        map: map,
        title: name,
        label: label
    });

    // Click listener for markers
    marker.addListener('click', function () {
        // Open the marker's infowindow
        infowindow.open(map, marker);
        
        // Open the offcanvas sidebar, select tab 2
        $('#offCanvasRight').foundation('open', event);
        $("#sidebar-tabs-offcanvas").foundation('selectTab', 'panel2');
    });

    // Push each marker into a global array so we can delete them all later
    markers.push(marker);
}

// Delete all event markers on the map
function clearEventMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// function to call meetup api
function meetupCall(calltype) {
    var apiKey = "4f744e465f2424426f5d1a5b2532ab";
    var endpointUrl = "https://api.meetup.com/2/open_events";
    
    // Perfoming an AJAX GET request to our queryURL
    var zip = 80210;

    // format call based on calltype parameter
    switch (calltype) {
        // by current location
        case 0:
            if (!userLocated) {
                throw "User has not been GeoLocated"
            }
            else {
                var data = { lat: userLocation.lat, lon: userLocation.lng, radius: "10", key: apiKey };

            }
            break;
        // by zip
        case 1:
            zip = $("#search-box").val().trim();
            var data = { zip: zip, radius: "10", key: apiKey };
            break;

        default:
            throw "No calltype specified"
            break;
    }
    // clear the current events when making a new call
    if (markers.length !== 0) {
        clearEventMarkers();
    }

    $.ajax({
        url: endpointUrl,
        data: data,
        method: "GET"
    })
        .done(function (response) {
            if (response.results.length === 0) {
                throw "No results";
            }
            console.log(endpointUrl);

            for (var index = 0; index < 10; index++) {
                const element = response.results[index];
                var name = element.name;
                var desc = element.name;
                if (element.hasOwnProperty('venue')) {
                    var lat = element.venue.lat;
                    var lon = element.venue.lon;
                    var url = element.event_url;
                    var urlname = element.group.urlname;
                    drawEventMarker(name, desc, lat, lon, url, urlname, String(index + 1));
                }
                else if (element.hasOwnProperty('group')) {
                    var lat = element.group.group_lat;
                    var lon = element.group.group_lon;
                    var url = element.event_url;
                    var urlname = element.group.urlname;
                    drawEventMarker(name, desc, lat, lon, url, urlname, String(index + 1));
                }
            }

            map.setZoom(11);
        })
        .fail(function (err) {
            throw err;
        });
}

$("#search-button").on("click", function(event) {
    event.preventDefault();
    codeZip();
    meetupCall(1);
});

$("#location-img").on("click", function() {
    if (userLocated) {
        map.setCenter(userLocation);
        meetupCall(0);
    }
    else {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                userLocation = pos;
                userLocated = true;

                // infoWindow.setPosition(pos);
                // infoWindow.setContent('Location found.');
                // infoWindow.open(map);

                // Center map on user's location
                map.setCenter(pos);
                var date = Date();
                console.log(date);
                var userInfo = {
                    time: date,
                    lat: pos.lat,
                    lon: pos.lng
                };
                // latitude: userLocation.pos.lat;
                // longitude:

                database.ref().push(userInfo);

                // Make api call with user's location and no search query
                meetupCall(0);

            },
                function () {
                    // Geolocation failed
                    handleLocationError(true, infoWindow, map.getCenter());
                });
        }
        else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
});