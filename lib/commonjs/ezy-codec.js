"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EzyRSAProxy = void 0;

var _proxy = _interopRequireDefault(require("./proxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EzyRSAProxy {
  static getInstance() {
    if (!EzyRSAProxy.instance) {
      EzyRSAProxy.instance = new EzyRSAProxy();
    }

    return EzyRSAProxy.instance;
  }

  generateKeyPair(callback) {
    _proxy.default.run2('generateKeyPair', {}, keyPair => {
      callback(keyPair);
    });
  }

  decrypt(message, privateKey, callback) {
    var params = {
      message: message,
      privateKey: privateKey
    };

    _proxy.default.run2('rsaDecrypt', params, result => {
      callback(result);
    });
  }

}

exports.EzyRSAProxy = EzyRSAProxy;
//# sourceMappingURL=ezy-codec.js.map