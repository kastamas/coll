'use strict';

angular.module('charsNew')

    .controller('CharsNewCtrl', [
        '$scope','$http', '$location', '$routeParams', function ($scope, $http, $location,$routeParams) {
            const ctrl = this;

            ctrl.entity = {};
            $scope.title = 'Новая характеристика';

            ctrl.onCreate = function () {
                $http.post('/api/characteristics', ctrl.entity).success(function (data,status,headers,config){
                    ctrl.notificationMessage ="текст добавлен ;)";
                    console.log("Connect is here!");
                }).error(function  (data, status, header, config) {
                    ctrl.notificationMessage = "во время запроса произошла ошибка " + status;
                    console.log("Smth wrong");
                });


                console.log(ctrl.entity);
            };


        }])

    .component('charsNew', {
        templateUrl: 'chars-new/chars-new.template.html',
        controller: 'CharsNewCtrl'
    });
