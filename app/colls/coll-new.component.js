'use strict';

angular.module('colls')


    .controller('CollNewCtrl', [
        '$scope', '$http', '$location', '$routeParams', '$timeout',
        function ($scope, $http, $location, $routeParams, $timeout) {
            const ctrl = this;
            ctrl.entity = {};


            function sendQuery(object) {
                $http.post('./api/collocation', object).success(function (data, status, headers, config) {
                    ctrl.sendingError = false;
                    console.log("Connect is here!");
                    ctrl.sended = true;
                    $timeout(changeSendingStatus, 3000);//todo: it's a crutch, i suppose
                }).error(function (data, status, header, config) {
                    ctrl.sended = false;
                    ctrl.sendingError = true;
                    ctrl.notificationMessage = "Код ошибки: " + status;
                    console.log("Smth wrong");
                });
            }

            /**
             * добавление через файл
             */
            ctrl.bulk = {
                mode: false,
                status: false,
                show: false,
                file: {},
                permit: {
                    allowedType: ["html","htm"],
                    errorBadType: "Расширение файла должно быть .html или .htm"
                        },
                fileName :"",
                errors: {},

                editing: undefined,


                edit: function (id) {
                    ctrl.bulk.editing = id;
                },
                save: function (status) {

                    if (status){
                        //получаю доступ к объекту и меняю его
                        //топорнейшее решение Todo: improve
                        ctrl.resulting.forEach(function (item,i) {
                            if (i === ctrl.bulk.editing) {
                                if(ctrl.bulk.newValueColl){
                                    ctrl.resulting[i].collocation = ctrl.bulk.newValueColl;
                                }
                                if(ctrl.bulk.newValuePage){
                                    ctrl.resulting[i].page_number = ctrl.bulk.newValuePage;
                                }

                            }
                        });
                    }
                    ctrl.bulk.editing = undefined;
                    ctrl.bulk.newValueColl = undefined;
                    ctrl.bulk.newValuePage = undefined;
                },
                delete: function (item_id) {
                    ctrl.resulting.forEach(function (item,i) {
                        if (i === item_id) {
                            ctrl.resulting.splice(i,1);
                        }
                    });
                },
                showAddition:  function () {
                    if (ctrl.bulk.mode) {
                        ctrl.bulk.mode = false;
                        ctrl.bulk.status = false;
                        ctrl.bulk.show = false;
                    } else {
                        ctrl.bulk.mode = true;
                    }
                },
                showResult: function () {
                    ctrl.bulk.show == true ? ctrl.bulk.show = false : ctrl.bulk.show = true;
                },
                keyCatcher: function (keyEvent) { // todo: there is a way to grow
                    if (keyEvent.which === 13) // enter
                        ctrl.bulk.save(true);
                    if (keyEvent.which === 27)// esc
                        ctrl.bulk.save(false);
                    console.log(keyEvent);
                }
            };




            $scope.file = {};
            $scope.options = {
                //Вызывается для каждого выбранного файла
                change: function (file) {
                    //В file содержится информация о файле
                    //Загружаем на сервер

                    file.$upload('./api/htmlParseSpec', file, ctrl.bulk.permit).then(
                        function (response) {
                            console.log('upload success', response);
                            ctrl.resulting = response.data;
                            ctrl.bulk.status = true;
                            ctrl.bulk.fileName = response.item.filename;
                            ctrl.bulk.errors = {};// обнуляем
                        },
                        function (data) {
                            console.log('upload error', data);
                            ctrl.bulk.errors = angular.isArray(ctrl.bulk.errors) ? ctrl.bulk.errors.concat(data.response) : [].concat(data.response);
                            ctrl.bulk.status = false;
                            ctrl.resulting = {};
                        }
                    );
                }
            };



            /* On Change functions*/
            ctrl.onChangeCharacteristicQuantity = function () {
                delete ctrl.entity.characteristic_attr2;
                delete ctrl.entity.characteristic_attr2_addition;
            };

            ctrl.onChangeCharacteristicRelationToMain = function () {
                delete ctrl.entity.characteristic_attr1;
                delete ctrl.entity.characteristic_attr2;
                delete ctrl.entity.characteristic_attr1_addition;
                delete ctrl.entity.characteristic_attr2_addition;
                delete ctrl.entity.characteristic_divider;
            };

            ctrl.onChangeCharacteristicSubstantive_lg = function () {
                delete ctrl.entity.characteristic_substantive_lg_explicit;
            };


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

            ctrl.onAction = function () {
                if (ctrl.bulk.status) {
                    ctrl.resulting.forEach(function (item) {


                        var testobject = {};

                        for (var key in ctrl.entity) {
                            testobject[key] = ctrl.entity[key]
                        }

                        testobject.collocation = item.collocation;
                        testobject.page_number = item.page_number;

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