'use strict';

angular.module('collEdit')

    .controller('CollEditCtrl', [
        '$scope','$http', '$location', '$routeParams',
        function ($scope, $http, $location, $routeParams) {
           const ctrl = this;

            ctrl.entity = {};
            ctrl.entity.characteristics = [];
            ctrl.Char2selected = [];

            ctrl.entityId = $routeParams.collId;
            console.log("Айдишенька",$routeParams.collId);

                $http.get('/api/collocations/' + ctrl.entityId).success( function(data, status){
                    ctrl.entity = data;//Объект с инфой по словосочетанию
                    console.log("DATA",data);
                    //fot selected
                    //From {1,2} to [1,2]

                    //TODO:remove this crutch
                    var str = data.charact_2;
                    str = str.replace("{","");
                    str = str.replace("}","");
                    var strArray = str.split(",");

                    //Приведение массива строк к массиву целых чисел
                    strArray.forEach(function (x,y,z) {
                       z[y] = x | 0
                    });
                    ctrl.entity.charact_2 = []; //to update
                    ctrl.entity.characteristicss = strArray;
                    ctrl.Char2selected = [];


                    ctrl.entity.characteristicss.forEach(function (item) {
                        ctrl.Char2selected.push({id:item});
                    });


                }).error(function ()  {console.log("Smth wrong");});




            ctrl.update = function () {
                //preparing array
                ctrl.Char2selected.forEach(function (item) {
                    ctrl.entity.charact_2.push(item.id);
                });

                $http.put('/api/collocations/' + ctrl.entityId, ctrl.entity).success(function () {
                    ctrl.notificationMessage ="словосочетание изменено ;)";
                }).error(function () {
                    ctrl.notificationMessage = "во время запроса произошла ошибка "+ status;
                });
            };




            /*list of characteristics*/
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);

                ctrl.charactsList = data;//options
                console.log("характеристики",ctrl.charactsList);
            }).error(function () {
                console.log("Smth wrong");
            });



            /*multiselect settings*/
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

    .component('collEdit', {
        templateUrl: 'coll-edit/coll-edit.template.html',
        controller: 'CollEditCtrl'
    });
