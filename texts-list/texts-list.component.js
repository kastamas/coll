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

          //sort on init
          $scope.sortingRows = 'name';
          $scope.sortingReverse = false;

         $scope.sort = function (fieldName) {
             if($scope.sortingRows === fieldName){
                 $scope.sortingReverse = !$scope.sortingReverse;
             } else {
                 $scope.sortingRows = fieldName;
                 $scope.sortingReverse = false;
             }
         };

    }])


    .component('textsList', {
        templateUrl: 'texts-list/texts-list.template.html',
        controller: 'TextsListCtrl'
    });
