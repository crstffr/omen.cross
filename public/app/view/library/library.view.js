import Register from '../../registry';
import template from './library.view.html!text';
import controller from './library.view.ctrl';

Register.view('library', {
    $url: '/library',
    template: template,
    controller: controller
});