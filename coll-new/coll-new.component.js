'use strict';

angular.module('collNew')

    .controller('CollNewCtrl', [
        '$scope','$http', '$location', '$routeParams', function ($scope, $http, $location,$routeParams) {
            const ctrl = this;

            ctrl.entity = {};
            ctrl.entity.charact_2 = [];

            $scope.title = 'Добавление словосочетаний';

            ctrl.onCreate = function () {
                $http.post('/api/collocations', ctrl.entity).success(function (data,status,headers,config){
                    ctrl.notificationMessage ="добавлено ;)";
                    console.log("Connect is here!");
                }).error(function  (data, status, header, config) {
                    ctrl.notificationMessage = "во время отпавки произошла ошибка " + status + ":(";
                    console.log("Smth wrong");
                });


                console.log(ctrl.entity);
            };
            /* $http.post('/api/texts/', entity)*/


        }])

    .component('collNew', {
        templateUrl: 'coll-new/coll-new.template.html',
        controller: 'CollNewCtrl'
    });
