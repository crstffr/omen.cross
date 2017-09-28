
import template from './setup.route.html!text';
import {SetupRouteCtrl} from './setup.route.ctrl';

export let SetupRoute = {
    url: '/setup',
    name: 'setup',
    template: template,
    controller: SetupRouteCtrl
};