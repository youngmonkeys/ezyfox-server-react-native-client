import EzyClient from './ezy-client';
import { DeviceEventEmitter, NativeEventEmitter, Platform, NativeModules } from 'react-native';
const {
  EzyClientProxy
} = NativeModules;

class EzyClients {
  constructor() {
    this.clients = {};
    this.defaultClientName = "";
    this.addEventListeners();
  }

  static getInstance() {
    if (!EzyClients.instance) {
      EzyClients.instance = new EzyClients();
    }

    return EzyClients.instance;
  }

  newClient(config, callback) {
    new EzyClient(config, client => {
      this.addClient(client);
      if (this.defaultClientName == "") this.defaultClientName = client.name;
      if (callback) callback(client);
    });
  }

  newDefaultClient(config, callback) {
    this.newClient(config, client => {
      this.defaultClientName = client.name;
      if (callback) callback(client);
    });
  }

  addClient(client) {
    this.clients[client.name] = client;
  }

  getClient(clientName) {
    return this.clients[clientName];
  }

  getDefaultClient() {
    return this.clients[this.defaultClientName];
  }

  addEventListeners() {
    if (Platform.OS == 'ios') {
      const clientEmitter = new NativeEventEmitter(EzyClientProxy);
      clientEmitter.addListener('ezy.event', params => {
        var client = this.getClient(params.clientName);
        var eventType = params.eventType;
        var data = params.data;
        client.handleEvent(eventType, data);
      });
      clientEmitter.addListener('ezy.data', params => {
        var client = this.getClient(params.clientName);
        var command = params.command;
        var data = params.data;
        client.handleData(command, data);
      });
    } else {
      DeviceEventEmitter.addListener('ezy.event', params => {
        var client = this.getClient(params.clientName);
        var eventType = params.eventType;
        var data = params.data;
        client.handleEvent(eventType, data);
      });
      DeviceEventEmitter.addListener('ezy.data', params => {
        var client = this.getClient(params.clientName);
        var command = params.command;
        var data = params.data;
        client.handleData(command, data);
      });
    }
  }

}

export default EzyClients;
//# sourceMappingURL=ezy-clients.js.map