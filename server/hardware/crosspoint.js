
export class Crosspoint {

    /**
     * Convert 16 hex port configurations to 10 commands for transmitting to crosspoint
     *
     * @param {Buffer} buffer
     * @returns {Buffer}
     */
    convertData(buffer) {

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