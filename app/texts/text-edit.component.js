"use strict";

angular
  .module("texts")

  .controller("TextEditCtrl", [
    "$scope",
    "$http",
    "$location",
    "$routeParams",
    "$window",
    function($scope, $http, $location, $routeParams, $window) {
      const ctrl = this;

      ctrl.isAdmin = $window.localStorage.getItem('isAdmin');

      $scope.title = "Текст c id = ";
      ctrl.textId = $routeParams.textId;

      $http
        .get("/api/texts/" + ctrl.textId)
        .success(function(data, status, headers, config) {
          ctrl.entity = data;
        })
        .error(function() {});

      ctrl.sending = function() {
        $http
          .put("/api/texts/" + ctrl.textId, ctrl.entity)
          .success(function(data, status, headers, config) {
            ctrl.notificationMessage = "текст изменен ;)";
          })
          .error(function(data, status, header, config) {
            ctrl.notificationMessage =
              "во время запроса произошла ошибка " + status;
          });
      };
    }
  ])

  .component("textEdit", {
    templateUrl: "texts/text-edit.template.html",
    controller: "TextEditCtrl"
  });
