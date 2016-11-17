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
                /*преобразовываю массив объектов в массив*/
                /*console.log("МАССИВ ОБЪЕКТОВ!",ctrl.entity.charact_2);*/

                ctrl.entity.characteristics.forEach(function (item) {
                   /* console.log(item);*/
                    console.log(item.id);
                    ctrl.entity.charact_2.push(item.id);
                });

                console.log("МАССИВ!",ctrl.entity.charact_2);

               /* ctrl.entity.characteristics.length=0;*/


                $http.post('/api/collocations', ctrl.entity).success(function (data,status,headers,config){
                    ctrl.notificationMessage ="добавлено ;)";
                    console.log("Connect is here!");
                    ctrl.entity.charact_2.length=0;
                }).error(function  (data, status, header, config) {
                    ctrl.notificationMessage = "во время отпавки произошла ошибка " + status + ":(";
                    console.log("Smth wrong");
                    ctrl.entity.charact_2.length=0;
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
          /*  options = function() {
                $http.get('/api/texts').success(function (data, status, headers, config) {
                    console.log('This is Data:', data, '\n\n This is Status:', status);
                    ctrl.textsList = data;
                    console.log(ctrl.textsList);
                    return data;
                }).error(function () {
                    console.log("Smth wrong");
                });
            };
*/
           /* console.log("OPTIONS = ",options);*/

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
            /*$scope.example15data = ctrl.charactsList;*/
            $scope.example15data = [
                {id: 1, label: "David"},
                {id: 2, label: "Jhon"},
                {id: 3, label: "Lisa"},
                {id: 4, label: "Nicole"},
                {id: 5, label: "Danny"}];

            console.log("EXAMPLE", $scope.example15data);

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
