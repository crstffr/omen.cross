import Register from '../registry';

/*
// This doesn't work unfortunately
import angular from 'angular';

let $injector = angular.injector(['ng']);
export let $sce = $injector.get('$sce');
export let $compile = $injector.get('$compile');
export let $timeout = $injector.get('$timeout');
export let $rootScope = $injector.get('$rootScope');
*/

let providers = [
    '$sce',
    '$http',
    '$filter',
    '$compile',
    '$timeout',
    '$interval',
    '$rootScope'
];

/**
 * A better (IMO) way of working with Angular providers.
 */
class ImportNG {

    ready;
    isReady;
    props = {};

    constructor () {
        this.ready = new Promise((resolve) => {
            this.isReady = resolve;
        });
    }

    whenReady() {
        return this.ready;
    }

    get(what) {
        if (typeof what === 'string') {
            return this.getOne(what);
        }
        if (typeof what === 'object' && what.length > 0) {
            return this.getMultiple(what);
        }
        return Promise.resolve();
    }

    getMultiple(props) {
        return Promise.all(props.map((prop) => {
            return this.getOne(prop);
        })).then(results => {
            let resp = {};
            results.forEach((result, i) => {
                resp[props[i]] = result;
            });
            return resp;
        });
    }

    getOne(prop) {
        return this.whenReady().then(() => {
            if (prop === '$scope') {
                return (vals) => {
                    let $scope = this.props['$rootScope'].$new();
                    Object.assign($scope, vals);
                    return $scope;
                }
            }
            return this.props[prop];
        });
    }

}

let importNg = new ImportNG();

Register.service('ImportNG', (...args) => {
    providers.forEach((prop, i) => {
        importNg.props[prop] = args[i];
    });
    importNg.isReady();
}, providers);

export default importNg;