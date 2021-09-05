import Util from './ezy-util';
import Const from './ezy-constants';
import Entity from './ezy-entities';
import { EzyRSAProxy } from './ezy-codec';
import EzyLogger from './ezy-logger';

class EzyConnectionSuccessHandler {
    constructor() {
        this.clientType = 'REACT_NATIVE';
        this.clientVersion = '1.0.0';
    }

    handle() {
        this.client.setStatus(Const.EzyConnectionStatus.CONNECTED);
        this.sendHandshakeRequest();
        this.postHandle();
    }

    postHandle() {}

    sendHandshakeRequest() {
        this.generateClientKey((clientKey) => {
            this.client.send(
                Const.EzyCommand.HANDSHAKE,
                this.newHandshakeRequest(clientKey)
            );
        });
    }

    newHandshakeRequest(clientKey) {
        var clientId = this.getClientId();
        var token = this.getStoredToken();
        var request = [];
        request.push(clientId);
        request.push(clientKey);
        request.push(this.clientType);
        request.push(this.clientVersion);
        request.push(this.isEnableSSL(clientKey));
        request.push(token);
        return request;
    }

    isEnableSSL(clientKey) {
        if (
            this.client.enableSSL &&
            this.client.enableDebug &&
            (!clientKey || clientKey.isEmpty)
        ) {
            return false;
        }
        return this.client.enableSSL;
    }

    generateClientKey(callback) {
        if (this.client.enableSSL) {
            EzyRSAProxy.getInstance().generateKeyPair((keyPair) => {
                this.client.privateKey = keyPair.privateKey;
                callback(keyPair.publicKey);
            });
        } else {
            callback();
        }
    }

    getClientId() {
        return Util.EzyGuid.generate();
    }

    getStoredToken() {
        return '';
    }
}

//=======================================================

class EzyConnectionFailureHandler {
    handle(event) {
        var reason = event.reason;
        var reasonName =
            Const.EzyConnectionFailedReasons.getConnectionFailedReasonName(
                reason
            );
        EzyLogger.warn('connection failure, reason = ' + reasonName);
        this.preHandle(event);
        var config = this.client.config;
        var reconnectConfig = config.reconnect;
        var should = this.shouldReconnect(event);
        var mustReconnect = reconnectConfig.enable && should;
        this.client.setStatus(Const.EzyConnectionStatus.FAILURE);
        if (mustReconnect) {
            this.client.reconnect((success) => {
                if (success) {
                    this.onReconnecting(event);
                } else {
                    this.onConnectionFailed(event);
                }
                this.postHandle(event);
            });
        } else {
            this.onConnectionFailed(event);
            this.postHandle(event);
        }
    }

    preHandle(event) {}

    shouldReconnect(event) {
        return true;
    }

    onReconnecting(event) {}

    onConnectionFailed(event) {}

    postHandle(event) {}
}

//=======================================================

class EzyDisconnectionHandler {
    handle(event) {
        var reason = event.reason;
        var reasonName =
            Const.EzyDisconnectReasons.getDisconnectReasonName(reason);
        EzyLogger.info('handle disconnection, reason = ' + reasonName);
        this.preHandle(event);
        var config = this.client.config;
        var reconnectConfig = config.reconnect;
        var should = this.shouldReconnect(event);
        var reconnectEnable = reconnectConfig.enable;
        var mustReconnect =
            reconnectEnable &&
            reason !== Const.EzyDisconnectReason.UNAUTHORIZED &&
            reason !== Const.EzyDisconnectReason.CLOSE &&
            should;
        this.client.setStatus(Const.EzyConnectionStatus.DISCONNECTED);
        if (mustReconnect) {
            this.client.reconnect((success) => {
                if (success) {
                    this.onReconnecting(event);
                } else {
                    this.onDisconnected(event);
                }
                this.postHandle(event);
            });
        } else {
            this.onDisconnected(event);
            this.postHandle(event);
        }
    }

    preHandle(event) {}

    shouldReconnect(event) {
        var reason = event.reason;
        if (reason === Const.EzyDisconnectReason.ANOTHER_SESSION_LOGIN) {
            return false;
        }
        return true;
    }

    onReconnecting(event) {}

    onDisconnected(event) {}

    postHandle(event) {}
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
        if (handler) handler.handle(data);
        else EzyLogger.warn('has no handler with event: ' + eventType);
    }
}

//======================================

class EzyHandshakeHandler {
    handle(data) {
        this.startPing();
        this.doHandle(data);
    }

    onSessionKeyDecrypted(data, sessionKey, success) {
        if (sessionKey) {
            this.client.setSessionKey(sessionKey);
        }
        if (success) {
            this.handleLogin();
        }
        this.postHandle(data);
    }

    doHandle(data) {
        this.client.sessionToken = data[1];
        this.client.sessionId = data[2];
        if (this.client.enableSSL) {
            this.decryptSessionKey(data[3], (sessionKey, success) => {
                this.onSessionKeyDecrypted(data, sessionKey, success);
            });
        } else {
            this.onSessionKeyDecrypted(data, null, true);
        }
    }

