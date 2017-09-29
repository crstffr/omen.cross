import Register from '../../registry';
import template from './control.view.html!text';
import controller from './control.view.ctrl';

Register.view('control', {
    $url: '/control',
    template: template,
    controller: controller
});