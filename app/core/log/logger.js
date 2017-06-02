'use strict';
app.factory('logger', logger);
logger.$inject = ['$log'];

function logger($log){

    var loggerFactory;
    loggerFactory = {
        success: success,
        error: error,
        debug:debug
    };
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    return loggerFactory;
    function success(message,title){
        $log.info(message);
        toastr.success( message, title);
    }
    function error(message, title){
        $log.error(message);
        toastr.error(message, title );
    }
    function  debug(message, title){
        $log.debug(message);
        toastr.warning(message, title);
    }
}