import Register from '../registry';
import Radio from '../service/radio';
import Focus from '../service/focus';

Register.directive('focusOn', () => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            let eventName = 'focusOn:' + attrs.focusOn;
            let destroy = Radio.register(eventName, () => {
                element[0].focus();
            });
            element.on('$destroy', () => {
                destroy();
            });
        }
    }
});