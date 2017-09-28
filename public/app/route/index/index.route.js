
import template from './index.route.html!text';
import {IndexRouteCtrl} from './index.route.ctrl';

export let IndexRoute = {
    url: '',
    name: 'index',
    template: template,
    controller: IndexRouteCtrl
};