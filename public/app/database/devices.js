import DataSet from '../object/dataSet';
export let Devices = new DataSet('devices');

Devices.fetchAll();

export default Devices;

export let RootDevices = new Devices.Subset({patchedTo: 'root'});

