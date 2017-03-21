'use strict';

angular.module('colls')


    .filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }])



    .controller('CollsListCtrl', [
        '$scope','$http','$route', '$cookies', '$filter',
        function ($scope, $http, $route, $cookies, $filter) {

            const ctrl = this;

            //list of colls
            $http.get('/api/collocations').success(function (data, status, headers, config) {
                ctrl.list = data;
                ctrl.collocationsQuantity = ctrl.list.length;//stupid
            }).error(function () {
                console.log("Smth wrong");
            }).then(function (res) {

            //list of texts
            $http.get('/api/texts').success(function (data, status, headers, config) {
                console.log('This is TEXTS Data:', data, '\n\n This is Status:', status);
                ctrl.textsList = data;
            }).error(function () {
                console.log("Smth wrong");
            });

            // uploading characteristics from json
            $http.get('jsons/collocation_characteristics.json').then(function (response) {
                ctrl.collocations_characteristics = response.data;
            });

            // list of characteristics
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                ctrl.characteristicTwoList = data;
            }).error(function () {
                console.log("Smth wrong");
            });

            // list of characteristics expansion
            $http.get('/api/characteristicsExpansion').success(function (data, status, headers, config) {
                ctrl.characteristicThreeList = data;
                console.log(ctrl.characteristicThreeList);

                //todo:optimisation
                $scope.characteristicThreeFilter1 = function (item) {
                    if(ctrl.filter.characteristic_attr1 != null){
                        return (item.expansion) && (item.characteristic_id == ctrl.filter.characteristic_attr1);
                    } else {
                        return (item.expansion);
                    }
                };

                $scope.characteristicThreeFilter2 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.filter.characteristic_attr2);
                };
            }).error(function () {
                console.log("smth wrong");
            });







            // sorting set up
            if($cookies.getObject('collsListSort')){
                ctrl.sorting = $cookies.getObject('collsListSort');
            } else {
                ctrl.sorting = {rows:"created_at", reverse:true};
                $cookies.putObject('collsListSort', ctrl.sorting);
            }






            // filter set up
            if($cookies.getObject('collsListFilter')){
                ctrl.filter = $cookies.getObject('collsListFilter');
            }  else{
                ctrl.filter = {text_id: null,
                               status: "any",
                               characteristic_quantity: "any",
                               characteristic_relation_to_main: "any",
                               characteristic_preposition: "any",

                               characteristic_substantive_lg: "any",
                               characteristic_substantive_lg_explicit: "any",
                               characteristic_substantive_animacy: "any",
                               characteristic_substantive_case: "any",

                               characteristic_attr1: null,
                               characteristic_attr2: null,
                               characteristic_divider: null,

                               characteristic_attr1_addition: null,
                               characteristic_attr2_addition: null,

                               more: false
                };
                $cookies.putObject('collsListFilter', ctrl.filter);
                console.log("filter", JSON.stringify(ctrl.filter));
            }

            //todo:remove this bicycle from india
            $scope.collocationsMainFilter = function (item)
            {
                $cookies.putObject('collsListFilter', ctrl.filter);

                //if it works, don't touch it!
                return (item.collocation) &&
                    ((ctrl.filter.text_id != 0 && ctrl.filter.text_id != null) ? item.text_id == ctrl.filter.text_id  : " ") &&
                    ((ctrl.filter.status != "any") ? item.status == ctrl.filter.status : " ") &&
                    ((ctrl.filter.characteristic_quantity != "any") ? item.characteristic_quantity == ctrl.filter.characteristic_quantity : " ") &&
                    ((ctrl.filter.characteristic_relation_to_main != "any") ? item.characteristic_relation_to_main == ctrl.filter.characteristic_relation_to_main : " ") &&
                    ((ctrl.filter.characteristic_preposition != "any") ? item.characteristic_preposition == ctrl.filter.characteristic_preposition : " ") &&

                    ((ctrl.filter.characteristic_substantive_lg != "any") ? item.characteristic_substantive_lg == ctrl.filter.characteristic_substantive_lg : " ") &&
                    ((ctrl.filter.characteristic_substantive_lg_explicit != "any") ? item.characteristic_substantive_lg_explicit == ctrl.filter.characteristic_substantive_lg_explicit : " ") &&
                    ((ctrl.filter.characteristic_substantive_animacy != "any") ? item.characteristic_substantive_animacy == ctrl.filter.characteristic_substantive_animacy : " ") &&
                    ((ctrl.filter.characteristic_substantive_case != "any") ? item.characteristic_substantive_case == ctrl.filter.characteristic_substantive_case : " ") &&

                    ((ctrl.filter.characteristic_attr1 != null) ? item.characteristic_attr1 == ctrl.filter.characteristic_attr1 : " ") &&
                    ((ctrl.filter.characteristic_attr2 != null) ? item.characteristic_attr2 == ctrl.filter.characteristic_attr2 : " ") &&

                    ((ctrl.filter.characteristic_attr1_addition != null) ? item.characteristic_attr1_addition == ctrl.filter.characteristic_attr1_addition : " ") &&
                    ((ctrl.filter.characteristic_attr2_addition != null) ? item.characteristic_attr2_addition == ctrl.filter.characteristic_attr2_addition : " ") &&
                    ((ctrl.filter.characteristic_divider != null) ? item.characteristic_divider == ctrl.filter.characteristic_divider : " ");

                    /*((ctrl.filter.characteristic_divider != null) ? item.characteristic_divider == ctrl.filter.characteristic_divider : " ")*/

             };

             $scope.collocationsTextFilter = function (item) {//Only for counting
                 return (item.collocation) &&
                        ((ctrl.filter.text_id != 0 && ctrl.filter.text_id != null) ?
                        item.text_id == ctrl.filter.text_id  : " ");
             };



            var collectionOfColls = [];
            var collectionFiltered;

            //Слежка за Filter
            $scope.$watchCollection(angular.bind(ctrl, function () {
                return ctrl.filter;
            }), function( ) {
                ctrl.updateCollection();
                console.log("Filter has changed!");
            });

            //Слежка за Sort
            $scope.$watchCollection(angular.bind(ctrl, function () {
                return ctrl.sorting;
            }), function( ) {
                ctrl.updateCollection();
                console.log("Sort has changed!");
            });

            //for collection | Refactoring in progress
            ctrl.updateCollection = function () {
                ctrl.collectionFiltered = $filter('filter')(ctrl.list, $scope.collocationsMainFilter);

                ctrl.collsInText = $filter('filter')(ctrl.list, $scope.collocationsTextFilter);
                ctrl.collsFilteredInPercents = (ctrl.collectionFiltered.length / ctrl.collsInText.length);

                ctrl.collectionSorted = $filter('orderBy')(ctrl.collectionFiltered, ctrl.sorting.rows, ctrl.sorting.reverse);
                collectionOfColls = [];
                ctrl.collectionSorted.forEach(function (item) {
                    collectionOfColls.push(item.id);
                });
                var collection = {collectionOfColls: collectionOfColls
                                    };//Формирую объект
                $cookies.putObject('collectionOfColls', collection);
                console.log("New Collection", collection);
            };

            ctrl.clearFilter = function (text_id) {
                ctrl.filter = {
                    text_id: text_id,
                    status: "any",
                    characteristic_quantity: "any",
                    characteristic_relation_to_main: "any",
                    characteristic_preposition: "any",

                    characteristic_substantive_lg: "any",
                    characteristic_substantive_lg_explicit: "any",
                    characteristic_substantive_animacy: "any",
                    characteristic_substantive_case: "any",

                    characteristic_attr1: null,
                    characteristic_attr2: null,
                    characteristic_divider: null,

                    characteristic_attr1_addition: null,
                    characteristic_attr2_addition: null,


                    more: true
                };
            };

            // pagination set up
            $scope.currentPage = 1;
            $scope.pageSize = 10;


            ctrl.sort = function (fieldName) {
                if(ctrl.sorting.rows === fieldName) {
                    ctrl.sorting.reverse = !ctrl.sorting.reverse;
                } else {
                    ctrl.sorting.rows = fieldName;
                    ctrl.sorting.reverse = false;
                }
                $cookies.putObject('collsListSort', ctrl.sorting);
            };

            ctrl.delete = function (item_id, collocation) {
                if( confirm("Словосочетание «"+ collocation + "» будет удалено.") ) {
                        $http.delete('/api/collocations/' + item_id).success(function (data, status) {
                            //топорнейшее решение, но должно сработать
                            ctrl.list.forEach(function (item,i) {
                                if (item.id === item_id) {
                                    ctrl.list.splice(i,1);
                                }
                            });
                            console.log("Запрос на удаление выполнен, статус: ", status);
                        }).error(function (data, status) {
                            console.log("Запрос на удаление НЕ ВЫПОЛНЕН, статус: ", status);
                        });
                    }
            };

            ctrl.showMoreFilters = function () {
                ctrl.filter.more == true ? ctrl.filter.more = false : ctrl.filter.more = true;
            };

            ctrl.statistic = function () {
                var statistic = {all: ctrl.collectionSorted.length};
                alert("Cловосочетаний по фильтру: " + statistic.all);
            };
        });
    }])

    .component('collsList', {
        templateUrl: 'colls/colls-list.template.html',
        controller: 'CollsListCtrl'
    });