import angular from 'angular';
import Register from '../../registry';
import Focus from '../../service/focus';
import defaults from '../../util/defaults';
import template from './modal.html!text';

let $document = angular.element(document);
let $body = angular.element(document.body);

Register.directive('modal', () => {
    return {
        scope: {
            text: '=?',
            cancel: '&',
            confirm: '&',
        },
        restrict: 'E',
        template: template,
        controllerAs: '$ctrl',
        bindToController: true,
        transclude: {
            title: 'modalTitle',
            body: 'modalBody'
        },
        controller: class {

            text;
            element;

            constructor () {}

            $onInit() {

                this.text = defaults(this.text, {
                    confirm: 'Yes, Continue',
                    cancel: 'No, Cancel'
                });

                this.escHandlerBound = this.escHandler.bind(this);
                $document.on('keydown', this.escHandlerBound);
                $body.addClass('has-open-modal');
            }

            $onDestroy() {
                $body.removeClass('has-open-modal');
                $document.off('keydown', this.escHandlerBound);
            }

            escHandler(evt) {
                if (evt.keyCode === 27) {
                    console.log('cancel it');
                    this.cancel();
                }
            }

        },
        link: (scope, element, attrs, ctrl) => {

            // Move the modal to the bottom of the body so that it
            // is away from everything and renders on it's own.

            $body.append(element);

            Focus('modal-okay-btn');

        }
    }
});



