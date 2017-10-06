import equal from 'deep-equal';

export default function filter(collection, rules) {
    let output = [];

    Object.values(collection).forEach(item => {

        Object.entries(rules).forEach(([prop, value]) => {

            if (typeof item[prop] === 'undefined') { return; }

            let pass = false;

            switch (typeof value) {
                case 'boolean':
                    pass = item[prop] === value;
                    break;
                case 'number':
                case 'string':
                    pass = Boolean(String(item[prop]) === String(value));
                    break;
                case 'object':
                    pass = equal(item[prop], value);
                    break;
            }

            if (pass) {
                output.push(item);
            }
        });
    });

    return output;
}