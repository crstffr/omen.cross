
import template from './control.route.html!text';
import {ControlRouteCtrl} from './control.route.ctrl';

export let ControlRoute = {
    url: '/control',
    name: 'control',
    template: template,
    controller: ControlRouteCtrl
};