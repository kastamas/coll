'use strict';

angular.module('textNew')

    .controller('TextNewCtrl', [
        '$scope','$http', '$location', '$routeParams', function ($scope, $http, $location,$routeParams) {
           /* const ctrl = this;
            $scope.title = 'Текст c id = ';
            $scope.textId = $routeParams.textId;
            console.log($routeParams);*/
            //запрос к бд
            /*$http.get('/api/texts').success(function (data, status, headers, config) {
             console.log('This is Data:', data,'\n\n This is Status:',status,'\n\nTHIS is headers:',headers,'\n\nThisIs Config:',config,'\n\n');
             ctrl.list = data;
             }).error(function () {

             });*/
        }])

    .component('textNew', {
        templateUrl: 'text-new/text-new.template.html',
        controller: 'TextNewCtrl'
    });