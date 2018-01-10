var userLocation;

var map, infoWindow;

var markers = [];

function initMap() {
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

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            
            //
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

function drawEventMarker(name, description, lat, lon, url, urlname, label) {
    var contentString = `<div id="content">
    <h4 id="firstHeading" class="firstHeading">${name}</h4>
    <div id="bodyContent">
    <p>${description}</p>
    <p><a href="${url}">${urlname}</a></p>
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
        title: name,
        label: label
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

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
    // Perfoming an AJAX GET request to our queryURL
    var search;

    // format call based on calltype parameter
    switch (calltype) {
        case 0:

            break;
        case 1:

            break;
        case 2:

            break;
        case 3:

            break;

        default:
            break;
    }
    var data = { lat: userLocation.lat, lon: userLocation.lng, radius: "5", key: apiKey };
    var queryUrl = "https://api.meetup.com/2/open_events";

    $.ajax({
        url: queryUrl,
        data: data,
        method: "GET"
    })
        .done(function (response) {
            console.log(queryUrl);
            console.log(response.results[0].venue.lat);
            console.log(response.results[0].venue.lon);

            for (let index = 0; index < 10; index++) {
                const element = response.results[index];
                let name = element.name;
                let desc = element.name;
                if (element.hasOwnProperty('venue')) {
                    let lat = element.venue.lat;
                    let lon = element.venue.lon;
                    let url = element.event_url;
                    let urlname = element.group.urlname;
                    drawEventMarker(name, desc, lat, lon, url, urlname, String(index + 1));
                }
                else if (element.hasOwnProperty('group')) {
                    let lat = element.group.group_lat;
                    let lon = element.group.group_lon;
                    let url = element.event_url;
                    let urlname = element.group.urlname;
                    drawEventMarker(name, desc, lat, lon, url, urlname, String(index + 1));
                }
            }
        })
        .fail(function (err) {
            throw err;
        });
}

// function to call eventful api
function eventCall() {
  var apiKey = "JsML7nJWQcCg3rCb";
  // Perfoming an AJAX GET request to our queryURL
  var search;

  var queryUrl = "https://api.eventful.com/json/events/search?app_key=" + apiKey + "&where=39.739,-104.9903&within=25";

  $.ajax({
    url: queryUrl,
    method: "GET",
    dataType: "json"
  })
    .done(function(response) {
        console.log(queryUrl);
        console.log(response.events.event[0].latitude);
        console.log(response.events.event[0].longitude);

        for (let index = 0; index < 10; index++) {
            const element = response.events.event[index];
            let name = element.title;
            let desc = element.description;
            let lat = parseFloat(element.latitude);
            let lon = parseFloat(element.longitude);
            let url = element.url;
            let urlname = element.title;
            drawEventMarker(name, desc, lat, lon, url, urlname, String(index+1));
        }

    })
    .fail(function(err) {
      throw err;
    });
}
