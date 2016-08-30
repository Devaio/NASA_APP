'use strict';

(function() {

  class MainController {

    constructor($http, appConfig, $q, httpService, $timeout) {
      this.$http = $http;
      // Baseuri of meteorite api powered by Socrata which we have defined in the angular constant and injected to this component controller to interact with it
      this.baseUri = appConfig.baseUri;
      // Array to hold the long and lat from the api call
      this.observations = [];

      // Promise
      this.Q = $q;

      // timeout
      this.timeout = $timeout;

      // Http service
      this.HTTP = httpService

      // Token from the nasa meteorite app to access unlimited amount of data
      this.accessToken = appConfig.accessToken;
      // Form data model object
      this.formData = {};

      // Date picker configuration
      this.format = 'dd-MMMM-yyyy';

      // An object with any combination of the datepicker settings (in camelCase) used to configure the wrapped datepicker.
      this.dateOptions = {
         formatYear: 'yy',
         startingDay: 1
       };
      // Remote api for google autocomplete web service
      this.remoteUrl = appConfig.googleApis;

      // Token for google remote api
      this.token = appConfig.googleKey;

      // Full remote url
      this.fullUrl = this.remoteUrl + '?key=' + this.token + '&input=';
      //Location search
      this.getLocation = function(inputValue) {
        return $http.get('/api/things/getcode?address='+ inputValue)
          .then(function(data){
            var data = JSON.parse(data.data);
            return data.results;
          }.bind(this))
      }.bind(this);

    }
    onSelect(data){
      this.formData.location = data.geometry.location;
      this.formData.address = data.formatted_address;
    }
    reset(form){
      this.formData = {};
      this.submitted = false;
      this.location = '';
      $('#earth_div').empty();
      // This adds the webgl earth globe to earth_div id
      var earth = new WE.map('earth_div');
      // Sets default view to given latitude and longitude
      earth.setView([46.8011, 8.2266], 2);
      // Puts tiles from openstreetmap
      WE.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap contributors'
      }).addTo(earth);
      form.$setPristine();

    }

    query(form, data){
      // We are query Nasa api when to and from date both are provided
      if (form.$valid){
        if (!data.name && !data.location && !data.from && !data.to){
          this.enterAtLeastOne = true;
          this.geolocationReq = true;
          this.timeout(function() {
            this.enterAtLeastOne = false;
            this.geolocationReq = false;
          }.bind(this), 3000);
          return;
        }
        this.submitted = true;
        var url = "year between '" + moment(data.from).format("YYYY-MM-DDTHH:mm:ss") + "' and '" + moment(data.to).format("YYYY-MM-DDTHH:mm:ss") + "'";

        var name = data.name ? data.name: '';
        var paramsForOurServer = {
          name: data.name,
          location: data.formatted_address
        }

        var params = {
          $$app_token: this.accessToken,
          $where: url,
          name: name
        }

        if (!data.formatted_address){
          delete paramsForOurServer.location;
        }
        if (!name){
          delete params.name;
          delete paramsForOurServer.name;
        }
        if (!data.to){
          delete params.$where;
          if (data.from){
            params.year = moment(data.from).format("YYYY-MM-DDTHH:mm:ss");
            paramsForOurServer.year = data.from;
          }
        }
        if (!data.from){
          delete params.$where;
          if (data.to){
            params.year = moment(data.to).format("YYYY-MM-DDTHH:mm:ss");
            paramsForOurServer.year = data.to;
          }
        }
        if (data.location && data.location.lat){
          if (params.$where){
            params.$where = params.$where + " AND within_circle (geolocation,"+data.location.lat+","+data.location.lng+", 10000000)";
          }else{
            params.$where = "within_circle (geolocation,"+data.location.lat+","+data.location.lng+", 10000000)";
          }
          paramsForOurServer.location = this.formData.address;
        }

        // Holds both nasa api request and our server database api request
        var bucket = [this.HTTP.query(this.baseUri, params), this.HTTP.query('/api/reports', paramsForOurServer)];
        this.Q.all(bucket)
          .then(
            (result) =>{
              let observation = [];
              for (var i in result){
                for(var j in result[i].data){
                  let cord = result[i].data[j].geolocation ? result[i].data[j].geolocation.coordinates: null;
                  let name = result[i].data[j].name ? result[i].data[j].name: null;
                  let fellDate = result[i].data[j].year ? result[i].data[j].year: null;
                  if (cord){
                    observation.push({
                      coordinates: cord,
                      name: name,
                      fellDate: fellDate
                    });
                  }
                }
              }
              this.formData = {};
              this.formatted_address = '';
              this.observations = observation;
              this.submitted = false;
            }
          )
      }
    }

  }

  angular.module('meteoriteApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
// Joe //
