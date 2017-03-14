'use strict';

angular.module('collEdit')

    .controller('CollEditCtrl', [
        '$scope','$http', '$location', '$routeParams', '$cookies',

        function ($scope, $http, $location, $routeParams, $cookies) {
            const ctrl = this;

            ctrl.entity = {};

            ctrl.entityId = $routeParams.collId;
            console.log("Айдишенька",$routeParams.collId);

            ctrl.editTextId = false;
            ctrl.displayTextIdSwitcher = function () {
                ctrl.editTextId == true ? ctrl.editTextId = false : ctrl.editTextId = true;


            };

            //Запрос на тексты
            /*list of texts*/
            $http.get('/api/texts').success(function (data, status, headers, config) {
                ctrl.textsList = data;
                console.log("x-Connect is here!",ctrl.textsList);
            }).error(function () {
                console.log("Smth wrong");
            });



           /* ctrl.condition_for_showing_extensions = function (characteristic) {
                //console.log("SPECIAL CONDITIONS!",characteristic);
                switch (characteristic){
                    case undefined: return undefined; break;
                    case 8:  return false; break;
                    case 9:  return false; break;
                    case 10: return false; break;
                    case 11: return false; break;
                    default: return true;
                }
            };*/



            ctrl.onChangeCharacteristicQuantity = function () {
                if(ctrl.entity.characteristic_relation_to_main != 'interpos'){
                    delete ctrl.entity.characteristic_attr2;
                    delete ctrl.entity.characteristic_attr2_addition ;
                }
            };

            ctrl.onChangeCharacteristicRelationToMain = function () {
                delete ctrl.entity.characteristic_attr1;
                delete ctrl.entity.characteristic_attr2;
                delete ctrl.entity.characteristic_attr1_addition   ;
                delete ctrl.entity.characteristic_attr2_addition   ;
                delete ctrl.entity.characteristic_divider ;
            };

            ctrl.onChangeCharacteristicSubstantive_lg = function () {
                delete ctrl.entity.characteristic_substantive_lg_explicit;
            };

            /*collocation inf*/
            $http.get('/api/collocations/' + ctrl.entityId).success( function(data, status){
                ctrl.entity = data;//Объект с инфой по словосочетанию

                /*set up*/
                if (ctrl.entity.characteristic_1 != null)
                    ctrl.characteristicAttr1 = ctrl.entity.characteristic_1;
                else    ctrl.characteristicAttr1 = ctrl.entity.characteristic_attr1_explicit;
                if (ctrl.entity.characteristic_1 != null)
                    ctrl.characteristicAttr2 = ctrl.entity.characteristic_2;
                else    ctrl.characteristicAttr2 = ctrl.entity.characteristic_attr2_explicit;

              /*  ctrl.entity.textId = */
            }).error(function ()  {
                console.log("Smth rong");});


            /*list of characteristicsTwo*/
            $http.get('/api/characteristics').success(function (data, status, headers, config) {
                console.log('This is Data:', data,'\n\n This is Status:',status);
                ctrl.characteristicTwoList = data;


                console.log(ctrl.characteristicTwoList);
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
                    return (item.expansion) && (item.characteristic_id == ctrl.entity.characteristic_attr1);
                };
                $scope.characteristicThreeFilter2 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.entity.characteristic_attr2);
                };

            }).error(function () {
                console.log("Smth wrong");
            });

            function changeSendingStatus() {
                ctrl.sended = false;
            }

            ctrl.onAction = function () {
      /*          if (!ctrl.condition_for_showing_extensions(ctrl.characteristicAttr1))
                    ctrl.entity.characteristic_attr1_explicit = ctrl.characteristicAttr1;
                else delete ctrl.entity.characteristic_attr1_explicit   ;
                if (!ctrl.condition_for_showing_extensions(ctrl.characteristicAttr2))
                    ctrl.entity.characteristic_attr2_explicit = ctrl.characteristicAttr2;
                else  delete ctrl.entity.characteristic_attr2_explicit   ;
*/
                $http.put('/api/collocations/' + ctrl.entityId, ctrl.entity).success(function () {
                    ctrl.sendingError = false;
                    ctrl.sended = true;
                    $timeout(changeSendingStatus, 3000);//todo: it's a crutch, i suppose
                }).error(function () {
                    ctrl.sended = false;
                    ctrl.sendingError = true;
                    ctrl.notificationMessage = "Код ошибки: " + status;
                });
            };


            //Работа с коллекцией
            //list of colls
    /*        $http.get('/api/collocations').success(function (data, status, headers, config) {
                console.log('This is Data of Collocations:', data,'\n\n This is Status:',status);
                ctrl.list = data;
                ctrl.collocationsQuantity = ctrl.list.length;
            }).error(function () {
                console.log("Smth wrong");
            }).then(function (res) {*/
                var collection = $cookies.getObject('collectionOfColls');
                var i = 0, curr = 1;

                collection.collectionOfColls.forEach(function (item, i) {
                    if(item == ctrl.entityId) {
                        curr = i;
                    }
                });

                ctrl.collectionQuantity = collection.collectionOfColls.length;//Length Считается верно хм
                ctrl.collectionCurrent = curr + 1;//Чтобы счёт вёлся с единицы

                ctrl.collectionPrevious = collection.collectionOfColls[curr - 1];
                ctrl.collectionNext = collection.collectionOfColls[curr + 1];//

            /*});*/



            //Подгружаю характеристики
            $http.get('jsons/collocation_characteristics.json').then(function (response) {
                ctrl.collocations_characteristics = response.data;
            });

        }])
    .component('collEdit', {
        //templateUrl: 'coll-edit/coll-edit.template.html', //todo:crutch
        templateUrl:'coll-new/coll-new.template.html',
        controller: 'CollEditCtrl'
    });
