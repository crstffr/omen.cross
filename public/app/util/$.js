
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

export function childOf(parent, nodeName) {
    let result = false;
    childrenOf(parent).forEach(child => {
        result = (child.nodeName === nodeName.toUpperCase()) ? child : result;
    });
    return result;
}

export default select;