let tessel;

try {
    tessel = require('tessel');
} catch(e) {
    tessel = require('./tessel');
}

const PIN_CE = 1;
const PIN_RESET = 5;
const PIN_UPDATE = 0;
const PIN_SERPAR = 6;

export class SpiConnection {

    port = null;
    reset = false;
    connection = null;

    pins = {
        ce: null,
        reset: null,
        update: null,
        serpar: null
    };

    /**
     *
     * @param {Object} options
     * @param {String} options.port         - tessel port letter "A" or "B"
     * @param {Integer} options.cpol        - clock polarity: 0 = reg, 1 = inverted
     * @param {Integer} options.clockSpeed  - defaults to 500000 (500K);
     */
    constructor (options) {

        options = Object.assign({
            cpol: 0,
            port: 'A',
            clockSpeed: 500000
        }, options || {});

        let port = tessel.port[options.port];

        this.pins.ce = port.pin[PIN_CE];
        this.pins.reset = port.pin[PIN_RESET];
        this.pins.update = port.pin[PIN_UPDATE];
        this.pins.serpar = port.pin[PIN_SERPAR];

        console.log("Connection options", options);

        this.setPinDefaults();

        this.connection = new port.SPI({
            clockSpeed: options.clockSpeed,
            cpol: options.cpol
        });
    }

    setPinDefaults() {
        this.pins.ce.high();		// CE (enabled low)
        this.pins.reset.high();	    // RESET (enabled low)
        this.pins.update.high();	// UPDATE (enabled low)
        this.pins.serpar.low();	    // SER/PAR (low for SERIAL, high for PARALLEL)
    }

    /**
     *
     * @param {Buffer} buffer
     */
    sendData(buffer) {
        this.pins.ce.low();
        this.connection.transfer(buffer, (error, rx) => {
            if (error) {
                console.log('ERROR in SpiConnection.sendData()', error);
            }
            this.pins.update.low();
            this.pins.update.high();
            this.pins.ce.high();
        });
    }

    /**
     * Disables outputs 'true'/1 ... Enables outputs 'false'/0
     * Must be set to false to configure the switch.
     *
     * @param {Boolean} hold
     */
    outputStandby(hold) {
        this.pins.reset.output(!hold);
        this.reset = hold;
    }

}