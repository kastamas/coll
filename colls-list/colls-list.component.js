'use strict';

angular.module('collsList',[])

    .controller('CollsListCtrl', [
        '$scope','$http','$route',
        function ($scope, $http, $route) {
            const ctrl = this;
            $scope.title = 'Список словосочетаний';


            //list of colls
            $http.get('/api/collocations').success(function (data, status, headers, config) {
                console.log('This is Data of Collocations:', data,'\n\n This is Status:',status);
                ctrl.list = data;
            }).error(function () {
                console.log("Smth wrong");
            }).then(function (res) {

                //list of texts
                $http.get('/api/texts').success(function (data, status, headers, config) {
                    console.log('This is TEXTS Data:', data, '\n\n This is Status:', status);
                    ctrl.textsList = data;
                    console.log("TEXTSSS",ctrl.textsList);
                }).error(function () {
                    console.log("Smth wrong");
                });



                //characteristics
                $http.get('/api/characteristics').success(function (data, status, headers, config) {
                    ctrl.charactsList = data;
                    console.log("Characteristics Data",ctrl.charactsList);//Объект всех характеристик 2
                }).error(function () {
                    console.log("Smth wrong");
                });

                //set up for filters
                ctrl.filter = {text_id: null, status: "any", characteristic_quantity: "any", characteristic_relation_to_main: "any"};

                //set up for orderBys
                //sort on init
                ctrl.sorting = {rows:'created_at', reverse:true};

                ctrl.sort = function (fieldName) {
                    if(ctrl.sorting.rows === fieldName){
                        ctrl.sorting.reverse = !ctrl.sorting.reverse;
                    } else {
                        ctrl.sorting.rows = fieldName;
                        ctrl.sorting.reverse = false;
                    }
                };


                //todo:remove this bicycle from india
                $scope.collocationsMainFilter = function (item) {

                    return (item.collocation) &&
                        ((ctrl.filter.text_id != 0 && ctrl.filter.text_id != null) ? item.text_id == ctrl.filter.text_id  : " ") &&
                        ((ctrl.filter.status != "any") ? item.status == ctrl.filter.status : " ") &&
                        ((ctrl.filter.characteristic_quantity != "any") ? item.characteristic_quantity == ctrl.filter.characteristic_quantity : " ") &&
                        ((ctrl.filter.characteristic_relation_to_main != "any") ? item.characteristic_relation_to_main == ctrl.filter.characteristic_relation_to_main : " ")
                        ;
                 };

                 $scope.collocationsTextFilter = function (item) {
                     return (item.collocation) && ((ctrl.filter.text_id != 0 && ctrl.filter.text_id != null) ? item.text_id == ctrl.filter.text_id  : " ");
                 };

                ctrl.delete = function (item_id) {




                    $http.delete('/api/collocations/' + item_id).success(function (data, status) {
                        //топорнейшее решение, но должно сработать
                        ctrl.list.forEach(function (item,i) {
                            if (item.id === item_id) {
                                ctrl.list.splice(i,1);
                            }
                        });
                        console.log("Запрос на удаление выполнен, статус: ", status);
                    }).error(function (data, status) {
                        console.log("Запрос на удаление НЕ ВЫПОЛНЕН, статус: ", status);
                    });
                };

             });



        }])

    .component('collsList', {
        templateUrl: 'colls-list/colls-list.template.html',
        controller: 'CollsListCtrl'
    });
