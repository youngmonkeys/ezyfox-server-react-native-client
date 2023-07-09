"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _proxy = _interopRequireDefault(require("./proxy"));
var _ezyManagers = _interopRequireDefault(require("./ezy-managers"));
var _ezySetup = _interopRequireDefault(require("./ezy-setup"));
var _ezyConstants = _interopRequireDefault(require("./ezy-constants"));
var _ezyLogger = _interopRequireDefault(require("./ezy-logger"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EzyClient {
  constructor(config, callback) {
    _proxy.default.run2('init', config.toMap(), outputConfig => {
      this.config = outputConfig;
      this.name = outputConfig.clientName;
      this.enableSSL = config.enableSSL;
      this.enableDebug = config.enableDebug;
      this.zone = null;
      this.me = null;
      this.handlerManager = new _ezyManagers.default.EzyHandlerManager(this);
      this.setup = new _ezySetup.default(this.handlerManager);
      callback(this);
    });
  }
  connect(host, port) {
    this.privateKey = null;
    this.sessionKey = null;
    _proxy.default.run('connect', {
      clientName: this.name,
      host: host,
      port: port
    });
  }
  reconnect(callback) {
    this.privateKey = null;
    this.sessionKey = null;
    _proxy.default.run2('reconnect', {
      clientName: this.name
    }, callback);
  }
  disconnect(reason) {
    var r = reason ? reason : _ezyConstants.default.EzyDisconnectReason.CLOSE;
    _proxy.default.run('disconnect', {
      clientName: this.name,
      reason: r
    });
  }
  close() {
    this.disconnect();
  }
  send(cmd, data, encrypted) {
    var shouldEncrypted = encrypted;
    if (encrypted && !this.sessionKey) {
      if (this.enableDebug) {
        shouldEncrypted = false;
      } else {
        _ezyLogger.default.error('can not send command: $cmd, you must enable SSL ' + 'or enable debug mode by configuration when you create the client');
        return;
      }
    }
    var params = {};
    params.clientName = this.name;
    var requestParams = {};
    requestParams.command = cmd;
    requestParams.data = data;
    requestParams.encrypted = shouldEncrypted;
    params.request = requestParams;
    _proxy.default.run('send', params);
  }
  startPingSchedule() {
    _proxy.default.run('startPingSchedule', {
      clientName: this.name
    });
  }
  setStatus(status) {
    _proxy.default.run('setStatus', {
      clientName: this.name,
      status: status
    });
  }
  setSessionKey(sessionKey) {
    _proxy.default.run('setSessionKey', {
      clientName: this.name,
      sessionKey: sessionKey
    });
  }
  getApp() {
    if (this.zone) {
      var appManager = this.zone.appManager;
      var app = appManager.getApp();
      return app;
    }
    return null;
  }
  getAppById(appId) {
    if (!this.zone) return null;
    var appManager = this.zone.appManager;
    return appManager.getAppById(appId);
  }
  getPluginById(pluginId) {
    if (!this.zone) return null;
    var pluginManager = this.zone.pluginManager;
    return pluginManager.getPluginById(pluginId);
  }
  newAppManager(zoneName) {
    return new _ezyManagers.default.EzyAppManager(zoneName);
  }
  getAppManager() {
    if (!this.zone) return null;
    return this.zone.appManager;
  }
  getPluginManager() {
    if (!this.zone) return null;
    return this.zone.pluginManager;
  }
  handleEvent(eventType, data) {
    var eventHandlers = this.handlerManager.eventHandlers;
    eventHandlers.handle(eventType, data);
  }
  handleData(command, data) {
    var dataHandlers = this.handlerManager.dataHandlers;
    dataHandlers.handle(command, data);
  }
}
var _default = EzyClient;
exports.default = _default;
//# sourceMappingURL=ezy-client.js.map