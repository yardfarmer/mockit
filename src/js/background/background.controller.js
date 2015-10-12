/**
 * Created by yakuncyk on 15/9/25.
 */
(function() {
    'use strict';

    angular
        .module('app.background')
        .controller('BackgroundController', BackgroundController);

    BackgroundController.$inject = ['$window', 'backgroundService'];

    function BackgroundController($window, backgroundService) {
        backgroundService.init();
        $window.backgroundService = backgroundService;
    }
})();