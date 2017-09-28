
var _ = require('lodash');
var NeDB = require('nedb');
var service = require('feathers-nedb');

var services = {};

var tables = {
    groups: {
        autoload: true,
        filename: './database/groups.db'
    },
    devices: {
        autoload: true,
        filename: './database/devices.db'
    },
    patches: {
        autoload: true,
        filename: './database/patches.db'
    },
    current: {
        autoload: true,
        filename: './database/current.db'
    }
};

_.forEach(tables, function(options, name){
    services[name] = service({
        Model: new NeDB(options)
    });
});

module.exports = services;