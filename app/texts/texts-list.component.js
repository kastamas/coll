"use strict";

angular
  .module("texts", [])

  .controller("TextsListCtrl", [
    "$scope",
    "$http",
    "$window",
    function($scope, $http, $window) {
      const ctrl = this;
      $scope.title = "Список текстов";

      ctrl.isAdmin = $window.localStorage.getItem('isAdmin');

      //запрос к бд
      $http
        .get("./api/texts")
        .success(function(data, status, headers, config) {
          ctrl.list = data;

          /*Потому что постгрес какого-то черта возвращает значение COUNT() строкой O_o*/
          ctrl.list.forEach(function(item) {
            item.number_of_collocations = parseInt(
              item.number_of_collocations,
              10
            );
          });
        })
        .error(function() {});

      //sort on init
      $scope.sortingRows = "title";
      $scope.sortingReverse = false;

      $scope.sort = function(fieldName) {
        if ($scope.sortingRows === fieldName) {
          $scope.sortingReverse = !$scope.sortingReverse;
        } else {
          $scope.sortingRows = fieldName;
          $scope.sortingReverse = false;
        }
      };
    }
  ])

  .component("textsList", {
    templateUrl: "texts/texts-list.template.html",
    controller: "TextsListCtrl"
  });
