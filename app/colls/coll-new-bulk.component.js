'use strict';

angular.module('colls')

.controller('CollNewBulkCtrl', [
    '$http', '$scope',
    function ($http, $scope) {
        const ctrl = this;





        $scope.file = {}; // model
        $scope.options = {
            //Вызывается для каждого выбранного файла
            change: function (file) {
                //В file содержится информация о файле
                //Загружаем на сервер
                file.$upload('./api/htmlParseSpec', file).then(function (response) {
                    $scope.resulting = response.data;
                });

                console.log("THIS IS TYPE!", typeof $scope.resulting);
            }
        };

       /* function success() {
            $scope.resulting = data;
        }
        
        function failed() {
            
        }*/

/*ctrl.onUploading = function () {
            $http.post('./', ctrl.file).success(function (data,status,headers,config) {
                console.log("Done!");
            }).error(function (data, status, header, config) {
                console.log("ERROR!", status);
            })
        };*/
    }])

.component('collNewBulk', {
    templateUrl: 'colls/coll-new-bulk.template.html',
    controller: 'CollNewBulkCtrl'
});