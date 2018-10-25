import Const from './ezy-constants'
import Handler from './ezy-handlers'

class EzyAppManager {

    constructor(zoneName) {
        this.zoneName = zoneName;
        this.appList = [];
        this.appsById = {};
        this.appsByName = {};
    }

    getApp() {
        var app = null;
        if(this.appList.length > 0)
           app = this.appList[0];
        else
            console.log('has no app in zone: ' + this.zoneName);
        return app;
    }

    addApp(app) {
        this.appList.push(app);
        this.appsById[app.id] = app;
        this.appsByName[app.name] = app;
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

//===================================================

class EzyHandlerManager {

    constructor(client) {
        this.client = client;
        this.dataHandlers = this.newDataHandlers();
        this.eventHandlers = this.newEventHandlers();
        this.appDataHandlerss = {};
    }

    newEventHandlers() {
        var handlers = new Handler.EzyEventHandlers(this.client);
        handlers.addHandler(Const.EzyEventType.CONNECTION_SUCCESS, new Handler.EzyConnectionSuccessHandler());
        handlers.addHandler(Const.EzyEventType.CONNECTION_FAILURE, new Handler.EzyConnectionFailureHandler());
        handlers.addHandler(Const.EzyEventType.DISCONNECTION, new Handler.EzyDisconnectionHandler());
        return handlers;
    }

    newDataHandlers() {
        var handlers = new Handler.EzyDataHandlers(this.client);
        handlers.addHandler(Const.EzyCommand.PONG, new Handler.EzyPongHandler());
        handlers.addHandler(Const.EzyCommand.HANDSHAKE, new Handler.EzyHandshakeHandler());
        handlers.addHandler(Const.EzyCommand.LOGIN, new Handler.EzyLoginSuccessHandler());
        handlers.addHandler(Const.EzyCommand.APP_ACCESS, new Handler.EzyAppAccessHandler());
        handlers.addHandler(Const.EzyCommand.APP_REQUEST, new Handler.EzyAppResponseHandler());
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
        if(!answer) {
            answer = new Handler.EzyAppDataHandlers();
            this.appDataHandlerss[appName] = answer;
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

export default {EzyAppManager, EzyHandlerManager}