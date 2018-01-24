import {SpiConnection} from './connection';
import {Crosspoint} from './crosspoint';
import settings from './settings';

class Device {

    connection;
    crosspoint;

    constructor () {

        this.crosspoint = new Crosspoint();

        this.connection = new SpiConnection({
            port: settings.port,
            clockSpeed: settings.clockSpeed,
            cpol: (this.crosspoint.edgeTrigger === 'positive') ? 0 : 1
        });

    }

}