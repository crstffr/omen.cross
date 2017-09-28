

AppController.$inject = ['$rootScope', 'AppService'];

export function AppController($rootScope, AppService) {


    $rootScope.app = AppService;



    /*
    let app = feathers()
        .configure(feathers.hooks())
        .configure(feathers.socketio(socket));

    let items = app.service('items');

    items.on('created', function (item) {
        console.log('data created', item);
        _this.items.push(item);
    });

    items.find({query: {$limit: 4}}).then(function (items) {
        _this.items = items;
        $timeout(function () {});
    });

    this.add = function () {
        items.create({
            name: 'newthing'
        });
    };
    */

}