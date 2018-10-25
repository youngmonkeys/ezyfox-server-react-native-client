import EzyClient from './ezy-client'
import { DeviceEventEmitter } from 'react-native';

class EzyClients {
    constructor() {
        this.clients = {};
        this.defaultClientName = "";
    }

    static getInstance() {
        if (!EzyClients.instance) {
            EzyClients.instance = new EzyClients();
        }
        return EzyClients.instance;
    }

    newClient(config, callback) {
        new EzyClient(config, client => {
            this.addClient(client);
            if(this.defaultClientName == "")
                this.defaultClientName = client.name;
            callback(client);
        });
    }

    newDefaultClient(config, callback) {
        this.newClient(config, client => {
            this.defaultClientName = client.name;
            callback(client);
        });
    }

    addClient(client) {
        this.clients[client.name] = client;
    }

    getClient(clientName) {
        return this.clients[clientName];
    }

    getDefaultClient() {
        return this.clients[this.defaultClientName];
    }

    processEvents() {
        DeviceEventEmitter.addListener('ezy.event', params => {
            var client = this.getClient(params.clientName);
            var eventType = params.eventType;
            var data = params.data;
            client.handleEvent(eventType, data);
        });
        DeviceEventEmitter.addListener('ezy.data', params => {
            var client = this.getClient(params.clientName);
            var command = params.command;
            var data = params.data;
            client.handleData(command, data);
        });
    }    
}

export default EzyClients