'use strict';

var collApp = angular.module('collApp', [
    'ngRoute',
    'textItem', 'textNew', 'textsList',
                'collNew', 'collsList',
               'charsNew', 'charsList',
    'mainPage']);


collApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvide) {

    $routeProvide
        .when('/texts', {
            template: '<texts-list  ng-cloak>'
        })
        .when('/texts/new',{
            template: '<text-new  ng-cloak>'
        })
        .when('/texts/:textId',{
            template: '<text-item  ng-cloak>'
        })

        .when('/colls', {
            template: '<colls-list  ng-cloak>'
        })
        .when('/colls/new',{
            template: '<coll-new  ng-cloak>'
        })

        .when('/chars', {
            template: '<chars-list  ng-cloak>'
        })
        .when('/chars/new',{
            template: '<chars-new  ng-cloak>'
        })

        .when('/',{
            template: '<main-page>'
        })

        .otherwise({
            redirectTo: '/'
        });
    }
]);