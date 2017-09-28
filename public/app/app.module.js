import angular from 'angular';
import 'angular-ui-router';
import '../style/style';

import {AppController} from './app.ctrl';
import {AppService} from './app.service';
import {AppConfig} from './app.config';
import {Routes} from './route/routes';

let appDeps = [
    'ui.router'
];

let app = angular
    .module('app.module', appDeps)
    .service('AppService', AppService)
    .controller('AppController', AppController)
    .config(AppConfig);

Routes.forEach(route => {
    route.componentName = 'route.' + route.name;
    app.component(route.componentName, route);
});

export let name = app.name;
