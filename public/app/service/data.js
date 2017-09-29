import Register from '../registry';
import feathers from '../../vendor/feathers';
import SocketService from './socket';
import {EventHandler} from '../object/eventHandler';

let DataService = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(SocketService.socket));

DataService.onEvent = new EventHandler();
Register.value('Data', DataService);

export default DataService;
