import Register from '../../../registry';
import template from './group.html!text';
import controller from './group.ctrl';

Register.component('deviceGroup', {
    template: template,
    controller: controller,
    bindings: {
        group: '<',
        deleteGroup: '&'
    }
});