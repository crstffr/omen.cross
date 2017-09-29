import Register from '../../registry';
import template from './index.view.html!text';
import controller from './index.view.ctrl';

Register.view('index', {
    $url: '',
    template: template,
    controller: controller
});