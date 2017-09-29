
import angular from 'angular';
import 'angular-ui-router';

import Register from './registry';

import '../style/style';
import './view/index/index.view';
import './view/patch/patch.view';
import './view/setup/setup.view';
import './view/library/library.view';
import './view/control/control.view';
import './service/socket';
import './service/render';
import './service/data';
import './service/radio';
import './component/patchbay/patchbay';
import './component/setup/group/group';
import './directive/focus';

Register.app(angular.module('app', ['ui.router']));