
import template from './library.route.html!text';
import {LibraryRouteCtrl} from './library.route.ctrl';

export let LibraryRoute = {
    url: '/library',
    name: 'library',
    template: template,
    controller: LibraryRouteCtrl
};