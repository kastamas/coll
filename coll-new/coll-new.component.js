'use strict';

angular.module('collNew')

    .controller('CollNewCtrl', [
        '$scope','$http', '$location', '$routeParams', '$timeout',
        function ($scope, $http, $location,$routeParams,$timeout) {
            const ctrl = this;

            ctrl.entity = {};


            ctrl.onChangeCharacteristicQuantity = function () {
                delete ctrl.characteristicAttr2;
                delete ctrl.entity.characteristic_attr2 ;
            };

            ctrl.onChangeCharacteristicRelationToMain = function () {
                delete ctrl.characteristicAttr1;
                delete ctrl.characteristicAttr2;
                delete ctrl.entity.characteristic_attr2   ;
                delete ctrl.entity.characteristic_attr1   ;
                delete ctrl.entity.characteristic_divider ;
            };

            function changeSendingStatus() {
                ctrl.sended = false;
            }


            ctrl.onAction = function () {
                $http.post('/api/collocations', ctrl.entity).success(function (data,status,headers,config){
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
            $http.get('/api/texts').success(function (data, status, headers, config) {
                ctrl.textsList = data;
                console.log("x-Connect is here!",ctrl.textsList);
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristicsTwo*/
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.characteristicTwoList = data;
                console.log(ctrl.characteristicTwoList);
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristicsThree*/
            $http.get('/api/characteristicsExpansion').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.characteristicThreeList = data;
                console.log(ctrl.characteristicThreeList);

                //todo:optimisation
                $scope.characteristicThreeFilter1 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.characteristicAttr1);
                };
                $scope.characteristicThreeFilter2 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.characteristicAttr2);
                };

            }).error(function () {
                console.log("Smth wrong");
            });
        }])

    .component('collNew', {
        templateUrl: 'coll-new/coll-new.template.html',
        controller: 'CollNewCtrl'
    });
