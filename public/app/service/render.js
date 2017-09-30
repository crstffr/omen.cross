import Register from '../registry';

Register.service('Render', ($timeout, Socket, Data) => {

    // Force Angular to redraw when something happens it doesn't know about

    Socket.onAnything(() => {
        $timeout(() => {});
    });

    Data.onAnything.register(() => {
        $timeout(() => {});
    });

}, ['$timeout', 'Socket', 'Data']);