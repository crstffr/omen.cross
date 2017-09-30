import Register from '../registry';

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

    getInputOptions() {
        return this.inputs.map((val, key) => {
            if (!val) { return false; }
            return {
                value: key + 1,
                label: 'Input ' + (key + 1)
            }
        }).filter(Boolean);
    }

    getOutputOptions() {
        return this.outputs.map((val, key) => {
            if (!val) { return false; }
            return {
                value: key + 1,
                label: 'Output ' + (key + 1)
            }
        }).filter(Boolean);
    }

}

let inst = new IOService();
Register.value('IO', inst);
export default inst;