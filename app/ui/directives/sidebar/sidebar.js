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

            sidebarController.$inject=['$scope','$state','server'];
            return directive;

            function sidebarController($scope,$state,server) {

                $scope.email = server.userInfo.Email;

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
            }
        }]);
