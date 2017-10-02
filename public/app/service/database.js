import SocketService from './socket';
import feathers from '../../vendor/feathers';
import {EventHandler} from '../object/eventHandler';

let Database = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(SocketService.socket));

export default Database;