    decryptSessionKey(encryptedSessionKey, callback) {
        if (encryptedSessionKey == null) {
            if (this.client.enableDebug) {
                callback(null, true);
                return;
            }
            EzyLogger.error(
                'maybe server was not enable SSL, you must enable SSL on server or disable SSL on your client or enable debug mode'
            );
            this.client.close();
            callback(null, false);
            return;
        }
        EzyRSAProxy.getInstance().decrypt(
            encryptedSessionKey,
            this.client.privateKey,
            (sessionKey) => {
                callback(sessionKey, true);
            }
        );
    }

    postHandle(data) {}

    handleLogin() {
        var loginRequest = this.getLoginRequest();
        this.client.send(
            Const.EzyCommand.LOGIN,
            loginRequest,
            this.encryptedLoginRequest()
        );
    }

    encryptedLoginRequest() {
        return false;
    }

    getLoginRequest() {
        return ['test', 'test', 'test', []];
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
        var responseData = data[4];

        var zone = new Entity.EzyZone(this.client, zoneId, zoneName);
        var user = new Entity.EzyUser(userId, username);
        this.client.me = user;
        this.client.zone = zone;
        this.handleLoginSuccess(responseData);
        EzyLogger.info('user: ' + user.name + ' logged in successfully');
    }

    handleLoginSuccess(responseData) {}
}

class EzyLoginErrorHandler {
    handle(data) {
        this.client.disconnect(401);
        this.handleLoginError(data);
    }

    handleLoginError(data) {}
}

//=======================================================

class EzyAppAccessHandler {
    handle(data) {
        var zone = this.client.zone;
        var appManager = zone.appManager;
        var app = this.newApp(zone, data);
        appManager.addApp(app);
        this.postHandle(app, data);
        EzyLogger.info('access app: ' + app.name + ' successfully');
    }

    newApp(zone, data) {
        var appId = data[0];
        var appName = data[1];
        var app = new Entity.EzyApp(this.client, zone, appId, appName);
        return app;
    }

    postHandle(app, data) {}
}

//======================================

class EzyAppExitHandler {
    handle(data) {
        var zone = this.client.zone;
        var appManager = zone.appManager;
        var appId = data[0];
        var reasonId = data[1];
        var app = appManager.removeApp(appId);
        if (app) {
            this.postHandle(app, data);
            EzyLogger.info(
                'user exit app: ' + app.name + ', reason: ' + reasonId
            );
        }
    }

    postHandle(app, data) {}
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
        if (handler) handler(app, commandData);
        else
            EzyLogger.warn(
                'app: ' + app.name + ' has no handler for command: ' + cmd
            );
    }
}

//======================================

class EzyPluginInfoHandler {
    handle(data) {
        var zone = this.client.zone;
        var pluginManager = zone.pluginManager;
        var plugin = this.newPlugin(zone, data);
        pluginManager.addPlugin(plugin);
        this.postHandle(plugin, data);
        EzyLogger.info('request plugin: ' + plugin.name + ' info successfully');
    }

    newPlugin(zone, data) {
        var pluginId = data[0];
        var pluginName = data[1];
        var plugin = new Entity.EzyPlugin(
            this.client,
            zone,
            pluginId,
            pluginName
        );
        return plugin;
    }

    postHandle(plugin, data) {}
}

//======================================

class EzyPluginResponseHandler {
    handle(data) {
        var pluginId = data[0];
        var responseData = data[1];
        var cmd = responseData[0];
        var commandData = responseData[1];

        var plugin = this.client.getPluginById(pluginId);
        var handler = plugin.getDataHandler(cmd);
        if (handler) handler(plugin, commandData);
        else
            EzyLogger.info(
                'plugin: ' + plugin.name + ' has no handler for command: ' + cmd
            );
    }
}

//=======================================================

class EzyPongHandler {
    handle(data) {}
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
        if (handler) handler.handle(data);
        else EzyLogger.warn('has no handler with command: ' + cmd);
    }
}

//=======================================================

class EzyAppDataHandlers {
    constructor() {
        this.handlers = {};
    }

    addHandler(cmd, handler) {
        this.handlers[cmd] = handler;
    }

    getHandler(cmd) {
        var handler = this.handlers[cmd];
        return handler;
    }
}

//======================================

class EzyPluginDataHandlers {
    constructor() {
        this.handlers = {};
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
    EzyEventHandlers,
    EzyHandshakeHandler,
    EzyLoginSuccessHandler,
    EzyLoginErrorHandler,
    EzyAppAccessHandler,
    EzyAppExitHandler,
    EzyAppResponseHandler,
    EzyPluginInfoHandler,
    EzyPluginResponseHandler,
    EzyPongHandler,
    EzyAppDataHandlers,
    EzyPluginDataHandlers,
    EzyDataHandlers,
};
