import Register from '../registry';
import {Sortable} from 'draggable';
import $ from '../util/$';

Register.directive('sortableContainer', ($parse) => {
    return {
        restrict: 'E',
        link: (scope, element, attrs, ctrl) => {

            element = element[0];
            let item = '[sortable-item]';
            let handle = '[sortable-handle]';
            let containers = [element];

            let opts = {
                draggable: item,
                handle: handle,
                delay: 200
            };

            if (attrs.sortableAppendMirror === 'self') {
                opts.appendTo = element;
            }

            if (attrs.sortableConnect) {
                let others = [];
                try {
                    others = $parse(attrs.sortableConnect)(scope);
                    others.forEach(selector => {
                        containers.push($(selector));
                    })
                } catch(e) {}
            }

            let sortable = new Sortable(containers, opts)
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
}, ['$parse']);