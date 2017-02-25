'use strict';

angular.module('collsList', ['ngCookies'])


    .filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }])

    .controller('CollsListCtrl', [
        '$scope','$http','$route', '$cookies', '$filter',
        function ($scope, $http, $route, $cookies, $filter) {
            const ctrl = this;
            $scope.title = 'Список словосочетаний';

            //list of colls
            $http.get('/api/collocations').success(function (data, status, headers, config) {
                console.log('This is Data of Collocations:', data,'\n\n This is Status:',status);
                ctrl.list = data;
                ctrl.collocationsQuantity = ctrl.list.length;
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



                //characteristics
                $http.get('/api/characteristics').success(function (data, status, headers, config) {
                    ctrl.charactsList = data;
                    console.log("Characteristics Data",ctrl.charactsList);//Объект всех характеристик 2
                }).error(function () {
                    console.log("Smth wrong");
                });

                //Подгружаю характеристики
                $http.get('jsons/collocation_characteristics.json').then(function (response) {
                    ctrl.collocations_characteristics = response.data;
                });




                /*
                    very very bad
                */
                ctrl.condition_for_showing_extensions = function (characteristic) {
                    console.log("SPECIAL CONDITIONS!",characteristic);
                    switch (characteristic){
                        case undefined: return undefined; break;
                        case 8:  return false; break;
                        case 9:  return false; break;
                        case 10: return false; break;
                        case 11: return false; break;
                        default: return true;
                    }
                };

                /*list of characteristicsTwo*/
                $http.get('/api/characteristics').success(function (data, status, headers, config) {
                    ctrl.characteristicTwoList = data;
                }).error(function () {
                    console.log("Smth wrong");
                });

                /*list of characteristicsThree*/
                $http.get('/api/characteristicsExpansion').success(function (data, status, headers, config) {
                    console.log('This is Data:', data,'\n\n This is Status:',status);
                    ctrl.characteristicThreeList = data;
                    console.log(ctrl.characteristicThreeList);

                    //todo:optimisation
                    $scope.characteristicThreeFilter1 = function (item) {
                        return (item.expansion) && (item.characteristic_id == ctrl.filter.characteristic_1);
                    };
                    $scope.characteristicThreeFilter2 = function (item) {
                        return (item.expansion) && (item.characteristic_id == ctrl.filter.characteristic_2);
                    };
                }).error(function () {
                    console.log("smth wrong");
                });


                //set up for orderBys
                //sort on init
                if($cookies.getObject('collsListSort')){
                    ctrl.sorting = $cookies.getObject('collsListSort');
                } else {
                    ctrl.sorting = {rows:"created_at", reverse:true};
                    $cookies.putObject('collsListSort', ctrl.sorting);
                }


                ctrl.sort = function (fieldName)
                {
                    if(ctrl.sorting.rows === fieldName){
                        ctrl.sorting.reverse = !ctrl.sorting.reverse;
                    } else {
                        ctrl.sorting.rows = fieldName;
                        ctrl.sorting.reverse = false;
                    }
                    $cookies.putObject('collsListSort', ctrl.sorting);
                };

                /*TODO: Приведи основной объект в порядок.  characteristic_attr1 - Это вообще неочевидно */

                //for filters
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

                                   characteristic_1: null,
                                   characteristic_2: null,
                                   characteristic_attr1: null,
                                   characteristic_attr2: null,
                                   characteristic_divider: null,

                                   more: false
                    };
                    $cookies.putObject('collsListFilter', ctrl.filter);
                }

                //todo:remove this bicycle from india
                $scope.collocationsMainFilter = function (item)
                {
                    $cookies.putObject('collsListFilter', ctrl.filter);

                    //If it works, don't touch it
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

                        ((ctrl.filter.characteristic_1 != null) ? item.characteristic_1 == ctrl.filter.characteristic_1 : " ") &&
                        ((ctrl.filter.characteristic_2 != null) ? item.characteristic_2 == ctrl.filter.characteristic_2 : " ") &&
                        ((ctrl.filter.characteristic_attr1 != null) ? item.characteristic_attr1 == ctrl.filter.characteristic_attr1 : " ") &&
                        ((ctrl.filter.characteristic_attr2 != null) ? item.characteristic_attr2 == ctrl.filter.characteristic_attr2 : " ") &&
                        ((ctrl.filter.characteristic_divider != null) ? item.characteristic_divider == ctrl.filter.characteristic_divider : " ")
                        ;
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

                //for collection
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
                    ctrl.filter = {text_id: text_id,
                        status: "any",
                        characteristic_quantity: "any",
                        characteristic_relation_to_main: "any",
                        characteristic_preposition: "any",

                        characteristic_substantive_lg: "any",
                        characteristic_substantive_lg_explicit: "any",
                        characteristic_substantive_animacy: "any",
                        characteristic_substantive_case: "any",

                        characteristic_1: null,
                        characteristic_2: null,
                        characteristic_attr1: null,
                        characteristic_attr2: null,
                        characteristic_divider: null,

                        more: true
                    };
                };

                ctrl.delete = function (item_id, collocation) {//function Expression
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
                };/*ToDo:refactor*/

                ctrl.showMoreFilters = function () {
                    ctrl.filter.more == true ? ctrl.filter.more = false : ctrl.filter.more = true;
                };

                ctrl.statistic = function () {

                    var statistic = {all: ctrl.collectionSorted.length};

                   alert("Cловосочетаний по фильтру: " + statistic.all);
                };


                ctrl.onChangeCharacteristicQuantity = function () {
                /*     ctrl.filter.characteristic_2 = null;
                     ctrl.filter.characteristic_attr2 = null;*/
                };

                ctrl.onChangeCharacteristicRelationToMain = function () {
                   /* ctrl.filter.characteristic_1 = null;
                    ctrl.filter.characteristic_2 = null;
                    ctrl.filter.characteristic_attr2  = null ;
                    ctrl.filter.characteristic_attr1  = null ;
                    ctrl.filter.characteristic_divider = null;*/
                };

                ctrl.onChangeCharacteristicSubstantive_lg = function () {
                   /* ctrl.filter.characteristic_substantive_lg_explicit = "any";*/
                };

             });

        }])

    .component('collsList', {
        templateUrl: 'colls-list/colls-list.template.html',
        controller: 'CollsListCtrl'
    });

