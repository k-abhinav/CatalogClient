/**
 * Created by Neetu on 5/17/2017.
 */

angular.module('catalog.keyword')
    .directive('previousOrders',PreviousOrders);

function PreviousOrders() {

    var directive={
        restrict:'E',
        templateUrl:'module/keyWords/orders.html',
        controller:orderCtrl,
        scope:{}
    };

    orderCtrl.$inject=['$scope','catalogService','server','logger','uiGridConstants'];
    return directive;

    function orderCtrl($scope,catalogService,server,logger,uiGridConstants) {
        var email = server.userInfo.Email;
        var columns = [{name:'Sku',displayName : 'Item Code'},{name:'Quantity',displayName : 'Quantity'},
            {name:'Status',displayName : 'Status'},
            {name:'OrderDate',displayName : 'OrderDate'},{name:'Price',displayName : 'Price (Per Unit)'},
            {name:'Image',cellTemplate:'<div id="img"><a href="{{row.entity.Image}}" target="_blank"><img src="{{COL_FIELD}}" style="vertical-align: bottom;max-height:100%;max-width:100%;" align="middle"/></a></div>'}
        ];

        $scope.gridOptions = {
            enableFiltering: true,
            enableColumnResizing: true,
            enableSorting: true,
            columnDefs:  columns,
            showGroupPanel: true,
            enableGridMenu:true,
            multiSelect : false,
            paginationPageSize : 10,
            importerDataAddCallback: function( grid, newObjects ) {
                $scope.griddata =  newObjects ;
            },
            exporterCsvColumnSeparator:',',
            exporterCsvFilename:'data.csv',
            rowHeight:60,
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row, e) {
                    publishService.publish($scope.event, row.entity);
                });
                $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                    $scope.pagechanged({pagesize:pageSize, pagenumber:newPage});
                });
                $scope.selectedRows = function(){
                    $scope.gridApi.selection.getSelectedRows();
                };

                angular.element(document.getElementsByClassName('home-grid')[0]).css('height', '500px');
            }
        };

        var variants = [];
        $scope.allOrderItems = [];
        var requestData = [email];

        catalogService.GetOrdersForBuyer(requestData,"SM-CTL","all").then(function (res) {
            if(res.length > 0){
                var confirmedOrders = res.filter(f=>f.Status.toLowerCase() !== "created");
                if(confirmedOrders.length === 0){
                    alert("There is no previous orders.");
                    $scope.allOrdersPage = false;
                    return;
                }
                for(var i=0;i<confirmedOrders.length;i++){
                    for(var j=0;j<confirmedOrders[i].Items.length;j++){
                        variants.push(confirmedOrders[i].Items[j].Sku);
                    }
                }
                catalogService.GetProductVariantsByCodes(variants).then(function (res) {
                    for(var i=0;i<confirmedOrders.length;i++){
                        for(var j=0;j<confirmedOrders[i].Items.length;j++){
                             var variantImage = res.filter(r=>r.code.toLowerCase() === confirmedOrders[i].Items[j].Sku.toLowerCase())[0];
                             if(variantImage !== undefined && variantImage.images[0] !== null && (variantImage.images[0].publicUri !== null))
                                 $scope.allOrderItems.push({Status : confirmedOrders[i].Status,Sku : confirmedOrders[i].Items[j].Sku,
                                 Quantity : confirmedOrders[i].Items[j].Quantity,OrderDate:confirmedOrders[i].Items[j].OrderDate,
                                 Price:confirmedOrders[i].Items[j].ItemCost.Value,Image:variantImage.images[0].publicUri});

                             else
                                 $scope.allOrderItems.push({Status : confirmedOrders[i].Status,Sku : confirmedOrders[i].Items[j].Sku,
                                 Quantity : confirmedOrders[i].Items[j].Quantity,OrderDate:confirmedOrders[i].Items[j].OrderDate,
                                 Price:confirmedOrders[i].Items[j].ItemCost.Value,Image:"https://riptide.blob.core.windows.net/thumbnails/noimage.jpg"});
                        }
                    }
                    $scope.gridOptions.data = $scope.allOrderItems;
                    $scope.allOrdersPage = true;
                },function (er) {
                    alert("Could not get image.Error : " + er.message);
                });

            }
            else alert("There is no previous orders.");
        });

    }
}

