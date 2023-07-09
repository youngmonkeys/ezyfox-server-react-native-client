import Const from './ezy-constants';
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
    this.client.send(Const.EzyCommand.APP_REQUEST, requestData, encrypted);
  }
  getDataHandler(cmd) {
    var handler = this.dataHandlers.getHandler(cmd);
    return handler;
  }
}

//===================================================

export class EzyPlugin {
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
    this.client.sendRequest(Const.EzyCommand.PLUGIN_REQUEST, requestData);
  }
  getDataHandler(cmd) {
    var handler = this.dataHandlers.getHandler(cmd);
    return handler;
  }
}
export default {
  EzyZone,
  EzyApp,
  EzyUser
};
//# sourceMappingURL=ezy-entities.js.map