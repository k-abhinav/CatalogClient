angular.module('catalog.keyword')
    .service('catalogService',['$http','$q','server',function ($http,$q,server) {

        //var catalogbaseUrl = 'http://localhost/catalogservice/';
        //var platformBaseUrl = 'http://localhost/platform/';
        var platformBaseUrl = 'http://stompplatform-testing.azurewebsites.net/';
        var catalogbaseUrl = 'http://stompcatalog-testing.azurewebsites.net/';

        this.getSkuByKeyword = function (keyword,pageCount,stockType,productTypePrefix,currency) {
            if(productTypePrefix === undefined || productTypePrefix==='')
                productTypePrefix =null;
            var url = "?pageCount="+pageCount + "&keyword=" + keyword + "&productType=" + productTypePrefix + "&sorting=undefined" + "&discount=undefined"+"&currency="+currency;
            var action = 'api/publicCatalog/GetSkuByTitleKeyword/' + stockType + '/' + url;
            return server.get(catalogbaseUrl,action);
        };

        this.SaveBuyerToDb = function (buyer) {
            var url = 'api/Direct/CreateBuyer';
            return server.post(platformBaseUrl,url,buyer);
        };


        this.addItemsToCart = function (cart) {
            var url = 'api/Direct/CreateOrder';
            return server.post(platformBaseUrl,url,cart);
        };

        this.GetOrdersForBuyer = function (email,sellingAccount,status) {
            var url = 'api/Direct/GetOrders/' + sellingAccount + '/' +status;
            return server.post(platformBaseUrl,url,email);
        };

        this.CheckIfBuyerExists = function (emailWithSellingAccount) {
            var url = 'api/Direct/GetBuyer';
            return server.post(platformBaseUrl,url,emailWithSellingAccount)
        };

        this.PostBuyerOrders = function (order) {
            var url = 'api/Direct/CreateOrder';
            return server.post(platformBaseUrl,url,order);
        };

        this.RemoveItemFromCart = function (email,orderId,code) {
            var url = 'api/Direct/RemoveOrderItem/'+orderId + '/' + code;
            return server.post(platformBaseUrl,url,email);
        };

        this.GetProductVariantsByCodes = function (variants) {
            var url = 'api/publicCatalog/GetProductVariantsbyCodesIncludingImages';
            return server.post(catalogbaseUrl,url,variants);
        }

    }]);
