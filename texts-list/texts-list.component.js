'use strict';

angular.module('textsList',[])

    .controller('TextsListCtrl', [
        '$scope','$http', function ($scope, $http) {
        const ctrl = this;
            $scope.title = 'Список текстов';

         //запрос к бд
         $http.get('/api/texts').success(function (data, status, headers, config) {
            console.log('This is Data:', data,'\n\n This is Status:',status);
             ctrl.list = data;
             console.log(ctrl.list);
         }).error(function () {

         });
    }])

    .component('textsList', {
        templateUrl: 'texts-list/texts-list.template.html',
        controller: 'TextsListCtrl'
    });
