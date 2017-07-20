/**
 * Created by Neetu on 5/17/2017.
 */

angular.module('catalog.keyword')
    .directive('cart',cart);

function cart() {

    var directive={
        restrict:'E',
        templateUrl:'module/keyWords/cart.html',
        controller:cartCtrl,
        scope:{}
    };

    cartCtrl.$inject=['$scope','$window','catalogService','server','logger'];
    return directive;

    function cartCtrl($scope,$window,catalogService,server,logger) {
        $scope.wishlistItems = [];
        $scope.buyerInfo = null;
        $scope.newOrder = {};
        $scope.wishlistItems = server.userWishList;
        $scope.buyerEmail = server.userInfo.Email;
        $scope.heading = "Your WishList";
        $scope.isSaveButtonDisabled = false;
        $scope.allOrderItems = [];

        var requestDataForBuyer = {
            key : $scope.buyerEmail,
            value : "SM-CTL"
        };

        catalogService.GetOrdersForBuyer([$scope.buyerEmail],"Created","SM-CTL").then(function (res) {
            if(res.length === 0){
                alert("There is no item in your wishlist.");
                return;
            }
            $scope.existingOrdersInDb = res;
            var variants = [];
            var validItems = [];

            for(var i= 0;i<$scope.existingOrdersInDb.length;i++){
                validItems = $scope.existingOrdersInDb[i].Items.filter(i=>i.IsDeleted === false);
                for(var j=0;j<validItems.length;j++){
                    //$scope.allOrderItems.push(validItems[j]);
                    variants.push(validItems[j].Sku);
                }
            }

            catalogService.GetProductVariantsByCodes(variants).then(function (res) {
                for(var j=0;j<validItems.length;j++){
                    var variantImage = res.filter(r=>r.code.toLowerCase() === validItems[j].Sku.toLowerCase())[0];
                    if(variantImage !== undefined && variantImage.images[0] !== null && (variantImage.images[0].publicUri !== null)){
                        $scope.allOrderItems.push({Sku : validItems[j].Sku,
                            Quantity : validItems[j].Quantity,OrderDate:validItems[j].OrderDate,
                            ItemCost:validItems[j].ItemCost,Image:variantImage.images[0].publicUri});
                    }
                    else
                        $scope.allOrderItems.push({Sku : validItems[j].Sku,
                            Quantity :validItems[j].Quantity,OrderDate:validItems[j].OrderDate,
                            ItemCost:validItems[j].ItemCost,Image:"https://riptide.blob.core.windows.net/thumbnails/noimage.jpg"});
                }
                if($scope.allOrderItems.length > 0)
                    $scope.wishListPage = true;
                else alert("There is no item in your wishlist.");

            },function (er) {
                logger.error("Could not get images. Error : "+er.message);
                $scope.allOrderItems.push({Sku : validItems[j].Sku,
                    Quantity :validItems[j].Quantity,OrderDate:validItems[j].OrderDate,
                    ItemCost:validItems[j].ItemCost,Image:"https://riptide.blob.core.windows.net/thumbnails/noimage.jpg"});

                if($scope.allOrderItems.length > 0)
                    $scope.wishListPage = true;
                else alert("There is no item in your wishlist.");

            });

         },function (er) {
            alert("An error occurred while getting wishlist items. Error : "+er.message);
         });


        catalogService.CheckIfBuyerExists(requestDataForBuyer).then(function (res) {
            $scope.buyerInfo = res;
        },function (er) {
         alert("Could not get buyer from db");
        });


        $scope.zoomImage= function(url){
            $window.open(url, "_blank", "left=250,top=30,status=no,height=600,width=800,toolbar=no,location=no,menubar=no,titlebar=no");
        };

        $scope.remove = function (code,id) {
            var existing = $scope.allOrderItems.filter(f=>f.Sku === code)[0];
            var index = $scope.allOrderItems.indexOf(existing);
            if(index===-1)
                return;

            var requestData = {key:"email",value:$scope.buyerEmail};
            catalogService.RemoveItemFromCart(requestData,"opencart",code).then(function (res) {
                if(res){
                    logger.success("Item Removed From Cart","Removed");
                    $scope.allOrderItems.splice(index,1);
                }
                else alert("Could not remove item. Error : "+er.message);
            },function (er) {
                alert("Could not remove item from cart.Error : "+er.message);
            })
        };
        
        
        $scope.saveOrder = function () {
            var orderLineItems  = [];
            for(var i = 0;i<$scope.allOrderItems.length;i++){
                orderLineItems.push({Sku:$scope.allOrderItems[i].Sku,Quantity:$scope.allOrderItems[i].Quantity,
                    ItemCost : {Value:$scope.allOrderItems[i].ItemCost.Value,Currency:$scope.allOrderItems[i].ItemCost.Currency}});
            }
            $scope.newOrder.items  = orderLineItems;
            $scope.newOrder.sellingAccountPrefix = "SM-CTL";
            $scope.newOrder.OrderId = "opencart";
            $scope.newOrder.Status = "Pending";
            if($scope.buyerInfo.Address.Name.length === 0){
                $scope.heading = "Buyer Details";
                $scope.buyerDetails = true;
                $scope.wishListPage = false;
            }

            else
            {
                var address = {
                    name: $scope.buyerInfo.Address.Name,
                    streetAddress : $scope.buyerInfo.Address.StreetAddress,
                    city : $scope.buyerInfo.Address.City,
                    country:$scope.buyerInfo.Address.Country,
                    zipCode:$scope.buyerInfo.Address.ZipCode,
                    phone : $scope.buyerInfo.Address.Phone
                };

                $scope.newOrder.buyer = $scope.buyerInfo;
                $scope.newOrder.ShippingAddress = address;

                catalogService.PostBuyerOrders($scope.newOrder).then(function (res) {
                    alert("Thanks !! Your order has been placed . Someone will contact you soon  . You can view your orders in Orders section" +
                        ".  If you have further questions , please feel free to contact us at : 9810831143 .");
                    $scope.buyerDetails = false;
                    $scope.wishListPage = false;
                    $scope.heading = "Your WishList";
                },function (er) {
                 alert("Could not save orders for buyer.Error : "+er);
                });
            }
        };
        
        $scope.submitBuyerDetails = function () {
            var address = {
                name: $scope.addressName,
                streetAddress : $scope.streetAddress,
                city : $scope.city,
                country:$scope.country,
                zipCode:$scope.zipCode,
                phone : $scope.buyerPhone
            };

            $scope.buyerInfo = {
                mobileNumber  : $scope.buyerPhone,
                emailId : $scope.buyerEmail,
                name : $scope.buyerName,
                address : address,
                sellingAccountPrefix : 'SM-CTL'
            };

            catalogService.SaveBuyerToDb($scope.buyerInfo).then(function (res) {
                $scope.newOrder.buyer = res;
                $scope.newOrder.ShippingAddress = address;

                catalogService.PostBuyerOrders($scope.newOrder,res.buyerId).then(function (res) {
                    alert("Thanks !! Your order has been placed.Someone will contact you soon.You can view these items in orders.");
                    $scope.buyerDetails = false;
                    $scope.wishListPage = false;
                    $scope.heading = "Your WishList";
                },function (er) {
                    alert("Could not save orders for buyer.Error : "+er.message);
                });

            },function (er) {
                alert("Could not save details.Please contact to admin.Error : "+er.message);
            })
        };

    }
}