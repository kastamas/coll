'use strict';

angular.module('textEdit')

    .controller('TextEditCtrl', [
        '$scope','$http', '$location', '$routeParams',
        function ($scope, $http, $location,$routeParams) {
            const ctrl = this;

            $scope.title = 'Текст c id = ';
            ctrl.textId = $routeParams.textId;
            console.log($routeParams);

            $http.get('/api/texts/'+ctrl.textId).success(function (data, status, headers, config) {
             console.log('This is Data:', data,'\n\n This is Status:',status,'\n\nTHIS is headers:',headers,'\n\nThisIs Config:',config,'\n\n');
             ctrl.entity = data;
             }).error(function () {});


            ctrl.sending = function () {
                $http.put('/api/texts/'+ctrl.textId, ctrl.entity).success(function (data,status,headers,config){
                    ctrl.notificationMessage ="текст изменен ;)";
                    console.log("Connect is here!");
                }).error(function  (data, status, header, config) {
                    ctrl.notificationMessage = "во время запроса произошла ошибка " + status;
                    console.log("Smth wrong");
                });

                console.log(ctrl.entity);
            };

        }])

    .component('textEdit', {
        templateUrl: 'text-edit/text-edit.template.html',
        controller: 'TextEditCtrl'
    });
