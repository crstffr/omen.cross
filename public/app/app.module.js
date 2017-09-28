import angular from 'angular';
import 'angular-ui-router';
import '../style/style';

import Routes from './app.routes';
import Services from './app.services';
import Components from './app.components';

let appDeps = ['ui.router'];

export let app = angular.module('app', appDeps);

/**
 * Application Config Phase
 *
 * @type {function}
 */
AppConfig.$inject = ['$stateProvider'];

function AppConfig($stateProvider) {
    Routes.forEach((route) => {
        $stateProvider.state({
            url: route.$url,
            name: route.$name,
            component: route.$componentName
        });
    });
}

app.config(AppConfig);

/**
 * Register the Routes
 */
Routes.forEach(route => {
    route.$componentName = route.$name + 'View';
    app.component(route.$componentName, route);
});

/**
 * Register the Services
 */
Services.forEach(service => {
    app.value(service.$name, service);
});

/**
 * Register the Components
 */
Components.forEach(component => {
    app.component(component.$name, component);
});


/**
 * Application Controller
 *
 * @type {function}
 */
AppController.$inject = ['$timeout', 'SocketService', 'DataService'];

function AppController($timeout, SocketService, DataService) {

    // Force Angular redraw on any socket activity
    SocketService.onAnything((what) => {
        console.log('socket event', what);
        $timeout(() => {});
    });

    DataService.onEvent.register((what) => {
        console.log('data event', what);
        $timeout(() => {});
    })

}

app.controller('AppController', AppController);