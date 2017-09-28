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
                'lodash',
                'angular',
                'angular-ui-router',
            ]
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
            exclude: ['libs', 'style', 'socket'],
            items: {
                'app/app.module': 'app'
            }
        }
    }
};