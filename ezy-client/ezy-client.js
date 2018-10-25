import Proxy from './proxy'
import Manager from './ezy-managers'
import EzySetup from './ezy-setup'

class EzyClient {
    constructor(config, callback) {
        Proxy.run2("init", config, fullConfig => {
            this.config = fullConfig;
            this.name = this.config.clientName;
            this.zone = null;
            this.me = null;
            this.appsById = {};
            this.handlerManager = new Manager.EzyHandlerManager(this);
            this.setup = new EzySetup(this.handlerManager);
            callback(this);
        });
    }

    connect(host, port) {
        Proxy.run("connect", {clientName : this.name, host: host, port: port});
    }

    reconnect(callback) {
        Proxy.run2("reconnect", {clientName: this.name}, callback);
    }

    sendRequest(cmd, data) {
        Proxy.run("send", {clientName: this.name, request: {command: cmd, data: data}});
    }

    startPingSchedule() {
        Proxy.run("startPingSchedule", {clientName: this.name});
    }

    setStatus(status) {
        Proxy.run("setStatus", {clientName: this.name, status: status});
    }

    addApp(app) {
        this.appsById[app.id] = app;
    }

    getAppById(appId) {
        return this.appsById[appId];
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