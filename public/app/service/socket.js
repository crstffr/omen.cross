import io from 'socketio';
import redraw from './redraw';
import wildcard from 'socketio-wildcard';
import {EventHandler} from '../object/eventHandler';

class SocketService {

    constructor () {

        this.connected = false;

        this.socket = io('http://' + window.location.hostname + ':8660');
        wildcard(io.Manager)(this.socket);

        let onMessage = new EventHandler();
        let onConnect = new EventHandler();
        let onDisconnect = new EventHandler();

        this.onMessage = fn => onMessage.register(fn);
        this.onConnect = fn => onConnect.register(fn);
        this.onDisconnect = fn => onDisconnect.register(fn);

        this.socket.on('*', (msg) => {
            onMessage.trigger(msg);
            redraw();
        });

        this.socket.on('connect', () => {
            onConnect.trigger();
            redraw();
        });

        this.socket.on('disconnect', () => {
            onDisconnect.trigger();
            redraw();
        });

        this.socket.on('connect_error', () => {
            onDisconnect.trigger();
            redraw();
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
export default inst;
