
export default function test(subject, rules) {
    let pass = true;
    Object.entries(rules).forEach(([prop, val]) => {
        if (subject[prop] !== val) { pass = false; }
    });
    return pass;
}