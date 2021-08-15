import Const from './ezy-constants';
import Handler from './ezy-handlers';
import EzyLogger from './ezy-logger';

class EzyAppManager {
    constructor(zoneName) {
        this.zoneName = zoneName;
        this.appList = [];
        this.appsById = {};
        this.appsByName = {};
    }

    getApp() {
        var app = null;
        if (this.appList.length > 0) app = this.appList[0];
        else console.log('has no app in zone: ' + this.zoneName);
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
            this.appList = this.appList.filter((item) => item.id !== appId);
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
}

//======================================

class EzyPluginManager {
    constructor(zoneName) {
        this.zoneName = zoneName;
        this.pluginList = [];
        this.pluginsById = {};
        this.pluginsByName = {};
    }

    getPlugin() {
        var plugin = null;
        if (this.pluginList.length > 0) plugin = this.pluginList[0];
        else EzyLogger.warn('has no plugin in zone: ' + this.zoneName);
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
}

//======================================

class EzyPingManager {
    constructor() {
        this.pingPeriod = 5000;
        this.lostPingCount = 0;
        this.maxLostPingCount = 5;
    }

    increaseLostPingCount() {
        return ++this.lostPingCount;
    }
}

//===================================================

class EzyHandlerManager {
    constructor(client) {
        this.client = client;
        this.dataHandlers = this.newDataHandlers();
        this.eventHandlers = this.newEventHandlers();
        this.appDataHandlerss = {};
        this.pluginDataHandlerss = {};
    }

    newEventHandlers() {
        var handlers = new Handler.EzyEventHandlers(this.client);
        handlers.addHandler(
            Const.EzyEventType.CONNECTION_SUCCESS,
            new Handler.EzyConnectionSuccessHandler()
        );
        handlers.addHandler(
            Const.EzyEventType.CONNECTION_FAILURE,
            new Handler.EzyConnectionFailureHandler()
        );
        handlers.addHandler(
            Const.EzyEventType.DISCONNECTION,
            new Handler.EzyDisconnectionHandler()
        );
        return handlers;
    }

    newDataHandlers() {
        var handlers = new Handler.EzyDataHandlers(this.client);
        handlers.addHandler(
            Const.EzyCommand.PONG,
            new Handler.EzyPongHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.HANDSHAKE,
            new Handler.EzyHandshakeHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.LOGIN,
            new Handler.EzyLoginSuccessHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.LOGIN_ERROR,
            new Handler.EzyLoginErrorHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.APP_ACCESS,
            new Handler.EzyAppAccessHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.APP_REQUEST,
            new Handler.EzyAppResponseHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.APP_EXIT,
            new Handler.EzyAppExitHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.PLUGIN_INFO,
            new Handler.EzyPluginInfoHandler()
        );
        handlers.addHandler(
            Const.EzyCommand.PLUGIN_REQUEST,
            new Handler.EzyPluginResponseHandler()
        );
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
            answer = new Handler.EzyAppDataHandlers();
            this.appDataHandlerss[appName] = answer;
        }
        return answer;
    }

    getPluginDataHandlers(pluginName) {
        var answer = this.pluginDataHandlerss[pluginName];
        if (!answer) {
            answer = new Handler.EzyPluginDataHandlers();
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
}
//===================================================

export default {
    EzyAppManager,
    EzyPluginManager,
    EzyPingManager,
    EzyHandlerManager,
};
