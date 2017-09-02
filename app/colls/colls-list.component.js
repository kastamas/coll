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
                ctrl.filter = {
                    text_id: null,
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

            ctrl.showMoreFilters = function () {
                ctrl.filter.more == true ? ctrl.filter.more = false : ctrl.filter.more = true;
            };

            ctrl.resetFilter = function (text_id) {
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

            ctrl.statistic = function () {
                var statistic = {all: ctrl.collectionSorted.length};
                alert("Cловосочетаний по фильтру: " + statistic.all);
            };

            //list of colls
            ctrl.updateCollection = function () {
                var options = ctrl.filter;
                    options.reverse = ctrl.sorting.reverse;
                    options.rows = ctrl.sorting.rows;

                var parameters = encodeURIComponent(JSON.stringify(options));
                $http.get('/api/collocations/?'+parameters).success(function (data, status, headers, config) {
                    ctrl.list = data.data;
                    ctrl.quantity = data.quantity;

                    ctrl.updateCounters();

                }).error(function () {
                    console.log("Smth wrong");
                });

            };

            ctrl.updateCounters = function() {
                ctrl.collocationsTotalQuantity = ctrl.quantity.total[0].count;

                if (ctrl.filter.text_id){
                    ctrl.collocationsTotalInTextQuantity = ctrl.quantity.totalInText[0].count;
                    ctrl.collocationsFilteredQuantity = ctrl.list.length;

                    ctrl.collsFilteredInPercents = (ctrl.collocationsFilteredQuantity / ctrl.collocationsTotalInTextQuantity);
                }
            };

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



            var collectionOfColls = [];
            var collectionFiltered;



            //Слежка за Filter
            $scope.$watchCollection(angular.bind(ctrl, function () {
                return ctrl.filter;
            }), function( ) {
                $cookies.putObject('collsListFilter', ctrl.filter);
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
             /*
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
*/


            // pagination set up
            $scope.currentPage = 3;
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
                        $http.delete('/api/collocation/' + item_id).success(function (data, status) {
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
    }])

    .component('collsList', {
        templateUrl: 'colls/colls-list.template.html',
        controller: 'CollsListCtrl'
    });