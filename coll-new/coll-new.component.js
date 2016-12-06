'use strict';

angular.module('collNew')

    .controller('CollNewCtrl', [
        '$scope','$http', '$location', '$routeParams', function ($scope, $http, $location,$routeParams) {
            const ctrl = this;

            ctrl.entity = {};
            ctrl.entity.charact_2 = [];
            ctrl.entity.characteristics = [];

            $scope.title = 'Добавление словосочетаний';


            ctrl.onCreate = function () {

                ctrl.entity.characteristics.forEach(function (item) {
                    console.log(item.id);
                    ctrl.entity.charact_2.push(item.id);
                });

                console.log("МАССИВ!",ctrl.entity.charact_2);


                $http.post('/api/collocations', ctrl.entity).success(function (data,status,headers,config){
                    ctrl.notificationMessage ="добавлено ;)";
                    console.log("Connect is here!");
                }).error(function  (data, status, header, config) {
                    ctrl.notificationMessage = "во время отпавки произошла ошибка " + status + ":(";
                    console.log("Smth wrong");
                });



                console.log("НА ВЫХОДЕ",ctrl.entity.charact_2);
            };

            /*list of texts*/
            $http.get('/api/texts').success(function (data, status, headers, config) {
                console.log('This is Data:', data, '\n\n This is Status:', status);
                ctrl.textsList = data;
                $scope.textsList = data;
                console.log(ctrl.textsList);
                return data;
            }).error(function () {
                console.log("Smth wrong");
            });

            /*list of characteristics*/
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.charactsList = data;
                console.log(ctrl.charactsList);
            }).error(function () {
                console.log("Smth wrong");
            });

            /*multiselect settings*/
            $scope.example15model = [];

            $scope.example15settings = {
                enableSearch: true,
                selectionLimit: 10,
                displayProp: 'characteristic',
                showCheckAll: false,
                showUncheckAll
                    : false
            };

            $scope.customFilter = '';

            $scope.translation = {
                checkAll: 'Выбрать всё',
                uncheckAll: 'Убрать всё',
                selectionCount: 'выбрано',
                selectionOf: '/',
                searchPlaceholder: 'Поиск...',
                buttonDefaultText: 'Выбрать',
                dynamicButtonTextSuffix: 'выбрано'

            };

        }])

    .component('collNew', {
        templateUrl: 'coll-new/coll-new.template.html',
        controller: 'CollNewCtrl'
    });
