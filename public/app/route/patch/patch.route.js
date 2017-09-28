
import template from './patch.route.html!text';
import {PatchRouteCtrl} from './patch.route.ctrl';

export let PatchRoute = {
    url: '/patch',
    name: 'patch',
    template: template,
    controller: PatchRouteCtrl
};