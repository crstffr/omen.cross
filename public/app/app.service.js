import io from 'socketio';
import wildcard from 'socketio-wildcard';
import feathers from '../vendor/feathers';

export class AppService {

    constructor ($timeout) {

        this.connected = false;

        this.socket = io('http://' + window.location.hostname + ':8660');
        wildcard(io.Manager)(this.socket);

        this.socket.on('*', () => {
            $timeout(() => {});
        });

        this.socket.on('connect', () => {
            this.connected = true;
            $timeout(() => {});
        });

        this.socket.on('connect_error', () => {
            this.connected = false;
            $timeout(() => {});
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            $timeout(() => {});
        });

    }

}

AppService.$inject = ['$timeout'];