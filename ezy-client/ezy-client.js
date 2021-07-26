import Proxy from './proxy'
import Manager from './ezy-managers'
import EzySetup from './ezy-setup'
import {EzyDisconnectReason} from './ezy-constants'
import EzyLogger from './ezy-logger'

class EzyClient {
    constructor(config, callback) {
        Proxy.run2("init", config.toMap(), outputConfig => {
            this.config = outputConfig;
            this.name = outputConfig.clientName;
            this.enableSSL = config.enableSSL;
            this.enableDebug = config.enableDebug;
            this.zone = null;
            this.me = null;
            this.handlerManager = new Manager.EzyHandlerManager(this);
            this.setup = new EzySetup(this.handlerManager);
            callback(this);
        });
    }

    connect(host, port) {
        this.privateKey = null;
        this.sessionKey = null;
        Proxy.run("connect", {clientName : this.name, host: host, port: port});
    }

    reconnect(callback) {
        this.privateKey = null;
        this.sessionKey = null;
        Proxy.run2("reconnect", {clientName: this.name}, callback);
    }

    disconnect(reason) {
        var r = reason ? reason : EzyDisconnectReason.CLOSE;
        Proxy.run("disconnect", {clientName : this.name, reason : r});
    }

    close() {
        this.disconnect();
    }

    send(cmd, data, encrypted) {
        var shouldEncrypted = encrypted;
        if(encrypted && !sessionKey) {
            if(enableDebug) {
                shouldEncrypted = false;
            }
            else {
                EzyLogger.error(
                    "can not send command: $cmd, you must enable SSL " +
                    "or enable debug mode by configuration when you create the client"
                );
                return;
            }
        }
        var params = {};
        params["clientName"] = this.name;
        var requestParams = {};
        requestParams["command"] = cmd;
        requestParams["data"] = data;
        requestParams["encrypted"] = shouldEncrypted;
        params["request"] = requestParams;
        Proxy.run("send", params);
    }

    startPingSchedule() {
        Proxy.run("startPingSchedule", {clientName: this.name});
    }

    setStatus(status) {
        Proxy.run("setStatus", {clientName: this.name, status: status});
    }
    
    setSessionKey(sessionKey) {
        Proxy.run("setSessionKey", {clientName: this.name, sessionKey: sessionKey});
    }

    getApp() {
        if(this.zone) {
            var appManager = this.zone.appManager;
            var app = appManager.getApp();
            return app;
        }
        return null;
    }

    getAppById(appId) {
        if(!this.zone) return null;
        var appManager = this.zone.appManager;
        return appManager.getAppById(appId);
    }

    getPluginById(pluginId) {
        if(!this.zone) return null;
        var pluginManager = this.zone.pluginManager;
        return pluginManager.getPluginById(pluginId);
    }

    getAppManager() {
        if(!this.zone) return null;
        return this.zone.appManager;
    }

    getPluginManager() {
        if(!this.zone) return null;
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

export default EzyClient