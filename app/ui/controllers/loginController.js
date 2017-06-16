/**
 * Created by Himanshu on 4/17/2017.
 */
'use strict';
app.controller('loginController',['$scope','$state','server','logger', function ($scope,$state,server,logger) {
    $scope.signInForm=true;
    $scope.logoClass=true;
    
    if(gapi.auth2===undefined)
    {
        gapi.load('auth2',function () {
            $scope.auth=gapi.auth2.init({
                client_id: '307128262312-47cj4vevso8sopthjs0jt1psaf0ecfg4.apps.googleusercontent.com',
                scope: 'email',
                fetch_basic_profile: true
            });

        });
    }
    else {
        $scope.auth=gapi.auth2.getAuthInstance();
    }

    $scope.login=function () {
        if($scope.auth===undefined){
            if(gapi.auth2===undefined){
                return;
            }
            $scope.auth=gapi.auth2.getAuthInstance();
            if($scope.auth===undefined){
                /*logger.error('Please Refresh The Page Before Logging in');*/
                return;
            }
        }

        var success=function (response) {
            $scope.id_token = response.Zi.id_token;
            $scope.additionalInfo = response.w3;
            $scope.additionalData = {
                Photo: $scope.additionalInfo.Paa,
                Email: $scope.additionalInfo.U3,
                token: $scope.id_token
            };
            if($scope.additionalData.Photo === undefined) {
                $scope.additionalData.Photo = 'https://riptide.blob.core.windows.net/thumbnails/noimage.jpg';
            }
            server.userInfo = $scope.additionalData;

            var buyerInfo = {
                emailId : $scope.additionalInfo.U3,
                sellingAccountPrefix : 'SM-CTL',
                address : {
                    name: '',
                    streetAddress : '',
                    city : '',
                    country:'',
                    zipCode:'',
                    phone : ''
                }};

            server.SaveUser(buyerInfo).then(function (res) {
            },function (er) {
                logger.error("Error : " + er.message);
            });

            $state.go('catalogClient.keyword');
        };
        var error =function (e) {
            alert(e.error);
        };
        $scope.auth.signIn().then(success, error);
    };
    
}]);
