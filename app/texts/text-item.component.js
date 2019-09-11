"use strict";

angular
  .module("texts")

  .controller("TextItemCtrl", [
    "$scope",
    "$http",
    "$location",
    "$routeParams",
    function($scope, $http, $location, $routeParams) {
      const ctrl = this;
      $scope.title = "Текст c id = ";
      ctrl.textId = $routeParams.textId;

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
