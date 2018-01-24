import angular from 'angular';
import uid from '../../../util/uid';
import Ng from '../../../service/angular';
import Focus from '../../../service/focus';
import redraw from '../../../service/redraw';
import defaults from '../../../util/defaults';
import Modals from '../../../service/modals';
import template from './message-modal.html!text';

let $document = angular.element(document);
let $body = angular.element(document.body);

export default class Modal {

    id = '';
    ctrl = {};
    elem = {};
    scope = {};
    delay = false;
    closeable = false;
    isReady;
    ready;

    constructor (opts) {

        this.id = uid();
        this.text = opts.text || {};
        this.ctrl = opts.controller || {};
        this.tmpl = opts.template || template;

        this.delay = opts.delay || false;
        this.closeable = opts.closeable || false;

        Modals.register(this);

        this.ready = new Promise((resolve) => {
            this.isReady = resolve;
        });

        Ng.get(['$compile', '$scope', '$sce']).then(({$compile, $scope, $sce}) => {

            let trust = $sce.trustAsHtml;

            this.ctrl = defaults(this.ctrl, {
                id: this.id,
                text: this.text,
                closeable: this.closeable
            });

            console.log(this.ctrl);

            this.ctrl.text = defaults(this.ctrl.text, opts.text, {
                title: 'Message',
                confirm: 'Okay',
                body: 'This is the default modal message',
            });

            this.ctrl.text.body = trust(this.ctrl.text.body);
            this.ctrl.text.title = trust(this.ctrl.text.title);

            this.scope = $scope({
                $ctrl: this.ctrl,
                confirm: () => {
                    if (this.closeable) {
                        this.ctrl.confirm();
                        this.destroy();
                    }
                }
            });

            this.escHandler = (e) => {
                if (this.closeable) {
                    if (e.keyCode === 27) {
                        this.scope.confirm();
                        this.destroy();
                    }
                }
            };

            let html = $compile(this.tmpl)(this.scope)[0].outerHTML;
            this.elem = $compile(html)(this.scope);
            $body.append(this.elem);
            this.isReady();

            if (!opts.delay) {
                this.open();
            }

        });

    }

    whenReady () {
        return this.ready;
    }

    open () {
        return this.whenReady().then(() => {
            redraw(() => {
                $body.addClass('has-open-modal');
                this.elem.addClass('is-active');
                Focus('modal-okay-btn', this.id);
                $body.on('keydown', this.escHandler);
            });
        });
    }

    close () {
        return this.whenReady().then(() => {
            redraw(() => {
                $body.removeClass('has-open-modal');
                this.elem.removeClass('is-active');
                $body.off('keydown', this.escHandler);
            });
        });
    }

    destroy () {
        return this.close().then(() => {
            if (this.scope) {
                this.scope.$destroy();
                delete this['ctrl'];
                delete this['scope'];
                this.elem.remove();
                delete this['element'];
                Modals.remove(this.id);
            }
        });
    }

}
