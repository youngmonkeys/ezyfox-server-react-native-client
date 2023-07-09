"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _proxy = _interopRequireDefault(require("./proxy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class EzyLogger {
  static error(message) {
    var params = {
      level: 'e',
      message: message
    };
    _proxy.default.run('log', params);
  }
  static warn(message) {
    var params = {
      level: 'w',
      message: message
    };
    _proxy.default.run('log', params);
  }
  static info(message) {
    var params = {
      level: 'i',
      message: message
    };
    _proxy.default.run('log', params);
  }
}
exports.default = EzyLogger;
//# sourceMappingURL=ezy-logger.js.map