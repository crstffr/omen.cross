import io from 'socketio';
import wildcard from 'socketio-wildcard';
import {EventHandler} from '../object/eventHandler';
import Register from '../registry';

class SocketService {

    constructor () {

        this.connected = false;

        this.socket = io('http://' + window.location.hostname + ':8660');
        wildcard(io.Manager)(this.socket);

        let onEvent = new EventHandler();
        let onMessage = new EventHandler();
        let onConnect = new EventHandler();
        let onDisconnect = new EventHandler();

        this.onEvent = fn => onEvent.register(fn);
        this.onMessage = fn => onMessage.register(fn);
        this.onConnect = fn => onConnect.register(fn);
        this.onDisconnect = fn => onDisconnect.register(fn);

        this.socket.on('*', (msg) => {
            onEvent.trigger('message', msg);
            onMessage.trigger(msg);
        });

        this.socket.on('connect', () => {
            onEvent.trigger('connect');
            onConnect.trigger();
        });

        this.socket.on('disconnect', () => {
            onEvent.trigger('disconnect');
            onDisconnect.trigger();
        });

        this.socket.on('connect_error', () => {
            onEvent.trigger('connect_error');
            onDisconnect.trigger();
        });

        this.onConnect(() => {
            this.connected = true;
        });

        this.onDisconnect(() => {
            this.connected = false;
        });

    }

}

let inst = new SocketService();
Register.value('Socket', inst);
export default inst;
