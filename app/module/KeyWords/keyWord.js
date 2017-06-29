angular.module('catalog.keyword')
    .directive('keywordSearching',keywordSearching);

function keywordSearching() {

    var directive={
      restrict:'E',
        templateUrl:'module/keyWords/keyWord.html',
        controller:keywordCtrl
    };

    keywordCtrl.$inject=['$scope','$window','catalogService','server','logger','$state','$rootScope'];
    return directive;

    function keywordCtrl($scope,$window,catalogService,server,logger,$state,$rootScope) {

        $scope.keywordSerach = false;
        var obj = window.urlParams.param;

        //$scope.keywordSerach=true;
        $scope.catalogPage=false;
        $scope.dataRecord=[];
        $scope.pageCount = 1;
        $scope.stockType = "existingStock";
        $scope.productTypePrefix = '';
        $scope.productType = undefined;
        $scope.qty = 1;
        $scope.wishList = [];
        $scope.currency = "INR";
        var buyerEmail = server.userInfo.Email;
        var event1 = "PublishProductTypes";
        var el = document.getElementById("keyword");
        el.focus();

        var success=function (res) {
            if(res===null || res.skuData.length === 0)
            {
                if($scope.pageCount>1){
                    $scope.pageCount--;
                    if($scope.pageCount === 1)
                        $scope.page = false;
                    alert("Could not get more items by this keyword");
                    return;
                }
                alert("Please Enter Correct Keyword");
                //$scope.catalogPage=false;
                $scope.priceShow = false;
                $scope.showStock = false;
                $scope.pageCount = 1;
                return;
            }
            if(res.productTypesAffected.length > 0){
                $rootScope.$broadcast(event1, res.productTypesAffected);
                $scope.showProductTypeBox = true;
                var y = objectsAreSame($scope.productTypes,res.productTypesAffected);
                if(!y)
                    $scope.productTypes = res.productTypesAffected;
            }
            else $scope.showProductTypeBox = false;
            if($scope.stockType === "all")
                $scope.showStock = false;
            else $scope.showStock = true;
            $scope.catalogPage=true;
            $scope.dataRecord=res.skuData;
            $scope.priceShow = true;
            if(obj.pageCount === 1)
                $scope.page = false;
        };
        var error=function (er) {
            alert("An Error Occured. Error : "+er.message);
        };

        catalogService.getSkuByKeyword(obj.keyword,obj.pageCount,$scope.stockType,obj.productType,obj.currency)
            .then(success,error);


        var requestDataForBuyer = {
            key : buyerEmail,
            value : "SM-CTL"
        };
        catalogService.CheckIfBuyerExists(requestDataForBuyer).then(function (res) {
            $scope.buyerInfo = res;

        },function (er) {
            alert("Could not get buyer from db.Error : "+er.message);
        });

        $scope.$on('ProductTypeSelected',function (event,data) {
            $scope.productTypePrefix = data.prefix;
            obj.pageCount = 1;
            catalogService.getSkuByKeyword(obj.keyword,obj.pageCount,$scope.stockType,$scope.productTypePrefix,obj.currency)
                .then(success,error);
        });

        $scope.getDataByKeyword=function (keyword) {
            if(keyword === undefined){
                alert("Enter Valid Keyword..");
                return;
            }
            $scope.productTypePrefix = '';
            $scope.productTypes = [];
            $scope.modifiedKeyword = keyword;
            var space = ' ';
            var and = 'and';

            var keywordWithoutAnd = keyword.replace(new RegExp(and, "g"),"");
            var keywordWithoutMultipleSpaces = keywordWithoutAnd.replace(/ +/g, ' ');
            $scope.modifiedKeyword = keywordWithoutMultipleSpaces.replace(new RegExp(space, "g")," and " );

            catalogService.getSkuByKeyword($scope.modifiedKeyword,$scope.pageCount=1,$scope.stockType,$scope.productTypePrefix,$scope.currency).then(success,error);
        };

        $scope.zoomImage= function(url){
            $window.open(url, "_blank", "left=250,top=30,status=no,height=600,width=800,toolbar=no,location=no,menubar=no,titlebar=no");
        };

        $scope.Next = function () {
            obj.pageCount++;
            $scope.page = true;
            if($scope.productTypePrefix === "")
                catalogService.getSkuByKeyword(obj.keyword,obj.pageCount,$scope.stockType,obj.productType,obj.currency)
                .then(success,error);
            else catalogService.getSkuByKeyword(obj.keyword,obj.pageCount,$scope.stockType,$scope.productTypePrefix,obj.currency)
                .then(success,error);
        };

        $scope.Previous = function () {
            if(obj.pageCount > 1)
                obj.pageCount--;

            $scope.page = true;
            if($scope.productTypePrefix === "")
                catalogService.getSkuByKeyword(obj.keyword,obj.pageCount,$scope.stockType,obj.productType,obj.currency)
                    .then(success,error);
            else catalogService.getSkuByKeyword(obj.keyword,obj.pageCount,$scope.stockType,$scope.productTypePrefix,obj.currency)
                .then(success,error);
        };

        $scope.addToCart = function (code,qty,thumbUri,price,id) {

            var newWishlist = {Code:code,Quantity:qty,Image : thumbUri,Price:price};
            var existingSku = $scope.wishList.filter(f=>f.Code === code)[0];

            if(existingSku === undefined)
                $scope.wishList.push(newWishlist);
            else {
                var index = $scope.wishList.indexOf(existingSku);
                $scope.wishList.splice(index,1);
                $scope.wishList.push(newWishlist);
            }

            server.userWishList = $scope.wishList;
            //var orderDate = new Date().getDate();
            var newOrder= {
                OrderId : "opencart",
                Items : [{
                    Sku : newWishlist.Code,Quantity:newWishlist.Quantity,ItemCost:{Value:newWishlist.Price,Currency:$scope.currency}
                }],
                SellingAccountPrefix : 'SM-CTL'
            };

            if($scope.buyerInfo === null || $scope.buyerInfo === ''){
                newOrder.Buyer = {
                    EmailId : buyerEmail,
                    SellingAccountPrefix : 'SM-CTL'
                }
            }
            else newOrder.Buyer = $scope.buyerInfo;

            catalogService.addItemsToCart(newOrder).then(function (res) {
               logger.success("Added To Cart");
                var btn = document.getElementById(id);
                btn.style.backgroundColor = '#F1948A';
                btn.innerText = 'Added To Cart';
            },function (er) {
                logger.error("Error : "+er.message);
            });
        };

        $scope.getStockType = function (stockType) {
            if(stockType === false)
                $scope.stockType = "existingStock";
            if(stockType === true){
                $scope.stockType = "all";
                catalogService.getSkuByKeyword($scope.modifiedKeyword,$scope.pageCount=1,$scope.stockType,$scope.productTypePrefix,$scope.currency).then(success,error);
            }
        };

        function objectsAreSame(ary1, ary2) {
            if(ary1 === undefined || ary2 === undefined)
                return false;
            return (ary1.join('') === ary2.join(''));
        }
        
        $scope.GoToCart = function () {
            $state.go('catalogClient.cart');
        }

    }

}