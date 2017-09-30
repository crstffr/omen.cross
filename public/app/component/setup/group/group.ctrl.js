import Focus from '../../../service/focus';
import Groups from '../../../database/groups';
import Devices from '../../../database/devices';

export class GroupCtrl {

    group = {};
    showForm = false;

    constructor () {

    }
    
    openForm() {
        this.showForm = true;
        Focus('add-device-form-name');
    }

    closeForm() {
        this.showForm = false;
    }

}

export default GroupCtrl;