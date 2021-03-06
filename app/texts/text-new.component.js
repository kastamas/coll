"use strict";

angular
  .module("texts")

  .controller("TextNewCtrl", [
    "$scope",
    "$http",
    "$location",
    "$routeParams",
    "$window",
    function($scope, $http, $location, $routeParams, $window) {
      const ctrl = this;

      ctrl.entity = {};
      $scope.title = "Новый текст";

      ctrl.isAdmin = $window.localStorage.getItem('isAdmin');

      ctrl.sending = function() {
        $http
          .post("./api/texts", ctrl.entity)
          .success(function(data, status, headers, config) {
            ctrl.notificationMessage = "текст добавлен ;)";
          })
          .error(function(data, status, header, config) {
            ctrl.notificationMessage =
              "во время запроса произошла ошибка " + status;
          });
      };
    }
  ])

  .component("textNew", {
    templateUrl: "texts/text-new.template.html",
    controller: "TextNewCtrl"
  });
