'use strict';

angular.module('sbAdminApp')
        .directive('sidebar',['$location',function () {
            var directive = {
                templateUrl: 'ui/directives/sidebar/sidebar.html',
                restrict: 'E',
                replace: true,
                scope: {},
                controller: sidebarController
            };

            sidebarController.$inject=['$scope','$state','server','$rootScope'];
            return directive;

            function sidebarController($scope,$state,server,$rootScope) {

                $scope.email = server.userInfo.Email;
                var event1 = 'ProductTypeSelected';

                $scope.check = function (x, state) {

                    if (x === $scope.collapseVar)
                        $scope.collapseVar = 0;
                    else
                        $scope.collapseVar = x;
                    if(state !== undefined)
                    {
                        if(state.length>0)
                            $state.go(state);
                    }
                };
                
                $scope.$on('PublishProductTypes',function (event,data) {
                    $scope.productTypes = data;
                    $scope.showProductTypeBox = true;
                });

                $scope.productTypeSelected = function (productType) {
                    if(productType !== null && productType !== undefined)
                        $rootScope.$broadcast(event1, productType);
                }
            }
        }]);
