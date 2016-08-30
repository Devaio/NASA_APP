(function(){
  'use strict';
  angular.module('meteoriteApp')
    .service('httpService', [
      '$http',
      '$q',
      Service

    ])

  function Service($http, $q){
    this.query = function(url, params){
      return $http.get(url, {params});
    }
  }

})();
