import equal from 'deep-equal';

export default function filter(collection, rules) {
    let output = [];

    Object.values(collection).forEach(item => {

        let pass = null;

        Object.entries(rules).forEach(([prop, value]) => {

            if (pass === false) { return; }
            if (typeof item[prop] === 'undefined') { return; }

            switch (typeof value) {
                case 'boolean':
                    pass = (item[prop] === value);
                    break;
                case 'number':
                case 'string':
                    pass = Boolean(String(item[prop]) === String(value));
                    break;
                case 'object':
                    pass = equal(item[prop], value);
                    break;
            }

        });

        if (pass === true) {
            output.push(item);
        }
    });

    return output;
}