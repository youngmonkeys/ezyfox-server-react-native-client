"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EzyPlugin = void 0;
var _ezyConstants = _interopRequireDefault(require("./ezy-constants"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EzyUser {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

//===================================================

class EzyZone {
  constructor(client, id, name) {
    this.id = id;
    this.name = name;
    this.client = client;
    this.appManager = client.newAppManager(name);
  }
}

//===================================================

class EzyApp {
  constructor(client, zone, id, name) {
    this.id = id;
    this.name = name;
    this.client = client;
    this.zone = zone;
    this.dataHandlers = client.handlerManager.getAppDataHandlers(name);
  }
  send(cmd, data, encrypted) {
    var validData = data;
    if (!validData) validData = {};
    var requestData = [this.id, [cmd, validData]];
    this.client.send(_ezyConstants.default.EzyCommand.APP_REQUEST, requestData, encrypted);
  }
  getDataHandler(cmd) {
    var handler = this.dataHandlers.getHandler(cmd);
    return handler;
  }
}

//===================================================

class EzyPlugin {
  constructor(client, zone, id, name) {
    this.id = id;
    this.name = name;
    this.client = client;
    this.zone = zone;
    this.dataHandlers = client.handlerManager.getPluginDataHandlers(name);
  }
  sendRequest(cmd, data) {
    var validData = data;
    if (!validData) validData = {};
    var requestData = [this.id, [cmd, validData]];
    this.client.sendRequest(_ezyConstants.default.EzyCommand.PLUGIN_REQUEST, requestData);
  }
  getDataHandler(cmd) {
    var handler = this.dataHandlers.getHandler(cmd);
    return handler;
  }
}
exports.EzyPlugin = EzyPlugin;
var _default = {
  EzyZone,
  EzyApp,
  EzyUser
};
exports.default = _default;
//# sourceMappingURL=ezy-entities.js.map