/**
 * Created by yakuncyk on 15/8/20.
 */

(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('appService', coreService);

    function coreService() {
        var service = {
            log: log
        };

        return service;

        function log() {
            var args = [].slice.apply(arguments);
            console.log('%c' + arguments[0] +': ', 'color: green', [].join.call(args.slice(1), ' '));
        }
    }
})();