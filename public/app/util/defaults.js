export default function defaults(...args) {
    let result = {};
    args.forEach((data, i) => {
        data = data || {};
        Object.entries(data).forEach(([prop, val]) => {
            if (!result[prop]) {
                result[prop] = val;
            }
        });
    });
    return result;
}