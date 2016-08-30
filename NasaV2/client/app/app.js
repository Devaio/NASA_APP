'use strict';

angular.module('meteoriteApp', ['meteoriteApp.constants', 'ngCookies', 'ngResource', 'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'angucomplete'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
