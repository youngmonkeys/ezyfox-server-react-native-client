import Ezy from 'ezyfox-server-react-native-client';
import Mvc from 'mvc-es6';
import {Command, ZONE_NAME, APP_NAME} from './SocketConstants';

class SocketProxy {
  static instance = null;

  static getInstance() {
    if (!SocketProxy.instance) {
      SocketProxy.instance = new SocketProxy();
    }
    return SocketProxy.instance;
  }

  setup() {
    let config = new Ezy.ClientConfig();
    config.clientName = ZONE_NAME;
    config.enableSSL = true;
    config.enableDebug = true;
    config.ping.pingPeriod = 1000;
    config.ping.maxLostPingCount = 3;
    config.reconnect.reconnectPeriod = 1000;
    config.reconnect.maxReconnectCount = 10;
    let clients = Ezy.Clients.getInstance();
    clients.newDefaultClient(config, client => {
      this.doSetup(client);
    });
  }

  doSetup(client) {
    let mvc = Mvc.getInstance();
    let models = mvc.models;
    let handshakeHandler = new Ezy.HandshakeHandler();
    handshakeHandler.getLoginRequest = function () {
      let connection = models.connection;
      let username = connection.username;
      let password = connection.password;
      return [ZONE_NAME, username, password, []];
    };

    let loginSuccessHandler = new Ezy.LoginSuccessHandler();
    loginSuccessHandler.handleLoginSuccess = function () {
      let accessAppRequest = [APP_NAME, []];
      this.client.send(Ezy.Command.APP_ACCESS, accessAppRequest);
    };

    let loginErrorHandler = new Ezy.LoginErrorHandler();
    loginErrorHandler.handleLoginError = function (event) {
      let loginController = mvc.getController('login');
      loginController.updateViews('loginError', event[1]);
    };

    let accessAppHandler = new Ezy.AppAccessHandler();
    accessAppHandler.postHandle = function (app, data) {
      let routerController = mvc.getController('router');
      routerController.updateViews('change', 'message');
    };

    let exitAppHandler = new Ezy.AppExitHandler();
    exitAppHandler.postHandle = function (app, data) {
      this.client.close();
    };

    let connectionSuccessHandler = new Ezy.ConnectionSuccessHandler();
    connectionSuccessHandler.postHandle = function (event) {
      console.log('connected to server');
    };

    let disconnectionHandler = new Ezy.DisconnectionHandler();
    disconnectionHandler.preHandle = function (event) {
      let routerController = mvc.getController('router');
      routerController.updateViews('change', 'login');
    };

    let lostPingHandler = {};
    lostPingHandler.handle = function (event) {
      console.log('lost ping: ' + JSON.stringify(event));
    };

    let connectionFailureHandler = new Ezy.ConnectionFailureHandler();
    connectionFailureHandler.preHandle = function (event) {
      console.log('connection failed: ' + JSON.stringify(event));
    };

    connectionFailureHandler.onConnectionFailed = function (event) {
      console.log(
        'disconnected due to connection failed: ' + JSON.stringify(event),
      );
    };

    let setup = client.setup;
    setup.addEventHandler(
      Ezy.EventType.CONNECTION_SUCCESS,
      connectionSuccessHandler,
    );
    setup.addEventHandler(
      Ezy.EventType.CONNECTION_FAILURE,
      connectionFailureHandler,
    );
    setup.addEventHandler(Ezy.EventType.DISCONNECTION, disconnectionHandler);
    setup.addEventHandler(Ezy.EventType.LOST_PING, lostPingHandler);
    setup.addDataHandler(Ezy.Command.HANDSHAKE, handshakeHandler);
    setup.addDataHandler(Ezy.Command.LOGIN, loginSuccessHandler);
    setup.addDataHandler(Ezy.Command.LOGIN_ERROR, loginErrorHandler);
    setup.addDataHandler(Ezy.Command.APP_ACCESS, accessAppHandler);
    setup.addDataHandler(Ezy.Command.APP_EXIT, exitAppHandler);
    let setupApp = setup.setupApp(APP_NAME);

    let messageController = mvc.getController('message');

    setupApp.addDataHandler(Command.GREET, function (app, data) {
      console.log('received message: ' + JSON.stringify(data));
      messageController.updateViews(Command.GREET, data.message);
      app.send(Command.SECURE_CHAT, {who: 'Young Monkey'});
    });

    setupApp.addDataHandler(Command.SECURE_CHAT, function (app, data) {
      console.log('received message: ' + JSON.stringify(data));
      messageController.updateViews(
        Command.SECURE_CHAT,
        data['secure-message'],
      );
    });

    return client;
  }

  connect() {
    let client = this.getClient();
    client.connect('192.168.1.151', 3005);
  }

  isConnected() {
    let client = this.getClient();
    let connected = client && client.isConnected();
    return connected;
  }

  getClient() {
    let clients = Ezy.Clients.getInstance();
    let client = clients.getDefaultClient();
    return client;
  }
}

export default SocketProxy;
