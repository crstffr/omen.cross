import Register from '../../registry';
import template from './setup.view.html!text';
import controller from './setup.view.ctrl';

Register.view('setup', {
    $url: '/setup',
    template: template,
    controller: controller
});