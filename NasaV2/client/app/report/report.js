'use strict';

angular.module('meteoriteApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('report', {
        url: '/report',
        template: '<report></report>'
      });
  });
