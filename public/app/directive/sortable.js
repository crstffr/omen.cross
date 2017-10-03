import Register from '../registry';
import {Sortable} from 'draggable';
import $ from '../util/$';

Register.directive('sortableContainer', () => {
    return {
        restrict: 'E',
        link: (scope, element, attrs, ctrl) => {

            element = element[0];
            let item = '[sortable-item]';
            let handle = '[sortable-handle]';

            let opts = {
                draggable: item,
                handle: handle,
                delay: 200
            };

            let sortable = new Sortable([element], opts)
                .on('sortable:stop', () => {

                    scope.order = [];

                    element.querySelectorAll(item).forEach(elem => {
                        scope.order.push(elem.getAttribute('sortable-id'));
                    });

                    scope.$eval(attrs.onSort);
                });

            scope.$on('$destroy', () => {
                sortable.destroy();
            })

        }
    }
});