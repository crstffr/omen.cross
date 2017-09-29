
class Registry {

    ngApp;
    ready;
    isReady;

    constructor () {
        this.ready = new Promise((resolve) => {
            this.isReady = resolve;
        });
    }

    whenReady() {
        return this.ready;
    }

    app(app) {
        this.ngApp = app;
        this.isReady();
        return app;
    }

    load(name) {
        return this.whenReady().then(() => {
            this.ngApp.run([name, () => {}]);
        });
    }

    config(config, deps) {
        return this.whenReady().then(() => {
            this.ngApp.config(config);
        });
    }

    view(name, view) {
        return this.whenReady().then(() => {
            let componentName = name + 'View';
            this.ngApp.component(componentName, view);
            this.config(['$stateProvider', ($stateProvider) => {
                $stateProvider.state({
                    name: name,
                    url: view.$url,
                    component: componentName
                });
            }]);
        });
    }

    value(name, value) {
        return this.whenReady().then(() => {
            this.ngApp.value(name, value);
        });
    }

    service(name, service, inject) {
        return this.whenReady().then(() => {
            if (inject) { service.$inject = inject; }
            this.ngApp.service(name, service);
            this.ngApp.run([name, () => {}]);
        });
    }

    component(name, component, inject) {
        return this.whenReady().then(() => {
            if (inject) { component.$inject = inject; }
            this.ngApp.component(name, component);
        });
    }

    controller(name, controller, inject) {
        return this.whenReady().then(() => {
            if (inject) { controller.$inject = inject; }
            this.ngApp.controller(name, controller);
        });
    }

    directive(name, directive, inject) {
        return this.whenReady().then(() => {
            if (inject) { directive.$inject = inject; }
            this.ngApp.directive(name, directive);
        });
    }

}

export default new Registry();