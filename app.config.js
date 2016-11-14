'use strict';

var collApp = angular.module('collApp', [
    'ngRoute',  'textItem', 'textNew', 'textsList',  'mainPage']);


collApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvide) {

    $routeProvide /*ToDo:add other routes*/
        .when('/texts', {
            template: '<texts-list>'
        })
        .when('/texts/:textId',{
            template: '<text-item>'
        })
        .when('/texts/new',{
            template: '<text-new>'
        })
        .when('/',{
            template: '<main-page>'
        })

        .otherwise({
            redirectTo: '/'
        });
    }
]);