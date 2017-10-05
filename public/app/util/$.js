
export default function $(selector, parent = window.document) {

    let selectorType = 'querySelectorAll';

    if (selector.indexOf('#') === 0) {
        selectorType = 'getElementById';
        selector = selector.substr(1, selector.length);
    }

    return parent[selectorType](selector);
};