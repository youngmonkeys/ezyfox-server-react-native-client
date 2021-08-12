import Ezy from '../ezy-client';
import Mvc from 'mvc-es6';
import {Command, SOCKET_URL, ZONE_NAME, APP_NAME} from "./SocketConstants";

class SocketProxy {

    static instance = null;

    static getInstance() {
        if (!SocketProxy.instance)
            SocketProxy.instance = new SocketProxy();
        return SocketProxy.instance;
    }

    setup() {
        let config = new Ezy.ClientConfig();
        config.clientName = ZONE_NAME
        config.enableSSL = true;
        config.enableDebug = true;
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
            let loginController = mvc.getController("login");
            loginController.updateViews("loginError", event[1]);
        };

        let accessAppHandler = new Ezy.AppAccessHandler();
        accessAppHandler.postHandle = function (app, data) {
            let routerController = mvc.getController("router");
            routerController.updateViews('change', 'message');
        };

        let exitAppHandler = new Ezy.AppExitHandler();
        exitAppHandler.postHandle = function (app, data) {
            this.client.close();
        };

        let disconnectionHandler = new Ezy.DisconnectionHandler();
        disconnectionHandler.preHandle = function (event) {
            let routerController = mvc.getController("router");
            routerController.updateViews('change', 'login');
        };

        let setup = client.setup;
        setup.addEventHandler(Ezy.EventType.DISCONNECTION, disconnectionHandler);
        setup.addDataHandler(Ezy.Command.HANDSHAKE, handshakeHandler);
        setup.addDataHandler(Ezy.Command.LOGIN, loginSuccessHandler);
        setup.addDataHandler(Ezy.Command.LOGIN_ERROR, loginErrorHandler);
        setup.addDataHandler(Ezy.Command.APP_ACCESS, accessAppHandler);
        setup.addDataHandler(Ezy.Command.APP_EXIT, exitAppHandler);
        let setupApp = setup.setupApp(APP_NAME);

        let messageController = mvc.getController("message");

        setupApp.addDataHandler(Command.GREET, function (app, data) {
            console.log("received message: " + JSON.stringify(data))
            messageController.updateViews(Command.GREET, data.message);
            app.send(Command.SECURE_CHAT, {who: "Young Monkey"});
        });

        setupApp.addDataHandler(Command.SECURE_CHAT, function (app, data) {
            console.log("received message: " + JSON.stringify(data))
            messageController.updateViews(Command.SECURE_CHAT, data["secure-message"]);
        });

        return client;
    }

    connect() {
        let url = SOCKET_URL;
        let client = this.getClient();
        client.connect(url);
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
