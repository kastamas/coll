"use strict";

angular
  .module("texts")

  .controller("TextItemCtrl", [
    "$scope",
    "$http",
    "$location",
    "$routeParams",
    "$window",
    function($scope, $http, $location, $routeParams, $window) {
      const ctrl = this;
      $scope.title = "Текст c id = ";
      ctrl.textId = $routeParams.textId;
      console.log($routeParams);

      ctrl.isAdmin = $window.localStorage.getItem('isAdmin');

      $http
        .get("/api/texts/" + ctrl.textId)
        .success(function(data) {
          ctrl.entity = data;
        })
        .error(function() {});
    }
  ])

  .component("textItem", {
    templateUrl: "texts/text-item.template.html",
    controller: "TextItemCtrl"
  });
