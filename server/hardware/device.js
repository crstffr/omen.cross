import {SpiConnection} from './connection';
import {Crosspoint} from './crosspoint';

const ARRAY_SIZE = 16;
const DEVICE_PORT = 'B';
const CLOCK_SPEED = 500000;

class Device {

    patchData;
    connection;
    crosspoint;

    constructor () {

        this.crosspoint = new Crosspoint();

        this.patchData = new Buffer.allocUnsafe(ARRAY_SIZE);

        this.connection = new SpiConnection({
            port: DEVICE_PORT,
            clockSpeed: CLOCK_SPEED,
            cpol: 1, // clock-polarity: 1 for inverse (negative edge trigger);
        });

        this.resetPatches();
        this.exec();

    }

    resetPatches() {
        for (let i = 0; i < ARRAY_SIZE; i++) {
            this.patch(i, i, 0); // 0 = disconnected
        }
    }

    sendData(buffer) {
        let converted = this.crosspoint.convertData(buffer);
        this.connection.sendData(converted);
    }

    patch(output, input, connect) {
        if (connect === 1) {
            console.log('patch', output, input, connect);
        }
        input = input | (connect * 0x10);
        this.patchData[output] = input;
    }

    exec() {
        this.sendData(this.patchData);
    }

}

export default new Device();