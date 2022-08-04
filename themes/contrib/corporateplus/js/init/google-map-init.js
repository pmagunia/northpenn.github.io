(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.mtGoogleMaps = {
    attach: function (context, settings) {

      var mapSelectorClass = "google-map-canvas";
      var mapSelector = "." + mapSelectorClass;

      function initialize() {
        $(context).find(mapSelector).once('mtGoogleMapsInit').each(function(index, item) {
          var map_locations_string = $(this).attr('data-attribute-mt-locations');
          var locations = JSON.parse(map_locations_string);
          var zoom = parseInt($(this).attr('data-attribute-mt-map-zoom'));
          var mapCenter = null;

          var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
          };

          // Hack for Dark-mode since it's not currently widely supported
          if ($('body').css('background-color') == 'rgb(39, 39, 39)') {
            mapOptions = {
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              scrollwheel: false,
              styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]
            };
          }

          var map = new google.maps.Map(this,mapOptions);
          var bounds = new google.maps.LatLngBounds();
          var infowindow = new google.maps.InfoWindow();
          var marker, i;

          for (i = 0; i < locations.length; i++) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(locations[i][1], locations[i][2]),
              map: map,
              draggable:false
            });
            bounds.extend(marker.position);
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
              return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
              }
            })(marker, i));
          }
          map.fitBounds(bounds);

          google.maps.event.addDomListener(window, "resize", function() {
            if (locations.length > 1) {
              map.fitBounds(bounds);
            } else {
              centerMarker = mapCenter || new google.maps.LatLng(locations[0][1], locations[0][2]);
              map.setCenter(centerMarker);
            }
          });

          if (zoom > 0) {
            var listener = google.maps.event.addListener(map, "idle", function () {
              map.setZoom(zoom);
              mapCenter = map.getCenter();
              google.maps.event.removeListener(listener);
            });
          }

          $(".field--mt-collapsible-block .google-map-canvas", context).closest('.collapse').on('shown.bs.collapse', function() {
              google.maps.event.trigger(map, 'resize');
          });

        });
      }
      google.maps.event.addDomListener(window, "load", initialize);

    }
  };
})(jQuery, Drupal, drupalSettings);
