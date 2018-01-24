const tessel = require('tessel');

const PIN_CE = 1;
const PIN_UPDATE = 0;
const PIN_RESET = 5;
const PIN_SERPAR = 6;

export class SpiConnection {

    port = null;
    reset = false;
    connection = null;

    pin = {
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

        console.log("Connection options", options);

        this.port = tessel.port[options.port];
        this.pin.ce = this.port.pin[PIN_CE];
        this.pin.update = this.port.pin[PIN_UPDATE];
        this.pin.reset = this.port.pin[PIN_RESET];
        this.pin.serpar = this.port.pin[PIN_SERPAR];

        this.setPinDefaults();

        this.connection = new this.port.SPI({
            clockSpeed: options.clockSpeed,
            cpol: options.cpol
        });
    }

    setPinDefaults() {
        this.pin.ce.high();		// CE (enabled low)
        this.pin.reset.high();	// RESET (enabled low)
        this.pin.update.high();	// UPDATE (enabled low)
        this.pin.serpar.low();	// SER/PAR (low for SERIAL, high for PARALLEL)
    }

    loadDefaultConfig() {
        this.sendData(DEFAULT_SWITCH_CONFIG);
    }

    /**
     *
     * @param {Buffer} buffer
     */
    sendData(buffer) {
        this.pin.ce.low();
        this.connection.transfer(this.convertData(buffer), (error, rx) => {
            this.pin.update.low();
            this.pin.update.high();
            this.pin.ce.high();
        });
    }



    /**
     * Disables outputs 'true'/1 ... Enables outputs 'false'/0
     * Must be set to false to configure the switch.
     *
     * @param {Boolean} hold
     */
    outputStandby(hold) {
        this.pin.reset.output(!hold);
        this.reset = hold;
    }


}