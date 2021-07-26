import Proxy from './proxy'

export default class EzyLogger {
    static error(message) {
        var params = {
            level: "e",
            message: message
        };
        Proxy.run("log", params);
    }

    static warn(message) {
        var params = {
            level: "w",
            message: message
        };
        Proxy.run("log", params);
    }

    static info(message) {
        var params = {
            level: "i",
            message: message
        };
        Proxy.run("log", params);
    }
}