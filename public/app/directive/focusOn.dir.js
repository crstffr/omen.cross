import {RadioService} from '../service/radio.service';

function FocusOn() {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            let destroy = RadioService.register(attrs.focusOn, () => {
                element[0].focus();
            });
            element.on('$destroy', () => {
                destroy();
            });
        }
    }
}

FocusOn.$name = 'focusOn';
export default FocusOn;