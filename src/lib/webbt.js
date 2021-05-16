// const MICROVM_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
// const WRITE_CHAR = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
// const READ_CHAR = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// var waitCallback = null;
// var waitCommand = null;
// var waitLength = null;
// var waitBuffer = null;

// var connectCallbacks = {};
// var disconnectCallbacks = {};

// class WebBluetooth {
//     constructor () {
//         this.readChar = null;
//         this.writeChar = null;
//         this.isConnected = false;

//         this.onDisconnected = this.onDisconnected.bind(this);
//     }

//     scan () {
//         navigator.bluetooth.requestDevice({filters: [{services: [MICROVM_UUID]}]})
//             .then(device => {
//                 device.addEventListener('gattserverdisconnected', this.onDisconnected);
//                 return device.gatt.connect();
//             })
//             .then(server => {
//                 return server.getPrimaryService(MICROVM_UUID);
//             })
//             .then(service => {
//                 service.getCharacteristic(WRITE_CHAR).then(c => {
//                     this.writeChar = c;
//                 });
//                 service.getCharacteristic(READ_CHAR).then(c => c.startNotifications())
//                     .then(c => {
//                         c.addEventListener('characteristicvaluechanged', this.handleReadChar);
//                         this.readChar = c;
//                     });
//             })
//             .then(() => {
//                 this.isConnected = true;
//                 Object.keys(connectCallbacks).forEach(key => {
//                     connectCallbacks[key]();
//                 });
//             })
//             .catch(error => console.log(error));
//     }

//     registerConnectCallback (cb) {
//         connectCallbacks[cb] = cb;
//     }

//     registerDisconnectCallback (cb) {
//         disconnectCallbacks[cb] = cb;
//     }

//     removeConnectCallback (cb) {
//         delete connectCallbacks[cb];
//     }

//     removeDisconnectCallback (cb) {
//         delete disconnectCallbacks[cb];
//     }

//     onDisconnected () {
//         this.isConnected = false;
//         Object.keys(disconnectCallbacks).forEach(key => {
//             disconnectCallbacks[key]();
//         });
//     }

//     handleReadChar (event) {
//         var input = new Uint8Array(event.target.value.buffer);
//         console.log(input);
//         if (waitCallback && waitCommand === input[0]) {
//             waitCallback(waitBuffer);
//             waitCallback = null;
//             waitCommand = null;
//         }
//         waitBuffer = input;
//         if (waitCallback && waitLength === waitBuffer.length) {
//             waitCallback(waitBuffer);
//             waitCallback = null;
//             waitLength = null;
//         }
//     }

//     async sendAndWaitForResp (data, cmd) {
//         if (data.length < 20) {
//             await this.send(data);
//         } else {
//             for (let i = 0; i < data.length; i += 20) {
//                 await this.send(data.slice(i, i + 20));
//             }
//         }
//         return new Promise(resolve => {
//             waitCallback = resolve;
//             waitCommand = cmd;
//         });
//     }

//     async sendAndWaitForRespLen (data, len) {
//         if (data.length < 20) {
//             await this.send(data);
//         } else {
//             for (let i = 0; i < data.length; i += 20) {
//                 await this.send(data.slice(i, i + 20));
//             }
//         }
//         return new Promise(resolve => {
//             waitCallback = resolve;
//             waitLength = len;
//         });
//     }

//     delay (ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }

//     send (data) {
//         if (!this.isConnected) return;
//         return new Promise(resolve => {
//             var output = new Uint8Array(data);
//             console.log('Sending: ', output);
//             this.writeChar.writeValue(output).then(() => {
//                 resolve();
//             });
//         });
//     }
// }

// const webbt = new WebBluetooth();
// export default webbt;
