// this is a mock for when running locally

let pins = Array(8).fill({
    low: () => {},
    high: () => {},
    output: () =>{}
});

let SPI = class {
    transfer(){}
};

module.exports = {
    port: {
        A: {pin: pins, SPI: SPI},
        B: {pin: pins, SPI: SPI}
    }
};