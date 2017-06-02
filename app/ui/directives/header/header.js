'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('header',function(){
        var directive = {
            templateUrl:'ui/directives/header/header.html',
            restrict: 'E',
            replace: true,
            controller:headerController
        };
        headerController.$inject =['$scope','server'];
        return directive;

        function headerController($scope,server){
            $scope.userName = server.userInfo.Email;
        }
    });



