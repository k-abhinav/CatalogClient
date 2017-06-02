app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $stateProvider
        .state('catalogClient.keyword',{
            url:'/keyword',
            templateUrl:'module/templates/keywordTemplate.html',
            resolve:{
                loadMyDirectives: function ($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            files:[
                                'module/KeyWords/keyWord.js',
                                'module/catalogService.js'
                            ]
                        })
                }
            }
        })

        .state('catalogClient.cart',{
            url:'/cart',
            templateUrl:'module/templates/viewCart.html',
            resolve:{
                loadMyDirectives: function ($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            files:[
                                'module/KeyWords/cart.js',
                                'module/catalogService.js'
                            ]
                        })
                }
            }
        })

        .state('catalogClient.orders',{
            url:'/orders',
            templateUrl:'module/templates/previousOrders.html',
            resolve:{
                loadMyDirectives: function ($ocLazyLoad){
                    return $ocLazyLoad.load(
                        {
                            files:[
                                'module/KeyWords/previousOrders.js',
                                'module/catalogService.js'
                            ]
                        })
                }
            }
        })
    }]);