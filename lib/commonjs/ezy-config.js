"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class EzyConfig {
  constructor() {
    this.zoneName = '';
    this.clientName;
    this.enableSSL = false;
    this.enableDebug = false;
    this.ping = new EzyPingConfig();
    this.reconnect = new EzyReconnectConfig();
  }
  getClientName() {
    if (this.clientName == null) return this.zoneName;
    return this.clientName;
  }
  toMap() {
    var map = {};
    map.clientName = this.getClientName();
    map.zoneName = this.zoneName;
    map.enableSSL = this.enableSSL;
    map.enableDebug = this.enableDebug;
    map.ping = this.ping;
    map.reconnect = this.reconnect;
    return map;
  }
}
class EzyReconnectConfig {
  constructor() {
    this.enable = true;
    this.maxReconnectCount = 5;
    this.reconnectPeriod = 3000;
  }
}
class EzyPingConfig {
  constructor() {
    this.pingPeriod = 3000;
    this.maxLostPingCount = 5;
  }
}
var _default = {
  EzyConfig,
  EzyPingConfig,
  EzyReconnectConfig
};
exports.default = _default;
//# sourceMappingURL=ezy-config.js.map