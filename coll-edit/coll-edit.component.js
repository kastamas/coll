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

            ctrl.onChangeCharacteristicRelationToMain = function () {
                delete ctrl.characteristicAttr1;
                delete ctrl.characteristicAttr2;
                delete ctrl.entity.characteristic_attr2   ;
                delete ctrl.entity.characteristic_attr1   ;
                delete ctrl.entity.characteristic_divider ;
            };

            /*collocation inf*/
            $http.get('/api/collocations/' + ctrl.entityId).success( function(data, status){
                ctrl.entity = data;//Объект с инфой по словосочетанию
                console.log("DATA",data);
                /*set up*/
                ctrl.characteristicAttr1 = ctrl.entity.characteristic_1;
                ctrl.characteristicAttr2 = ctrl.entity.characteristic_2;
            }).error(function ()  {console.log("Smth rong");});


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



            ctrl.update = function () {
                $http.put('/api/collocations/' + ctrl.entityId, ctrl.entity).success(function () {
                    ctrl.notificationMessage ="словосочетание изменено ;)";
                }).error(function () {
                    ctrl.notificationMessage = "во время запроса произошла ошибка "+ status;
                });
            };

        }])

    .component('collEdit', {
        templateUrl: 'coll-edit/coll-edit.template.html',
        controller: 'CollEditCtrl'
    });
