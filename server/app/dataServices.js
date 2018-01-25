
let NeDB = require('nedb');
let service = require('feathers-nedb');

let tables = {
    groups: {
        autoload: true,
        filename: './database/groups.db'
    },
    devices: {
        autoload: true,
        filename: './database/devices.db'
    },
    library: {
        autoload: true,
        filename: './database/library.db'
    }
};

let services = {};

Object.keys(tables).forEach(name => {
    services[name] = service({
        Model: new NeDB(tables[name])
    });
});

module.exports = services;