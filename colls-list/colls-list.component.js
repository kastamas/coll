'use strict';

angular.module('collsList',[])

    .controller('CollsListCtrl', [
        '$scope','$http', function ($scope, $http) {
            const ctrl = this;
            $scope.title = 'Список словосочетаний';


            //list of colls
            $http.get('/api/collocations').success(function (data, status, headers, config) {
                console.log('This is Data of Collocations:', data,'\n\n This is Status:',status);
                ctrl.list = data;
            }).error(function () {
                console.log("Smth wrong");
            }).then(function (res) {

                //list of texts
                $http.get('/api/texts').success(function (data, status, headers, config) {
                    console.log('This is TEXTS Data:', data, '\n\n This is Status:', status);
                    ctrl.textsList = data;
                    $scope.textsList = data;
                    console.log(ctrl.textsList);
                    return data;
                }).error(function () {
                    console.log("Smth wrong");
                });



                //characteristics
                $http.get('/api/characteristics').success(function (data, status, headers, config) {
                    ctrl.charactsList = data;
                    console.log("Characteristics Data",ctrl.charactsList);//Объект всех характеристик 2



                    //new array for chrs 2
                    res.data.forEach(function (item) {//Одна строка за итерацию
                        item.charact_2_str = {};//Новая переменная под объект
                        var NWARRAY = "";

                        /*Моя тима по сборке массива*/
                        var  str = item.charact_2;
                        str = str.replace("{"," ");
                        str = str.replace("}"," ");
                        var strArray = str.split(",");


                        strArray.forEach(function (item) {// строка за итерацию

                                ctrl.charactsList.forEach(function (item2) {
                                    if (item == item2.id){
                                        item = item2.characteristic;
                                        NWARRAY = NWARRAY + item + " ";

                                    }

                                });
                        });
                        item.charact_2 = NWARRAY;
                    });
                }).error(function () {
                    console.log("Smth wrong");
                });

                //set up for filters
                ctrl.filter = {text_id:0, status: "any", charact_1:"any"};

                //todo:remove this bicycle from india
                $scope.collocationsMainFilter = function (item) {

                    return (item.collocation) &&
                        ((ctrl.filter.text_id != 0 && ctrl.filter.text_id != null) ? item.text_id == ctrl.filter.text_id  : " ") &&
                        ((ctrl.filter.status != "any") ? item.status == ctrl.filter.status : " ") &&
                        ((ctrl.filter.charact_1 != "any") ? item.charact_1 == ctrl.filter.charact_1 : " ")
                        ;
                 };

                 $scope.collocationsTextFilter = function (item) {
                     return (item.collocation) && ((ctrl.filter.text_id != 0 && ctrl.filter.text_id != null) ? item.text_id == ctrl.filter.text_id  : " ");
                 };



             });



        }])

    .component('collsList', {
        templateUrl: 'colls-list/colls-list.template.html',
        controller: 'CollsListCtrl'
    });
