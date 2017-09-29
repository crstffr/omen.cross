import Register from '../../registry';
import template from './patch.view.html!text';
import controller from './patch.view.ctrl';

Register.view('patch', {
    $url: '/patch',
    template: template,
    controller: controller
});