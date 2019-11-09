import Util from './ezy-util'
import Const from './ezy-constants'

class EzyConnectionSuccessHandler {

    constructor() {
        this.clientType = "REACT_NATIVE";
        this.clientVersion = "1.0.0";
    }

    handle() {
        this.client.setStatus(Const.EzyConnectionStatus.CONNECTED);
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
        Util.EzyLogger.console("connection failure, reason = " + event.reason);
        var config = this.client.config;
        var reconnectConfig = config.reconnect;
        var should = this.shouldReconnect(event);
        var must = reconnectConfig.enable && should;
        this.client.setStatus(Const.EzyConnectionStatus.FAILURE);
        if(must) {
            this.client.reconnect(success => {
                if(!success)
                    this.control(event);
            });
        }
        else {
            this.control(event);
        }
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
        Util.EzyLogger.console("handle disconnection, reason = " + event.reason);
        this.preHandle(event);
        var config = this.client.config;
        var reconnectConfig = config.reconnect;
        var should = this.shouldReconnect(event);
        var must = reconnectConfig.enable && should;
        this.client.setStatus(Const.EzyConnectionStatus.DISCONNECTED);
        if(must) {
            this.client.reconnect(success => {
                if(!success)
                    this.control(event);
            });
        }
        else {
            this.control(event);
        }
    }

    preHandle(event) {
    }

    shouldReconnect(event) {
        var reason = event.reason;
        if(reason == 'ANOTHER_SESSION_LOGIN')
            return false;
        return true;
    }

    control(event) {
    }
}

//======================================

class EzyEventHandlers {
    constructor(client) {
        this.handlers = {};
        this.client = client;
    }

    addHandler(eventType, handler) {
        handler.client = this.client;
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

export default {
    EzyConnectionSuccessHandler,
    EzyConnectionFailureHandler,
    EzyDisconnectionHandler,
    EzyEventHandlers
}