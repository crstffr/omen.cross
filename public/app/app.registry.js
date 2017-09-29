
// Routes

import Index from './route/index/index.route';
import Patch from './route/patch/patch.route';
import Setup from './route/setup/setup.route';
import Library from './route/library/library.route';
import Control from './route/control/control.route';

// Services

import {DataService} from './service/data.service';
import {RadioService} from './service/radio.service';
import Socket from './service/socket.service';

// Components

import SetupGroup from './component/setup/group/group.comp';


// Directives

import FocusOn from './directive/focusOn.dir';



export let Routes = [
    Index,
    Patch,
    Setup,
    Library,
    Control
];

export let Services = [
    RadioService,
    DataService,
    Socket
];

export let Components = [
    SetupGroup
];

export let Directives = [
    FocusOn
];

