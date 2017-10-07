/**
 * Angular 1.x module registration is frustrating when working in a modern environment,
 * where applications have a dependency graph made from numerous imports and exports.
 * Everything needs to be registered with the top-level Angular 'app' module in order
 * for it to be available.  But including the app module in your components will create
 * circular dependencies.  App -> Component -> App, and so on.
 *
 * This class allows services, directives, and components to register themselves with
 * your top-level Angular 'app' module without circular issues.  Registration happens
 * asynchronously, waiting until the application module is passed in and ready.
 *
 * @author crstffr 2017
 */
class Registry {

    ng;
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
        this.ng = app;
        this.isReady();
        return app;
    }

    config(config, deps) {
        return this.whenReady().then(() => {
            this.ng.config(config);
        });
    }

    view(name, view) {
        return this.whenReady().then(() => {
            let componentName = name + 'View';
            this.ng.component(componentName, view);
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
            this.ng.value(name, value);
        });
    }

    service(name, service, inject) {
        return this.whenReady().then(() => {
            if (inject) { service.$inject = inject; }
            this.ng.service(name, service);
            this.ng.run([name, () => {}]);
        });
    }

    component(name, component, inject) {
        return this.whenReady().then(() => {
            if (inject) { component.$inject = inject; }
            this.ng.component(name, component);
        });
    }

    controller(name, controller, inject) {
        return this.whenReady().then(() => {
            if (inject) { controller.$inject = inject; }
            this.ng.controller(name, controller);
        });
    }

    directive(name, directive, inject) {
        return this.whenReady().then(() => {
            if (inject) { directive.$inject = inject; }
            this.ng.directive(name, directive);
        });
    }

}

export default new Registry();