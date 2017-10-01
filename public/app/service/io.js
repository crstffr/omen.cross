import Register from '../registry';

/**
 * Keep track of the Inputs/Outputs that are currently used and
 * what is available. Helper methods for rendering select options.
 *
 * @Singleton
 */
class IOService {

    inputs = [];
    outputs = [];

    constructor() {
        this.reset();
    }

    reset() {
        this.inputs = new Array(16).fill(1);
        this.outputs = new Array(16).fill(1);
    }

    useInput(i) {
        if (!i) { return; }
        this.inputs[i - 1] = 0;
    }

    freeInput(i) {
        if (!i) { return; }
        this.inputs[i - 1] = 1;
    }

    useOutput(o) {
        if (!o) { return; }
        this.outputs[o - 1] = 0;
    }

    freeOutput(o) {
        if (!o) { return; }
        this.outputs[o - 1] = 1;
    }

    registerDevices(devices) {
        devices.forEach(device => {
            this.registerDevice(device);
        });
    }

    registerDevice(device) {
        this.useInput(device.input);
        this.useOutput(device.output);
    }

    deregisterDevice(device) {
        this.freeInput(device.input);
        this.freeOutput(device.output);
    }

    getInputOptions(current) {
        current = Number(current);
        let options = [{value: '', label: 'No Input'}];
        this.inputs.forEach((val, key) => {
            if (current !== ++key && val === 0) { return false; }
            options.push({value: key, label: 'Input ' + key});
        });
        return options;
    }

    getOutputOptions(current) {
        current = Number(current);
        let options = [{value: '', label: 'No Output'}];
        this.outputs.forEach((val, key) => {
            if (current !== ++key && val === 0) { return false; }
            options.push({value: key, label: 'Output ' + key});
        });
        return options;
    }

}

let inst = new IOService();
Register.value('IO', inst);
export default inst;