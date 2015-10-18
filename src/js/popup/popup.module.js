(function() {
    'use strict';

    angular
        .module('app.popup', [
            'app.core',  'ui.codemirror', 'ui.grid', 'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.cellNav'
        ]);
})();