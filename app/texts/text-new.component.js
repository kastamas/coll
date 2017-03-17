'use strict';

angular.module('texts')

    .controller('TextNewCtrl', [
        '$scope','$http', '$location', '$routeParams', function ($scope, $http, $location,$routeParams) {
           const ctrl = this;

            ctrl.entity = {};
            $scope.title = 'Новый текст';

            ctrl.sending = function () {
                $http.post('./api/texts', ctrl.entity).success(function (data,status,headers,config){
                     ctrl.notificationMessage ="текст добавлен ;)";
                     console.log("Connect is here!");
                }).error(function  (data, status, header, config) {
                    ctrl.notificationMessage = "во время запроса произошла ошибка " + status;
                    console.log("Smth wrong");
                });


                console.log(ctrl.entity);
            };
           /* $http.post('/api/texts/', entity)*/


        }])

    .component('textNew', {
        templateUrl: 'texts/text-new.template.html',
        controller: 'TextNewCtrl'
    });
