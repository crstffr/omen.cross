
export function select(selector, parent = window.document) {

    let query = 'querySelectorAll';

    if (selector.indexOf('#') === 0) {
        query = 'getElementById';
        selector = selector.substr(1, selector.length);
    }

    return parent[query](selector);
}

export function childrenOf(element) {
    return Array.from(element.children || []) || [];
}

export function specificChildOf(parent, nodeName) {
    return childrenOf(parent).reduce((result, val, i) => {
        return (val.nodeName === nodeName.toUpperCase()) ? val : result;
    });
}

export default select;