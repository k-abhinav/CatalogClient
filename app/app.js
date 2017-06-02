'use strict';

var app=angular
        .module('sbAdminApp',[
            'catalog.keyword',
            'oc.lazyLoad',
            'ui.router',
            'angular-loading-bar',
            'ngclipboard','ui.grid', 'ui.grid.pagination', 'ui.grid.resizeColumns', 'ui.grid.selection','ui.grid.autoResize',
             'ui.grid.cellNav','ui.grid.importer'
        ]);

app.config(['$stateProvider','$urlRouterProvider', '$ocLazyLoadProvider',
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({

        });

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('catalogClient',{
                url:'/catalogClient',
                templateUrl:'ui/views/main.html',
                resolve:{
                    loadMyDirectives: function ($ocLazyLoad){
                        return $ocLazyLoad.load(
                            {
                                name: 'sbAdminApp',
                                files: [
                                    'ui/directives/header/header.js',
                                    'ui/directives/header/header-notification/header-notification.js',
                                    'ui/directives/sidebar/sidebar.js'
                                   ]
                            })
                    }
                }
            })

            .state('login', {
                templateUrl: 'ui/views/login.html',
                url: '/login',
                resolve: {
                    loadMyFiles: function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                'https://apis.google.com/js/platform.js'
                            ]
                        });
                    }
                }
            })
    }]);

app.loginData ={};

app.config(function ($httpProvider) {
    //$httpProvider.interceptors.push('authInterceptorService');
});

app.run(['$state', '$rootScope', '$location', function ($state, $rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
        // if route requires auth and user is not logged in
        /*if (server.PartnerPrefix.length == 0 && to.name != 'login') {
            // redirect back to login
            $location.path('/login');
        }*/
        if(to.name === "login" || from.name === '')
            $location.path('/login');
    });
}]);