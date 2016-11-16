'use strict';

angular.module('collsList',[])

    .controller('CollsListCtrl', [
        '$scope','$http', function ($scope, $http) {
            const ctrl = this;
            $scope.title = 'Список словосочетаний';

            //запрос к бд
            $http.get('/api/collocations').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.list = data;
                console.log(ctrl.list);
            }).error(function () {

            });
        }])

    .component('collsList', {
        templateUrl: 'colls-list/colls-list.template.html',
        controller: 'CollsListCtrl'
    });
