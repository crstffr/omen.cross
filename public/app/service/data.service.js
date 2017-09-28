import feathers from '../../vendor/feathers';
import SocketService from './socket.service';
import {EventHandler} from '../lib/eventHandler';

export let DataService = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(SocketService.socket));

DataService.$name = 'DataService';
DataService.onEvent = new EventHandler();
