'use strict';

app.factory('server', server);

server.$inject = ['$http', '$q', 'logger'];

function server($http, $q, logger){
    var serverFactory = {};
    serverFactory.userInfo = {} ;
    serverFactory.userWishList = [];

    serverFactory.get = function (baseUrl,action) {
        var deferred = $q.defer();

        $http.get(baseUrl + action).success(function (response, status, headers, config) {
                try{
                    response = JSON.resolveReferences(response);
                }catch (e)
                    {
                        alert(e.message);
                    }
                deferred.resolve(response);
            }
        ).error(function (err, status) {
                deferred.reject(err);
            }
        );
        return deferred.promise;
    };

    serverFactory.post = function (baseUrl,action,data) {
        var deferred = $q.defer();

        $http.post(baseUrl + action, data).success(function (response,status) {
            deferred.resolve(response);
        }).error(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    serverFactory.SaveBuyer = function (buyer) {
        var baseUrl = 'http://localhost/platform/';
        //var baseUrl = 'http://stompplatform-testing.azurewebsites.net/';
        var action = 'api/Direct/CreateBuyer';
        var deferred = $q.defer();

        $http.post(baseUrl + action, buyer).success(function (response,status) {
            deferred.resolve(response);
        }).error(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    return serverFactory;
}