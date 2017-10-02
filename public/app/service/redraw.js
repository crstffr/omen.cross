import Ng from './angular';

class Renderer {

    $timeout = fn => fn();

    constructor () {
        Ng.get('$timeout').then($timeout => {
            this.$timeout = $timeout;
        });
    }

    refresh(fn) {
        this.$timeout(fn || function() {});
    }

}

let renderer = new Renderer();

export let redraw = renderer.refresh.bind(renderer);

export default redraw;
