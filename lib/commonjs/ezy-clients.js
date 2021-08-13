"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ezyClient = _interopRequireDefault(require("./ezy-client"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  EzyClientProxy
} = _reactNative.NativeModules;

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
    new _ezyClient.default(config, client => {
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
    if (_reactNative.Platform.OS == 'ios') {
      const clientEmitter = new _reactNative.NativeEventEmitter(EzyClientProxy);
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
      _reactNative.DeviceEventEmitter.addListener('ezy.event', params => {
        var client = this.getClient(params.clientName);
        var eventType = params.eventType;
        var data = params.data;
        client.handleEvent(eventType, data);
      });

      _reactNative.DeviceEventEmitter.addListener('ezy.data', params => {
        var client = this.getClient(params.clientName);
        var command = params.command;
        var data = params.data;
        client.handleData(command, data);
      });
    }
  }

}

var _default = EzyClients;
exports.default = _default;
//# sourceMappingURL=ezy-clients.js.map