"use strict";

// Declare app level module which depends on views, and components
angular
  .module("collApp", [
    "ngRoute",
    "ngCookies",
    "angularjs-dropdown-multiselect",
    "ngAnimate",
    "bw.paging",
    "oi.file",

    "admin",
    "mainPage",
    "texts",
    "colls"
  ])

  .config([
    "$locationProvider",
    "$routeProvider",
    "$httpProvider",
    function($locationProvider, $routeProvide, $httpProvider) {
      $routeProvide
        .when("/texts", {
          template: "<texts-list  ng-cloak>"
        })
        .when("/texts/new", {
          template: "<text-new  ng-cloak>"
        })
        .when("/texts/:textId", {
          template: "<text-item  ng-cloak>"
        })
        .when("/texts/edit/:textId", {
          template: "<text-edit  ng-cloak>"
        })

        .when("/colls", {
          template: "<colls-list  ng-cloak>"
        })
        .when("/colls/new", {
          template: "<coll-new  ng-cloak>"
        })
        .when("/colls/new-bulk", {
          template: "<coll-new-bulk  ng-cloak>"
        })
        .when("/colls/edit/:collId", {
          template: "<coll-edit  ng-cloak>"
        })

        .when("/admin", {
          template: "<admin ng-cloak>"
        })

        .when("/", {
          template: "<texts-list ng-cloak>"
        })

        .otherwise({
          redirectTo: "/"
        });

      $httpProvider.interceptors.push($q => {
        return {
          request: function(config) {
            console.log(config);
            const baseUrl = "http://92.63.104.247/";
            // return {...config, url: `${baseUrl}${config.url}`};
            return config;
          }
        };
      });
    }
  ]);
