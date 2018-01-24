import SocketService from './socket';
import MessageModal from '../component/modal/message';

class ConnectionService {

    modal = null;

    constructor () {

        this.modal = new MessageModal({
            closeable: false,
            delay: true,
            text: {
                title: 'Lost Connection',
                body: `Unable to communicate with your Omen Cross. Ensure the device is powered 
                       on and your wireless network is configured correctly.`
            }
        });

        SocketService.onConnect(() => {
            this.modal.close();
        });

        SocketService.onDisconnect(() => {
            this.modal.open();
        });

    }

}

export default new ConnectionService();