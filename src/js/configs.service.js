/**
 * Created by yakuncyk on 15/8/25.
 */

var Configs = (function () {
    var _configs = {
        app: {
            url: 'src/index.html'
        },
        storage: {
            prefix: '_hammer_mockit_'
        }
    };

    return {
        get: function (group, key) {
            if (typeof _configs[group] === 'undefined') {
                throw "No group config '" + group + "'  available!";
            }

            if (typeof key === 'undefined') {
                return _configs[group];
            }

            if (typeof _configs[group][key] === 'undefined') {
                throw "No config '" + key + "'  available in group '" + group + "'!";
            }

            return _configs[group][key];
        }
    };
})();