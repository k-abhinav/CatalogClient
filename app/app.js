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
                            }),
                            $ocLazyLoad.load(
                                {
                                    name: 'toggle-switch',
                                    files: ["../bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                        "../bower_components/angular-toggle-switch/angular-toggle-switch.css"
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


app.run(['$state', '$rootScope', '$location', function ($state, $rootScope, $location) {
    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
        /*if(to.name === "login" || from.name === ''){
            $location.path('/login');
            $state.go('login');
        }*/
        if(to.name === 'login' || from.name === ''){
            $location.path('/login');
        }
    });

}]);