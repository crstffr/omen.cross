
import {Routes} from './route/routes';

export function AppConfig($stateProvider) {

    Routes.forEach((route) => {
        $stateProvider.state({
            url: route.url,
            name: route.name,
            component: route.componentName
        });
    });

}

AppConfig.$inject = ['$stateProvider'];