"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ezyConstants = _interopRequireDefault(require("./ezy-constants"));

var _ezyHandlers = _interopRequireDefault(require("./ezy-handlers"));

var _ezyLogger = _interopRequireDefault(require("./ezy-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EzyAppManager {
  constructor(zoneName) {
    this.zoneName = zoneName;
    this.appList = [];
    this.appsById = {};
    this.appsByName = {};
  }

  getApp() {
    var app = null;
    if (this.appList.length > 0) app = this.appList[0];else console.log('has no app in zone: ' + this.zoneName);
    return app;
  }

  addApp(app) {
    this.appList.push(app);
    this.appsById[app.id] = app;
    this.appsByName[app.name] = app;
  }

  removeApp(appId) {
    var app = this.appsById[appId];

    if (app) {
      delete this.appsById[appId];
      delete this.appsByName[app.name];
      this.appList = this.appList.filter(item => item.id !== appId);
    }

    return app;
  }

  getAppById(id) {
    var app = this.appsById[id];
    return app;
  }

  getAppByName(name) {
    var app = this.appsByName[name];
    return app;
  }

} //======================================


class EzyPluginManager {
  constructor(zoneName) {
    this.zoneName = zoneName;
    this.pluginList = [];
    this.pluginsById = {};
    this.pluginsByName = {};
  }

  getPlugin() {
    var plugin = null;
    if (this.pluginList.length > 0) plugin = this.pluginList[0];else _ezyLogger.default.warn('has no plugin in zone: ' + this.zoneName);
    return plugin;
  }

  addPlugin(plugin) {
    this.pluginList.push(plugin);
    this.pluginsById[plugin.id] = plugin;
    this.pluginsByName[plugin.name] = plugin;
  }

  getPluginById(id) {
    var plugin = this.pluginsById[id];
    return plugin;
  }

  getPluginByName(name) {
    var plugin = this.pluginsByName[name];
    return plugin;
  }

} //======================================


class EzyPingManager {
  constructor() {
    this.pingPeriod = 5000;
    this.lostPingCount = 0;
    this.maxLostPingCount = 5;
  }

  increaseLostPingCount() {
    return ++this.lostPingCount;
  }

} //===================================================


class EzyHandlerManager {
  constructor(client) {
    this.client = client;
    this.dataHandlers = this.newDataHandlers();
    this.eventHandlers = this.newEventHandlers();
    this.appDataHandlerss = {};
    this.pluginDataHandlerss = {};
  }

  newEventHandlers() {
    var handlers = new _ezyHandlers.default.EzyEventHandlers(this.client);
    handlers.addHandler(_ezyConstants.default.EzyEventType.CONNECTION_SUCCESS, new _ezyHandlers.default.EzyConnectionSuccessHandler());
    handlers.addHandler(_ezyConstants.default.EzyEventType.CONNECTION_FAILURE, new _ezyHandlers.default.EzyConnectionFailureHandler());
    handlers.addHandler(_ezyConstants.default.EzyEventType.DISCONNECTION, new _ezyHandlers.default.EzyDisconnectionHandler());
    return handlers;
  }

  newDataHandlers() {
    var handlers = new _ezyHandlers.default.EzyDataHandlers(this.client);
    handlers.addHandler(_ezyConstants.default.EzyCommand.PONG, new _ezyHandlers.default.EzyPongHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.HANDSHAKE, new _ezyHandlers.default.EzyHandshakeHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.LOGIN, new _ezyHandlers.default.EzyLoginSuccessHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.LOGIN_ERROR, new _ezyHandlers.default.EzyLoginErrorHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.APP_ACCESS, new _ezyHandlers.default.EzyAppAccessHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.APP_REQUEST, new _ezyHandlers.default.EzyAppResponseHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.APP_EXIT, new _ezyHandlers.default.EzyAppExitHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.PLUGIN_INFO, new _ezyHandlers.default.EzyPluginInfoHandler());
    handlers.addHandler(_ezyConstants.default.EzyCommand.PLUGIN_REQUEST, new _ezyHandlers.default.EzyPluginResponseHandler());
    return handlers;
  }

  getDataHandler(cmd) {
    var handler = this.dataHandlers.getHandler(cmd);
    return handler;
  }

  getEventHandler(eventType) {
    var handler = this.eventHandlers.getHandler(eventType);
    return handler;
  }

  getAppDataHandlers(appName) {
    var answer = this.appDataHandlerss[appName];

    if (!answer) {
      answer = new _ezyHandlers.default.EzyAppDataHandlers();
      this.appDataHandlerss[appName] = answer;
    }

    return answer;
  }

  getPluginDataHandlers(pluginName) {
    var answer = this.pluginDataHandlerss[pluginName];

    if (!answer) {
      answer = new _ezyHandlers.default.EzyPluginDataHandlers();
      this.pluginDataHandlerss[pluginName] = answer;
    }

    return answer;
  }

  addDataHandler(cmd, dataHandler) {
    this.dataHandlers.addHandler(cmd, dataHandler);
  }

  addEventHandler(eventType, eventHandler) {
    this.eventHandlers.addHandler(eventType, eventHandler);
  }

} //===================================================


var _default = {
  EzyAppManager,
  EzyPluginManager,
  EzyPingManager,
  EzyHandlerManager
};
exports.default = _default;
//# sourceMappingURL=ezy-managers.js.map