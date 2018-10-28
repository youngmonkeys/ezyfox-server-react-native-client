import Util from './ezy-util'
import Const from './ezy-constants'
import Entity from './ezy-entities'

class EzyConnectionSuccessHandler {

    constructor() {
        this.clientType = "REACT_NATIVE";
        this.clientVersion = "1.0.0";
    }

    handle() {
        this.sendHandshakeRequest();
        this.postHandle();
    }

    postHandle() {
    }

    sendHandshakeRequest() {
        var request = this.newHandshakeRequest();
        this.client.sendRequest(Const.EzyCommand.HANDSHAKE, request);
    }

    newHandshakeRequest() {
        var clientId = this.getClientId();
        var clientKey = this.getClientKey();
        var enableEncryption = this.isEnableEncryption();
        var token = this.getStoredToken();
        var request = [clientId, clientKey, this.clientType, this.clientVersion, enableEncryption, token];
        return request;
    }

    getClientKey() {
        return "";
    }

    getClientId() {
        return Util.EzyGuid.generate();
    }

    isEnableEncryption() {
        return false;
    }

    getStoredToken() {
        return "";
    }

}
//=======================================================

class EzyConnectionFailureHandler {

    handle(event) {
        console.log("connection failure, reason = " + event.reason);
        var config = this.client.config;
        var reconnectConfig = config.reconnect;
        var should = this.shouldReconnect(event);
        var must = reconnectConfig.enable && should;
        if(must) {
            this.client.reconnect(success => {
                if(!success)
                    this.processWhenNoReconnect(event);
            });
        }
        else {
            this.processWhenNoReconnect(event);
        }
    }

    processWhenNoReconnect(event) {
        this.client.setStatus(Const.EzyConnectionStatus.FAILURE);
        this.control(event);
    }

    shouldReconnect(event) {
        return true;
    }

    control(event) {
    }

}

//=======================================================
class EzyDisconnectionHandler {
    handle(event) {
        console.log("handle disconnection, reason = " + event.reason);
        this.preHandle(event);
        var config = this.client.config;
        var reconnectConfig = config.reconnect;
        var should = this.shouldReconnect(event);
        var must = reconnectConfig.enable && should;
        if(must) {
            this.client.reconnect(success => {
                if(!success)
                    this.processWhenNoReconnect(event);
            });
        }
        else {
            this.processWhenNoReconnect(event);
        }
    }

    processWhenNoReconnect(event) {
        this.client.setStatus(Const.EzyConnectionStatus.DISCONNECTED);
        this.control(event);
    }

    preHandle(event) {
    }

    shouldReconnect(event) {
        return true;
    }

    control(event) {
    }
}

//=======================================================
class EzyPongHandler {
    handle(data) {
    }
}

//=======================================================

class EzyHandshakeHandler {

	handle(data) {
		this.startPing();
		this.handleLogin();
		this.postHandle(data);
	}

	postHandle(data) {
    }

	handleLogin() {
		var loginRequest = this.getLoginRequest();
        this.client.sendRequest(Const.EzyCommand.LOGIN, loginRequest);
        console.log("handle login");
    }
    
    getLoginRequest() {
        return ["test", "test", "test", []];
	}
	
	startPing() {
		this.client.startPingSchedule();
	}
}

//=======================================================
class EzyLoginSuccessHandler {
    handle(data) {
        var zoneId = data[0];
        var zoneName = data[1];
        var userId = data[2];
        var username = data[3];
        var joinedAppArray = data[4];
        var responseData = data[5];

        var zone = new Entity.EzyZone(this.client, zoneId, zoneName);
        var user = new Entity.EzyUser(userId, username);
        this.client.me = user;
        this.client.zone = zone;
        var allowReconnect = this.allowReconnection();
        var appCount = joinedAppArray.length;
        var shouldReconnect = allowReconnect && appCount > 0;
        this.handleResponseData(responseData);
        if(shouldReconnect) {
            this.handleResponseAppDatas(joinedAppArray);
            this.handleReconnectSuccess(responseData);
        }
        else {
            this.handleLoginSuccess(responseData);  
        }
        console.log("user: " + user.name + " logged in successfully");
    }

    allowReconnection() {
        return false;
    }
    
    handleResponseData(data) {
    }

    handleResponseAppDatas(appDatas) {
        var handlerManager = this.client.handlerManager;
        var appAccessHandler = handlerManager.getDataHandler(Const.EzyCommand.APP_ACCESS);
        appDatas.forEach(app => {
            appAccessHandler.handle(app);
        });
    }

    handleLoginSuccess(data) {
    }

    handleReconnectSuccess(data) {
        this.handleLoginSuccess(data);
    }
}

//=======================================================

class EzyAppAccessHandler {
    handle(data) {
        var zone = this.client.zone;
        var appManager = zone.appManager;
        var app = this.newApp(zone, data);
        appManager.addApp(app);
        this.client.addApp(app);
        this.postHandle(app, data);
        console.log("access app: " + app.name + " successfully");
    }

    newApp(zone, data) {
        var appId = data[0];
        var appName = data[1];
        var app = new Entity.EzyApp(this.client, zone, appId, appName);
        return app;
    }

    postHandle(app, data) {
    }
}
//=======================================================

class EzyAppResponseHandler {
    handle(data) {
        var appId = data[0];
        var responseData = data[1];
        var cmd = responseData[0];
        var commandData = responseData[1];

        var app = this.client.getAppById(appId);
        var handler = app.getDataHandler(cmd);
        if(handler)
            handler(app, commandData);
        else
            console.log("app: " + app.name + " has no handler for command: " + cmd);
    }
}

//=======================================================
class EzyEventHandlers {
    constructor(client) {
        this.handlers = {};
        this.client = client;
        this.pingSchedule = client.pingSchedule;
    }

    addHandler(eventType, handler) {
        handler.client = this.client;
        handler.pingSchedule = this.pingSchedule;
        this.handlers[eventType] = handler;
    }

    getHandler(eventType) {
        var handler = this.handlers[eventType];
        return handler;
    }

    handle(eventType, data) {
        var handler = this.getHandler(eventType);
        if(handler)
            handler.handle(data);
        else
            console.log("has no handler with event: " + eventType);
    }
}

//=======================================================

class EzyDataHandlers {
    constructor(client) {
        this.handlers = {};
        this.client = client;
    }

    addHandler(cmd, handler) {
        handler.client = this.client;
        this.handlers[cmd] = handler;
    }

    getHandler(cmd) {
        var handler = this.handlers[cmd];
        return handler;
    }

    handle(cmd, data) {
        var handler = this.getHandler(cmd);
        if(handler)
            handler.handle(data);
        else
            console.log("has no handler with command: " + cmd);
    }
}

//=======================================================

class EzyAppDataHandlers {

    constructor() {
        this.handlers = {}
    }

    addHandler(cmd, handler) {
        this.handlers[cmd] = handler;
    }

    getHandler(cmd) {
        var handler = this.handlers[cmd];
        return handler;
    }

}

//=======================================================

export default { 
    EzyConnectionSuccessHandler,
    EzyConnectionFailureHandler, 
    EzyDisconnectionHandler,
    EzyPongHandler,
    EzyHandshakeHandler,
    EzyLoginSuccessHandler,
    EzyAppAccessHandler,
    EzyAppResponseHandler,
    EzyEventHandlers, 
    EzyDataHandlers,
    EzyAppDataHandlers
}