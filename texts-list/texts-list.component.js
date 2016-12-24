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
             /*Потому что постгрес какого-то черта возвращает значение COUNT() строкой O_o*/
             ctrl.list.forEach(function (item) {
                 item.number_of_collocations = parseInt(item.number_of_collocations, 10)
             }) ;
             console.log(typeof ctrl.list[1].number_of_collocations);
         }).error(function () {

         });

          //sort on init
          $scope.sortingRows = 'title';
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
