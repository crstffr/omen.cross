module.exports = {

    baseURL: 'public',

    dest: 'bundles',
    file: 'bundles.js',
    
    bust: true,

    builder: {
        sfx: false,
        minify: true,
        mangle: true,
        sourceMaps: true,
        separateCSS: false,
        lowResSourceMaps: true
    },

    bundles: {
        libs: {
            items: [
                'angular',
                'dragula',
                'draggable'
            ]
        },
        modules: {
            exclude: ['libs'],
            items: ['angular-ui-router']
        },
        style: {
            combine: true,
            items: [
                'fontawesome/css/font-awesome.css!',
                'style/css/vendor.min.css!'
            ]
        },
        socket: {
            combine: true,
            items: [
                'socketio',
                'socketio-wildcard',
                'vendor/feathers'
            ]
        },
        app: {
            exclude: ['libs', 'modules', 'style', 'socket'],
            items: {
                'app/module': 'app'
            }
        }
    }
};