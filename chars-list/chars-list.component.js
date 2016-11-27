'use strict';

angular.module('charsList',[])

    .controller('CharsListCtrl', [
        '$scope','$http', '$route', function ($scope, $http, $route) {
            const ctrl = this;
            $scope.title = 'Список характеристик';

            //запрос к бд
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                    console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.list = data;
                console.log(ctrl.list);
            }).error(function () {

            });

            ctrl.editing = undefined;


            $scope.editChar = function (id) {
                    ctrl.editing = id;

                    $scope.saveChanges = function () {
                        if (ctrl.newValue) {
                        var TESTVAR = {"characteristic" : ctrl.newValue,
                                        "id": ctrl.editing};
                        $http.put('/api/characteristics/'+id, TESTVAR).success(function () {
                            $route.reload();
                        }).error(function () {

                        });

                        console.log("Ага, вот это значение",TESTVAR);
                        }
                        ctrl.editing = undefined;
                    };


            };


            
        }])

    .component('charsList', {
        templateUrl: 'chars-list/chars-list.template.html',
        controller: 'CharsListCtrl'
    });
