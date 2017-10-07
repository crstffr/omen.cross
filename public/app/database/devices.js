import DataSet from '../object/dataSet';
export let Devices = new DataSet('devices');

export default Devices;

export let RootDevices = new Devices.Subset({patchedTo: 'root'});
