(function(){
  'use strict';
  class WebGlController {
    constructor(){
    }
  }
  angular.module('meteoriteApp')
    .directive('webgl',[
      WebGl
    ])

  function WebGl(){
    return{
      restrict: 'AE',
      bindToController: true,
      scope: {
        observations: '='
      },
      link: Linker,
      controller: WebGlController,
      controllerAs: 'vm',
      templateUrl:'components/webgl/webgl.html'
    }
  }

  function Linker(scope, element, attrs){
    // This adds the webgl earth globe to earth_div id
    var earth = new WE.map('earth_div');
    // Sets default view to given latitude and longitude
    earth.setView([46.8011, 8.2266], 2);
    // Puts tiles from openstreetmap
    WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '© OpenStreetMap contributors'
    }).addTo(earth);

    // Start a simple rotation animation
    var before = null;
    requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before? now - before: 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
        requestAnimationFrame(animate);
    });
    // This function takes all the observations and create glob with marker
    var mapInstance = function(observations){
      $('#earth_div').empty();
      var earth = new WE.map('earth_div');
      // Sets default view to given latitude and longitude
      earth.setView([46.8011, 8.2266], 2);
      // Puts tiles from openstreetmap
      WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap contributors'
      }).addTo(earth);

      // Add markers to specific geo long and lat
      for(var i in observations){
        var marker = WE.marker(observations[i].coordinates).addTo(earth);
        // Bind the default messages to the marker
        marker.bindPopup("<b>"+ observations[i].name + "</b>", {maxWidth: 150, closeButton: true}).openPopup();
      }

    }
    scope.$watchCollection('vm.observations', (newValue, oldValue) => {
      if (newValue.length > 0){
        mapInstance(newValue);
      }
    })

  }

})();
