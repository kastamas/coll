"use strict";

angular
  .module("colls")
  .controller("CollEditCtrl", [
    "$scope",
    "$http",
    "$location",
    "$routeParams",
    "$cookies",

    function($scope, $http, $location, $routeParams, $cookies) {
      const ctrl = this;

      ctrl.entity = {};
      ctrl.entityId = $routeParams.collId;
      ctrl.editTextId = false;

      ctrl.displayTextIdSwitcher = function() {
        ctrl.editTextId == true
          ? (ctrl.editTextId = false)
          : (ctrl.editTextId = true);
      };

      // Запрос на тексты
      /* list of texts*/
      $http
        .get("/api/texts")
        .success(function(data, status, headers, config) {
          ctrl.textsList = data;
        })
        .error(function() {
          console.log("Smth wrong");
        });

      ctrl.onChangeCharacteristicQuantity = function() {
        if (ctrl.entity.characteristic_relation_to_main != "interpos") {
          delete ctrl.entity.characteristic_attr2;
          delete ctrl.entity.characteristic_attr2_addition;
        }
      };

      ctrl.onChangeCharacteristicRelationToMain = function() {
        delete ctrl.entity.characteristic_attr1;
        delete ctrl.entity.characteristic_attr2;
        delete ctrl.entity.characteristic_attr1_addition;
        delete ctrl.entity.characteristic_attr2_addition;
        delete ctrl.entity.characteristic_divider;
      };

      ctrl.onChangeCharacteristicSubstantive_lg = function() {
        delete ctrl.entity.characteristic_substantive_lg_explicit;
      };

      //get filter & sort from cookies
      const filter = $cookies.getObject("collsListFilter");
      const sort = $cookies.getObject("collsListSort");
      var options = filter;
      options.reverse = sort.reverse;
      options.rows = sort.rows;

      var parameters = encodeURIComponent(JSON.stringify(options));

      /* collocation inf*/
      var queryString = "/api/collocation/" + ctrl.entityId + "?" + parameters;
      $http
        .get(queryString)
        .success(function(data, status) {
          ctrl.entity = data; //Объект с инфой по словосочетанию

          /*set up*/
          if (ctrl.entity.characteristic_1 != null)
            ctrl.characteristicAttr1 = ctrl.entity.characteristic_1;
          else
            ctrl.characteristicAttr1 =
              ctrl.entity.characteristic_attr1_explicit;
          if (ctrl.entity.characteristic_1 != null)
            ctrl.characteristicAttr2 = ctrl.entity.characteristic_2;
          else
            ctrl.characteristicAttr2 =
              ctrl.entity.characteristic_attr2_explicit;
        })
        .error(function() {
          console.log("Smth rong");
        });

      /*list of characteristicsTwo*/
      $http
        .get("/api/characteristics")
        .success(function(data, status, headers, config) {
          ctrl.characteristicTwoList = data;
        })
        .error(function() {
          console.log("Smth wrong");
        });

      /*list of characteristicsThree*/
      $http
        .get("/api/characteristicsExpansion")
        .success(function(data, status, headers, config) {
          ctrl.characteristicThreeList = data;

          //todo:optimisation
          $scope.characteristicThreeFilter1 = function(item) {
            return (
              item.expansion &&
              item.characteristic_id == ctrl.entity.characteristic_attr1
            );
          };
          $scope.characteristicThreeFilter2 = function(item) {
            return (
              item.expansion &&
              item.characteristic_id == ctrl.entity.characteristic_attr2
            );
          };
        })
        .error(function() {
          console.log("Smth wrong");
        });

      function changeSendingStatus() {
        ctrl.sended = false;
      }

      ctrl.onAction = function() {
        $http
          .put("/api/collocation/" + ctrl.entityId, ctrl.entity)
          .success(function() {
            ctrl.sendingError = false;
            ctrl.sended = true;
            $timeout(changeSendingStatus, 3000); //todo: it's a crutch, i suppose
          })
          .error(function() {
            ctrl.sended = false;
            ctrl.sendingError = true;
            ctrl.notificationMessage = "Код ошибки: " + status;
          });
      };

      //Подгружаю характеристики
      $http
        .get("jsons/collocation_characteristics.json")
        .then(function(response) {
          ctrl.collocations_characteristics = response.data;
        });
    }
  ])
  .component("collEdit", {
    templateUrl: "colls/coll-item.template.html",
    controller: "CollEditCtrl"
  });
