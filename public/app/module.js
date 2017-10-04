
import Register from './registry';
import angular from 'angular';
import 'angular-ui-router';

import '../style/style';
import './view/index/index.view';
import './view/patch/patch.view';
import './view/devices/devices.view';
import './view/library/library.view';
import './view/control/control.view';
import './service/database';
import './service/angular';
import './service/socket';
import './service/redraw';
import './service/radio';
import './service/modals';
import './component/modal/modal';
import './component/patchbay/patchbay';
import './component/add-group-form/add-group-form';
import './component/add-device-form/add-device-form';
import './component/device-list/device-list';
import './component/device-table/device-table';
import './component/setup/group/group';
import './directive/sortable';
import './directive/focus';

Register.app(angular.module('app', ['ui.router']));