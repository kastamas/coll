'use strict';

angular.module('colls')



    .controller('CollNewCtrl', [
        '$scope','$http', '$location', '$routeParams', '$timeout',
        function ($scope, $http, $location,$routeParams,$timeout) {
            const ctrl = this;
            ctrl.entity = {};


            /*(function (object) {

            })*/

            function sendQuery(object){
                $http.post('./api/collocations', object).success(function (data,status,headers,config){
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
            }

            /**
             * для загрузки файлов
             */
            ctrl.bulkMode = false;
            ctrl.bulkStatus = false;
            ctrl.bulkShowColls = false;
            $scope.file = {};
            $scope.options = {
                //Вызывается для каждого выбранного файла
                change: function (file) {
                    //В file содержится информация о файле
                    //Загружаем на сервер
                    file.$upload('./api/htmlParseSpec', file).then(function (response) {
                        ctrl.resulting = response.data;
                        ctrl.bulkStatus = true;
                    });
                }
            };

            ctrl.showBulkAddition = function () {
                if(ctrl.bulkMode){
                    ctrl.bulkMode = false;
                    ctrl.bulkStatus = false;
                    ctrl.bulkShowColls = false;
                } else {
                    ctrl.bulkMode = true;
                }
            };

            ctrl.showBulkResult = function () {
                ctrl.bulkShowColls == true ? ctrl.bulkShowColls = false : ctrl.bulkShowColls = true;
            };



            /* On Change functions*/
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


            function Test() {
                this.text_id = ctrl.entity.text_id;
                this.status = ctrl.entity.status;

            }

            Test.create = function (collocation, page_number) {
                var object = new Test;
                object.collocation = collocation;
                object.page_number = page_number;

                return object
            };

            function  TestFactory() {

            }

            ctrl.onAction = function () {
                if(ctrl.bulkStatus) {
                   ctrl.resulting.forEach(function (item) {


                       var testobject = {};

                       for (var key in ctrl.entity) {
                           testobject[key] = ctrl.entity[key]
                       }

                       testobject.collocation = item.collocation;
                       testobject.page_number = item.page_number;
/*



*/

                       console.log("Res", JSON.stringify(testobject));


                        sendQuery(testobject);

                   });
                }
                else {
                    sendQuery(ctrl.entity);
                }
            };


            /*list of texts*/
            $http.get('./api/texts').success(function (data, status, headers, config) {
                ctrl.textsList = data;
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristicsTwo*/
            $http.get('./api/characteristics').success(function (data, status, headers, config) {
                ctrl.characteristicTwoList = data;
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristicsThree*/
            $http.get('./api/characteristicsExpansion').success(function (data, status, headers, config) {
                ctrl.characteristicThreeList = data;

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
    templateUrl: 'colls/coll-item.template.html',
    controller: 'CollNewCtrl'
});