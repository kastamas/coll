'use strict';

angular.module('collEdit')

    .controller('CollEditCtrl', [
        '$scope','$http', '$location', '$routeParams',
        function ($scope, $http, $location, $routeParams) {
           const ctrl = this;

            ctrl.entity = {};

            ctrl.entityId = $routeParams.collId;
            console.log("Айдишенька",$routeParams.collId);


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



            ctrl.onChangeCharacteristicQuantity = function () {
                if(ctrl.entity.characteristic_relation_to_main != 'interpos'){
                    delete ctrl.characteristicAttr2;
                    delete ctrl.entity.characteristic_attr2;
                }
            };
            ctrl.onChangeCharacteristicRelationToMain = function () {
                delete ctrl.characteristicAttr1;
                delete ctrl.characteristicAttr2;
                delete ctrl.entity.characteristic_attr2   ;
                delete ctrl.entity.characteristic_attr1   ;
                delete ctrl.entity.characteristic_divider ;
            };

            /*collocation inf*/
            $http.get('/api/collocations/' + ctrl.entityId).success( function(data, status){
                ctrl.entity = data;//Объект с инфой по словосочетанию
                console.log("DATA",data);
                /*set up*/
                if (ctrl.entity.characteristic_1 != null)
                    ctrl.characteristicAttr1 = ctrl.entity.characteristic_1;
                    else    ctrl.characteristicAttr1 = ctrl.entity.characteristic_attr1_explicit;
                if (ctrl.entity.characteristic_1 != null)
                    ctrl.characteristicAttr2 = ctrl.entity.characteristic_2;
                    else    ctrl.characteristicAttr2 = ctrl.entity.characteristic_attr2_explicit;
            }).error(function ()  {console.log("Smth rong");});


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
                    return (item.expansion) && (item.characteristic_id == ctrl.characteristicAttr1);
                };
                $scope.characteristicThreeFilter2 = function (item) {
                    return (item.expansion) && (item.characteristic_id == ctrl.characteristicAttr2);
                };

            }).error(function () {
                console.log("Smth wrong");
            });

            function changeSendingStatus() {
                ctrl.sended = false;
            }

            ctrl.onAction = function () {
                if (!ctrl.condition_for_showing_extensions(ctrl.characteristicAttr1))
                    ctrl.entity.characteristic_attr1_explicit = ctrl.characteristicAttr1;
                else delete ctrl.entity.characteristic_attr1_explicit   ;
                if (!ctrl.condition_for_showing_extensions(ctrl.characteristicAttr2))
                    ctrl.entity.characteristic_attr2_explicit = ctrl.characteristicAttr2;
                else  delete ctrl.entity.characteristic_attr2_explicit   ;

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

        }])

    .component('collEdit', {
        //templateUrl: 'coll-edit/coll-edit.template.html', //todo:crutch
        templateUrl:'coll-new/coll-new.template.html',
        controller: 'CollEditCtrl'
    });
