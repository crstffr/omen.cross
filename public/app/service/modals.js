
class ModalService {

    modals = {};

    constructor () {

    }

    register(modal) {
        this.modals[modal.id] = modal;
    }

    destroyAll() {
        Object.keys(this.modals).forEach(id => this.destroy(id));
    }

    destroy(id) {
        let modal = this.modals[id];
        if (modal.destroy) {
            modal.destroy();
        }
        this.remove(id);
    }

    remove(id) {
        delete this.modals[id];
    }

}

export default new ModalService();