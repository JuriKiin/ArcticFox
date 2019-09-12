let map;
let markers = [];
let tempMarker;

//Initalize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), { //Create the map
        center: {lat: 43.084587, lng: -77.674347},
        zoom: 13,
        streetViewControl: false,
        mapTypeControl: false,
        rotateControl: false,
        fullscreenControl: false
    });
    map.addListener('click', (e) => {   //Add a click event to add a marker
        if(tempMarker) tempMarker.setMap(null);
        tempMarker = new google.maps.Marker({position: e.latLng, map: map});
        map.setZoom(14);
        map.panTo(tempMarker.getPosition());
        document.querySelector('#lat').value = tempMarker.getPosition().lat().toFixed(7);
        document.querySelector('#lng').value = tempMarker.getPosition().lng().toFixed(7);
    });
}

//Create markers on the google map given a place.
function addMarkersFromData(e) {
    let marker = new google.maps.Marker({position: {lat: parseFloat(e.lat), lng: parseFloat(e.lng)}, map: map});
    //Create info window here
    let contentString = '<div>'
        + '<h1 class="align-left font-header">'+e.name+'</h1>'
        + '<p>'+e.lat + ' ' + e.lng+'</p>'
        + '<p>'+e.description+'</p>'
        +'</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

    marker.addListener('click', () => {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
        infowindow.open(map, marker);
    });
    markers.push(marker);
}