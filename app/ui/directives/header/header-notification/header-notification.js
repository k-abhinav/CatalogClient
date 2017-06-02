'use strict';

angular.module('sbAdminApp')
    .directive('headerNotification',function () {
        var directive={
            templateUrl: 'ui/directives/header/header-notification/header-notification.html',
            restrict: 'E',
            replace: true,
            controller : headerCtrl
        }

        headerCtrl.$inject = ['$scope','server'];
        return directive ;

        function headerCtrl($scope,server) {
            $scope.pic=server.userInfo.Photo;
        }

    });