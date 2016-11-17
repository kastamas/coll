'use strict';

angular.module('charsList',[])

    .controller('CharsListCtrl', [
        '$scope','$http', function ($scope, $http) {
            const ctrl = this;
            $scope.title = 'Список характеристик';

            //запрос к бд
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                    console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.list = data;
                console.log(ctrl.list);
            }).error(function () {

            });
        }])

    .component('charsList', {
        templateUrl: 'chars-list/chars-list.template.html',
        controller: 'CharsListCtrl'
    });
