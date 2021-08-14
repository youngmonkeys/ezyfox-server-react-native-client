"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class EzySetup {
  constructor(handlerManager) {
    this.handlerManager = handlerManager;
    this.appSetups = {};
  }

  addDataHandler(cmd, dataHandler) {
    this.handlerManager.addDataHandler(cmd, dataHandler);
    return this;
  }

  addEventHandler(eventType, eventHandler) {
    this.handlerManager.addEventHandler(eventType, eventHandler);
    return this;
  }

  setupApp(appName) {
    var appSetup = this.appSetups[appName];

    if (!appSetup) {
      var appDataHandlers = this.handlerManager.getAppDataHandlers(appName);
      appSetup = new EzyAppSetup(appDataHandlers, this);
      this.appSetups[appName] = appSetup;
    }

    return appSetup;
  }

  setupPlugin(pluginName) {
    var pluginSetup = this.pluginSetups[pluginName];

    if (!pluginSetup) {
      var pluginDataHandlers = this.handlerManager.getPluginDataHandlers(pluginName);
      pluginSetup = new EzyPluginSetup(pluginDataHandlers, this);
      this.pluginSetups[pluginName] = pluginSetup;
    }

    return pluginSetup;
  }

}

class EzyAppSetup {
  constructor(dataHandlers, parent) {
    this.parent = parent;
    this.dataHandlers = dataHandlers;
  }

  addDataHandler(cmd, dataHandler) {
    this.dataHandlers.addHandler(cmd, dataHandler);
    return this;
  }

  done() {
    return this.parent;
  }

}

var _default = EzySetup;
exports.default = _default;
//# sourceMappingURL=ezy-setup.js.map