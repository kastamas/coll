'use strict';

// Declare app level module which depends on views, and components
angular.module('collApp', [
    'ngRoute',
    'ngCookies',
    'angularjs-dropdown-multiselect',
    'ngAnimate',
    'bw.paging',

    'mainPage',

    'texts',

    'colls'
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvide) {

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
        .when('/texts/edit/:textId',{
            template: '<text-edit  ng-cloak>'
        })

        .when('/colls', {
            template: '<colls-list  ng-cloak>'
        })
        .when('/colls/new',{
            template: '<coll-new  ng-cloak>'
        })
        .when('/colls/edit/:collId',{
            template: '<coll-edit  ng-cloak>'
        })

        /*.when('/chars', {
         template: '<chars-list  ng-cloak>'
         })
         .when('/chars/new',{
         template: '<chars-new  ng-cloak>'
         })*/

        .when('/',{
            template: '<main-page>'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);
