import angular from 'angular';
import 'angular-ui-router';
import '../style/style';

import {
    Routes,
    Services,
    Components,
    Directives
} from './app.registry';

export let app = angular.module('app', ['ui.router']);

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
 * Register the Directives
 */
Directives.forEach(directive => {
    app.directive(directive.$name, directive);
});


/**
 * Application Controller
 *
 * @type {function}
 */
AppController.$inject = ['$timeout', 'SocketService', 'DataService'];

function AppController($timeout, SocketService, DataService) {

    // Force Angular to redraw when something happens it doesn't know about

    SocketService.onAnything((what) => {
        $timeout(() => {});
    });

    DataService.onEvent.register((what) => {
        $timeout(() => {});
    });

}

app.controller('AppController', AppController);