var os = require('os');

var isWin = os.platform() === 'win32';
var isMac = os.platform() === 'darwin';

module.exports = {

    env: {
        isWin: isWin,
        isMac: isMac
    },

    app: {
        icon: {
            mac: {
                tray: './desktop/icons/js-16.png',
                wind: './desktop/icons/js-48.png'
            },
            win: {
                tray: './desktop/icons/js.ico',
                wind: './desktop/icons/js.ico'
            }
        }
    },

    server: require('../server/settings')

};