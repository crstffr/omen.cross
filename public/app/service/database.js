import Register from '../registry';
import feathers from '../../vendor/feathers';
import SocketService from './socket';
import {EventHandler} from '../object/eventHandler';

let Database = feathers()
    .configure(feathers.hooks())
    .configure(feathers.socketio(SocketService.socket));

Database.onChange = new EventHandler();
Register.value('Database', Database);

export default Database;
