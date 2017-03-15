'use strict';

angular.module('collNew')

    .controller('CollNewCtrl', [
        '$scope','$http', '$location', '$routeParams', '$timeout',
        function ($scope, $http, $location,$routeParams,$timeout) {
            const ctrl = this;
            ctrl.entity = {};

            //Костыль из-за последних изменений в системе добавления/редактирования
            //ctrl.attributes_without_expansion = [8,9,10,11];
            //ctrl.special_conditions = "";

          /*  ctrl.condition_for_showing_extensions = function (characteristic) {
                console.log("SPECIAL CONDITIONS!",characteristic);
                switch (characteristic){
                    case undefined: return undefined; break;
                    case 10: return false; break;
                    case 11: return false; break;
                    default: return true;
                }
            };*/



            ctrl.onChangeCharacteristicQuantity = function () {

                    delete ctrl.entity.characteristic_attr2;
                    delete ctrl.entity.characteristic_attr2_addition ;

            };

            ctrl.onChangeCharacteristicRelationToMain = function () {
                delete ctrl.entity.characteristic_attr1;
                delete ctrl.entity.characteristic_attr2;
                delete ctrl.entity.characteristic_attr1_addition   ;
                delete ctrl.entity.characteristic_attr2_addition   ;
                delete ctrl.entity.characteristic_divider ;
            };

            ctrl.onChangeCharacteristicSubstantive_lg = function () {
                delete ctrl.entity.characteristic_substantive_lg_explicit;
            };



            /*todo: for what?*/
            function changeSendingStatus() {
                ctrl.sended = false;
            }


            ctrl.onAction = function () {
              /*  if (!ctrl.condition_for_showing_extensions(ctrl.characteristicAttr1))
                    ctrl.entity.characteristic_attr1_explicit = ctrl.characteristicAttr1;
                    else delete ctrl.entity.characteristic_attr1_explicit   ;
                if (!ctrl.condition_for_showing_extensions(ctrl.characteristicAttr2))
                    ctrl.entity.characteristic_attr2_explicit = ctrl.characteristicAttr2;
                    else  delete ctrl.entity.characteristic_attr2_explicit   ;
*/


                $http.post('./api/collocations', ctrl.entity).success(function (data,status,headers,config){
                    ctrl.sendingError = false;
                    console.log("Connect is here!");
                    ctrl.sended = true;
                    $timeout(changeSendingStatus, 3000);//todo: it's a crutch, i suppose
                }).error(function  (data, status, header, config) {
                    ctrl.sended = false;
                    ctrl.sendingError = true;
                    ctrl.notificationMessage = "Код ошибки: " + status;
                    console.log("Smth wrong");
                });

            };


            /*list of texts*/
            $http.get('./api/texts').success(function (data, status, headers, config) {
                ctrl.textsList = data;
                console.log("x-Connect is here!",ctrl.textsList);
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristicsTwo*/
            $http.get('./api/characteristics').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.characteristicTwoList = data;
                console.log(ctrl.characteristicTwoList);
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristicsThree*/
            $http.get('./api/characteristicsExpansion').success(function (data, status, headers, config) {
                console.log('Expansions:', data,'\n\n This is Status:',status);
                ctrl.characteristicThreeList = data;
                console.log(ctrl.characteristicThreeList);

                //todo:optimisation
                $scope.characteristicThreeFilter1 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.entity.characteristic_attr1);
                };
                $scope.characteristicThreeFilter2 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.entity.characteristic_attr2);
                };
            }).error(function () {
                console.log("smth wrong");
            });


            //Подгружаю характеристики
            $http.get('./jsons/collocation_characteristics.json').then(function (response) {
                ctrl.collocations_characteristics = response.data;
            });
        }])

    .component('collNew', {
        templateUrl: 'coll-new/coll-new.template.html',
        controller: 'CollNewCtrl'
    });