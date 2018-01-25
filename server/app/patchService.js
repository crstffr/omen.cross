import app from './app';
import equal from 'deep-equal';
import hardware from '../hardware/device';

const INPUT_CORRECTION_MAP = {
    1: 12,
    2: 13,
    3: 14,
    4: 15,
    5: 8,
    6: 9,
    7: 10,
    8: 11,
    9: 4,
    10: 5,
    11: 6,
    12: 7,
    13: 0,
    14: 1,
    15: 2,
    16: 3
};

const OUTPUT_CORRECTION_MAP = {
    1: 3,
    2: 2,
    3: 1,
    4: 0,
    5: 7,
    6: 6,
    7: 5,
    8: 4,
    9: 11,
    10: 10,
    11: 9,
    12: 8,
    13: 15,
    14: 14,
    15: 13,
    16: 12
};

class PatchService {

    deviceData;
    devices = {};
    patches = {};

    constructor () {
        app.on('ready', () => {
            this.deviceData = app.service('devices');
            this.update();
        });
    }

    update() {
        this.deviceData.find({}, (err, devices) => {

            let patches = {};
            this.devices = {};

            devices.forEach((device, index) => {
                this.devices[device._id] = device;
            });

            devices.forEach((device, index) => {

                if (!device.patchedTo || device.patchedTo === 'root') { return; }

                let input = Number(this.devices[device.patchedTo].input);

                if (!patches[input]) {
                    patches[input] = [];
                }

                if (device.output) {
                    patches[input].push(Number(device.output));
                }

            });

            if (!equal(patches, this.patches)) {
                this.patches = patches;
                this.connectPatches();
            }

        });
    }

    connectPatches() {
        hardware.resetPatches();

        Object.entries(this.patches).forEach(([input, outputs]) => {
            outputs.forEach(output => {

                // This is required because the way the hardware is setup
                // is wonky and the inputs and outputs are out of order.

                input = INPUT_CORRECTION_MAP[input];
                output = OUTPUT_CORRECTION_MAP[output];

                hardware.patch(output, input, 1);
            });
        });

        hardware.exec();
    }

}

export default new PatchService();
