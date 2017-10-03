import Register from '../../registry';
import template from './setup.view.html!text';
import Groups from '../../database/groups';
import Focus from '../../service/focus';
import {Sortable} from 'draggable';
import $ from '../../util/$';

Register.view('setup', {
    $url: '/setup',
    template: template,
    controller: class {

        groups = [];
        ready = false;
        showForm = false;

        constructor () {
            this.groups = Groups.data;
            Groups.fetchAll().then(() => this.ready = true);
        }

        $onInit() {

            let $container = $('draggable-container');
            let inst = new Sortable($container, {
                draggable: 'device-group',
                handle: '.drag-handle',
                delay: 200
            }).on('sortable:stop', (...args) => {
                console.log(args)
            });

        }

        openForm() {
            this.showForm = true;
            Focus('group-name');
        }

        closeForm() {
            this.showForm = false;
            Focus('add-group-btn');
        }

    }
});