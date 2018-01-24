
/**
 * All input ports are tied to the same coresponding output port
 * with the outputs disabled. eg: 0 to 0, 1 to 1 ... 15 to 15.
 *
 * @type {Buffer}
 */
const DEFAULT_SWITCH_CONFIG = Crosspoint.convertData(Buffer.from([
    0x0F,0x0E,0x0D,0x0C,
    0x0B,0x0A,0x09,0x08,
    0x07,0x06,0x05,0x04,
    0x03,0x02,0x01,0x00
]));

export class Crosspoint {

    edgeTrigger = 'negative';

    constructor() {

    }

    /**
     * Returns the default configuration buffer.
     *
     * @returns {Buffer}
     */
    getDefaultConfig() {
       return DEFAULT_SWITCH_CONFIG;
    }

    /**
     * Convert 16 hex port configurations to 10 commands for transmitting to crosspoint
     *
     * @param {Buffer} buffer
     * @returns {Buffer}
     */
    static convertData(buffer) {

        let temp = '';
        let output = new Buffer(10);

        for (let item of buffer.entries()) {
            // convert to binary *=& pad to 5 positions
            temp = temp + ('00000' + item[1].toString(2)).slice(-5);
        }

        let newArray = temp.match(/.{1,8}/g);

        for (let items of newArray.entries()) {
            output[items[0]] = parseInt(items[1], 2);
        }

        return output;
    }

}