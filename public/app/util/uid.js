export default function uid() {
    // Quick uid Solution taken from: http://stackoverflow.com/a/6248722
    // Updated to return "unique" id's of 6 characters
    return String(('000000' + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6));
}