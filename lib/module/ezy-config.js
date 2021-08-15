class EzyConfig {
  constructor() {
    this.zoneName = '';
    this.clientName;
    this.enableSSL = false;
    this.enableDebug = false;
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

export default {
  EzyConfig,
  EzyReconnectConfig
};
//# sourceMappingURL=ezy-config.js.map