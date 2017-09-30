
export default function remove(arr, value) {
    let i = arr.indexOf(value);
    if (i) { arr.splice(i, 1); }
}