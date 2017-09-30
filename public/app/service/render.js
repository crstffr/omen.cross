import Register from '../registry';

Register.service('Render', ($timeout, Socket, Database) => {

    // Force Angular to redraw when something happens it doesn't know about

    Socket.onEvent(() => {
        $timeout(() => {});
    });

    Database.onChange.register(() => {
        $timeout(() => {});
    });

}, ['$timeout', 'Socket', 'Database']);