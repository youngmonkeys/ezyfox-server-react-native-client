import Proxy from './proxy';

export class EzyRSAProxy {
    static getInstance() {
        if (!EzyRSAProxy.instance) {
            EzyRSAProxy.instance = new EzyRSAProxy();
        }
        return EzyRSAProxy.instance;
    }

    generateKeyPair(callback) {
        Proxy.run2('generateKeyPair', {}, (keyPair) => {
            callback(keyPair);
        });
    }

    decrypt(message, privateKey, callback) {
        var params = {
            message: message,
            privateKey: privateKey,
        };
        Proxy.run2('rsaDecrypt', params, (result) => {
            callback(result);
        });
    }
}
