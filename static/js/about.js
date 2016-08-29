google.maps.event.addDomListener(window, 'load', init);
function init() {
    var map;
    var i = 0;
    var locations = [
      new google.maps.LatLng(40.4222722, -3.6868422),
      new google.maps.LatLng(51.5080843, -0.1095317),
      new google.maps.LatLng(52.51074, 13.3701413),
    ];

    var mapOptions = {
        center: locations[i],
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
        },
        disableDoubleClickZoom: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        },
        scaleControl: true,
        scrollwheel: false,
        panControl: false,
        streetViewControl: false,
        draggable: true,
        overviewMapControl: false,
        overviewMapControlOptions: {
            opened: false,
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {"color": "#d3d3d3"}
                ]
            }, {
                "featureType": "transit",
                "stylers": [
                    {"color": "#808080"},
                    {"visibility": "off"}
                ]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#b3b3b3"}
                ]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {"color": "#ffffff"}
                ]
            }, {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#ffffff"},
                    {"weight": 1.8}
                ]
            }, {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [
                    {"color": "#d7d7d7"}
                ]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#ebebeb"}
                ]
            }, {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {"color": "#a7a7a7"}
                ]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {"color": "#ffffff"}
                ]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {"color": "#ffffff"}
                ]
            }, {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#efefef"}
                ]
            }, {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"color": "#696969"}
                ]
            }, {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {"visibility": "on"},
                    {"color": "#737373"}
                ]
            }, {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {"visibility": "off"}
                ]
            }, {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {"visibility": "off"}
                ]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                    {"color": "#d6d6d6"}
                ]
            }, {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {"visibility": "off"}
                ]
            }, {}, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {"color": "#dadada"}
                ]
            }
        ],
    }

    var mapElement = document.getElementById('map-tyba');
    var map = new google.maps.Map(mapElement, mapOptions);

    function addMarker(point) {
      marker = new google.maps.Marker({
          icon: 'https://mapbuildr.com/assets/img/markers/default.png',
          position: point,
          map: map,
          title: 'Tyba',
          desc: '',
          tel: '',
          email: '',
          web: ''
      });
    }

    function changeCenter(i) {
      map.panTo(locations[i]);
      addMarker(locations[i]);
    }

    addMarker(locations[i]);

    $('.map-change').click(function () {
      var elem = $(this);
      changeCenter(elem.index() - 1);
      $('.address-item').removeClass('active-address');
      elem.addClass('active-address');
    });
}
