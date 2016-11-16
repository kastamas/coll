'use strict';

var collApp = angular.module('collApp', [
    'ngRoute',
    'textItem', 'textNew', 'textsList',
                'collNew', 'collsList',
    'mainPage']);


collApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvide) {

    $routeProvide /*ToDo:add other routes*/
        .when('/texts', {
            template: '<texts-list>'
        })
        .when('/texts/new',{
            template: '<text-new>'
        })
        .when('/texts/:textId',{
            template: '<text-item>'
        })

        .when('/colls', {
            template: '<colls-list>'
        })
        .when('/colls/new',{
            template: '<coll-new>'
        })

        .when('/',{
            template: '<main-page>'
        })

        .otherwise({
            redirectTo: '/'
        });
    }
]);