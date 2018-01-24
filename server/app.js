var path = require('path');
var cors = require('cors');
var feathers = require('feathers');
var nedb = require('feathers-nedb');
var rest = require('feathers-rest');
var hooks = require('feathers-hooks');
var favicon = require('serve-favicon');
var compress = require('compression');
var bodyParser = require('body-parser');
var socketio = require('feathers-socketio');
var error = require('feathers-errors/handler');

var publicPath = path.resolve(__dirname, '../public') + '/';

module.exports = feathers()
    .use(compress())
    .options('*', cors())
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(favicon(path.join(publicPath, 'favicon.ico')))
    .use('/', feathers.static(publicPath))
    .use(error())
    .configure(socketio())
    .configure(hooks())
    .configure(rest());