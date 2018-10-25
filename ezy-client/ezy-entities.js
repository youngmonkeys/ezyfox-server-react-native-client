import Const from './ezy-constants'
import Manager from './ezy-managers'

class EzyZone {
    constructor(client, id, name) {
        this.id = id;
        this.name = name;
        this.client = client;
        this.appManager = new Manager.EzyAppManager(name);
    }
}

class EzyApp {
    constructor(client, zone, id, name) {
        this.id = id;
        this.name = name;
        this.client = client;
        this.zone = zone;
        this.dataHandlers = client.handlerManager.getAppDataHandlers(name);
    }

    sendRequest(cmd, data) {
        var requestData = [this.id, [cmd, data]];
        this.client.sendRequest(Const.EzyCommand.APP_REQUEST, requestData);
    }

    getDataHandler(cmd) {
        var handler = this.dataHandlers.getHandler(cmd);
        return handler;
    }
}

class EzyUser {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

export default {EzyZone, EzyApp, EzyUser}