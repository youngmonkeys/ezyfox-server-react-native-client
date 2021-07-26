const EzyCommand =  {
    ERROR : "ERROR",
    HANDSHAKE : "HANDSHAKE",
    PING : "PING",
    PONG : "PONG",
    LOGIN : "LOGIN",
    LOGIN_ERROR : "LOGIN_ERROR",
    LOGOUT : "LOGOUT",
    APP_ACCESS : "APP_ACCESS",
    APP_REQUEST : "APP_REQUEST",
    APP_EXIT : "APP_EXIT",
    APP_ACCESS_ERROR : "APP_ACCESS_ERROR",
    APP_REQUEST_ERROR: "APP_REQUEST_ERROR",
    PLUGIN_INFO : "PLUGIN_INFO",
    PLUGIN_REQUEST : "PLUGIN_REQUEST"
}

const EzyEventType = {
    CONNECTION_SUCCESS: "CONNECTION_SUCCESS",
    CONNECTION_FAILURE: "CONNECTION_FAILURE",
    DISCONNECTION : "DISCONNECTION",
    LOST_PING : "LOST_PING",
    TRY_CONNECT : "TRY_CONNECT"
}

const EzyConnectionStatus = {
    NULL: "NULL",
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    DISCONNECTED: "DISCONNECTED",
    FAILURE: "FAILURE",
    RECONNECTING: "RECONNECTING"
}

const EzyDisconnectReason = {
    CLOSE: -1,
    UNKNOWN: 0,
    IDLE: 1,
    NOT_LOGGED_IN: 2,
    ANOTHER_SESSION_LOGIN: 3,
    ADMIN_BAN: 4,
    ADMIN_KICK: 5,
    MAX_REQUEST_PER_SECOND: 6,
    MAX_REQUEST_SIZE: 7,
    SERVER_ERROR: 8,
    SERVER_NOT_RESPONDING: 400,
    UNAUTHORIZED: 401
}
  
const EzyDisconnectReasons = EzyDisconnectReasons || {};
EzyDisconnectReasons[EzyDisconnectReason.CLOSE] = "CLOSE";
EzyDisconnectReasons[EzyDisconnectReason.UNKNOWN] = "UNKNOWN";
EzyDisconnectReasons[EzyDisconnectReason.IDLE] = "IDLE";
EzyDisconnectReasons[EzyDisconnectReason.NOT_LOGGED_IN] = "NOT_LOGGED_IN";
EzyDisconnectReasons[EzyDisconnectReason.ANOTHER_SESSION_LOGIN] = "ANOTHER_SESSION_LOGIN";
EzyDisconnectReasons[EzyDisconnectReason.ADMIN_BAN] = "ADMIN_BAN";
EzyDisconnectReasons[EzyDisconnectReason.ADMIN_KICK] = "ADMIN_KICK";
EzyDisconnectReasons[EzyDisconnectReason.MAX_REQUEST_PER_SECOND] = "MAX_REQUEST_PER_SECOND";
EzyDisconnectReasons[EzyDisconnectReason.MAX_REQUEST_SIZE] = "MAX_REQUEST_SIZE";
EzyDisconnectReasons[EzyDisconnectReason.SERVER_ERROR] = "SERVER_ERROR";
EzyDisconnectReasons[EzyDisconnectReason.SERVER_NOT_RESPONDING] = "SERVER_NOT_RESPONDING";
EzyDisconnectReasons[EzyDisconnectReason.UNAUTHORIZED] = "UNAUTHORIZED";

EzyDisconnectReasons.getDisconnectReasonName = function(reasonId) {
    return EzyDisconnectReasons[reasonId] || reasonId;
}

export default {EzyCommand, EzyEventType, EzyConnectionStatus, EzyDisconnectReason, EzyDisconnectReasons}