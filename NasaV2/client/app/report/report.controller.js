'use strict';
(function(){

class ReportComponent {
  constructor($http, $timeout) {
    this.formData = {
      geolocation: {}
    };
    this.HTTP = $http;

    this.timeout = $timeout;
    // Date picker configuration
    this.format = 'dd-MMMM-yyyy';

    // An object with any combination of the datepicker settings (in camelCase) used to configure the wrapped datepicker.
    this.dateOptions = {
       formatYear: 'yy',
       startingDay: 1
     };
     //Location search
     this.getLocation = function(inputValue) {
       this.formData.geolocation.coordinates = null;
       return $http.get('/api/things/getcode?address='+ inputValue)
         .then(function(data){
           var data = JSON.parse(data.data);
           return data.results;
         }.bind(this))
     }.bind(this);

  }
  onSelect(data){
    this.formData.geolocation.coordinates = [data.geometry.location.lat,data.geometry.location.lng]
  }
  submit(form, data){
    if (form.$valid){
      if (!this.formData.geolocation.coordinates){
        this.invalidLocation = true;
        this.timeout(function(){
          this.invalidLocation = false;
        }.bind(this), 3000);
        return;
      }
      this.HTTP.post('/api/reports', this.formData)
        .then(
          (response) =>{
            this.successMessage = true;
            $('#meteorForm')[0].reset();
            this.formData = {
              geolocation: {}
            };
            form.$setPristine(true)
            this.timeout(function(){
              this.successMessage = false;
            }.bind(this), 3000);
          }
        )
    }
  }
}

angular.module('meteoriteApp')
  .component('report', {
    templateUrl: 'app/report/report.html',
    controller: ReportComponent
  });

})();
