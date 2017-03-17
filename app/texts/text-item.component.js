'use strict';

angular.module('texts')

    .controller('TextItemCtrl', [
        '$scope','$http', '$location', '$routeParams', function ($scope, $http, $location,$routeParams) {
            const ctrl = this;
            $scope.title = 'Текст c id = ';
            ctrl.textId = $routeParams.textId;
            console.log($routeParams);


            $http.get('/api/texts/'+ctrl.textId).success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status,'\n\nTHIS is headers:',headers,'\n\nThisIs Config:',config,'\n\n');
                ctrl.entity = data;
            }).error(function () {});
        }])

    .component('textItem', {
        templateUrl: 'texts/text-item.template.html',
        controller: 'TextItemCtrl'
    });
