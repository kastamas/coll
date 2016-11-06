'use strict';

var collApp = angular.module('collApp', ['ngRoute','textsList',
    'mainPage']);


collApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvide) {

    $routeProvide
        .when('/texts', {
            template: '<texts-list>'
        })
        .when('/',{
            template: '<main-page>'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);