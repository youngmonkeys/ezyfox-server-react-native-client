import React from 'react';
import {StyleSheet, View} from 'react-native';
import Mvc from 'mvc-es6'
import Ezy from './ezy-client';
import LoginView from './views/LoginView'
import MessageView from './views/MessageView'

const ZONE_NAME = "example";
const APP_NAME = "hello-world";

export default class App extends React.Component {
  constructor(args) {
    super(args);
    this.clients = Ezy.Clients.getInstance();
    this.state = {currentView : "login"}
  }

  componentDidMount() {
    var config = new Ezy.Config();
    config.clientName = ZONE_NAME
    this.clients.newDefaultClient(config, client => {
      this.setupClient(client);
    });
  }

  setupClient(client) {
      let mvc = Mvc.getInstance();
      let models = mvc.models;
      let setup = client.setup;
      let disconnectionHandler = new Ezy.DisconnectionHandler();
      let handshakeHandler = new Ezy.HandshakeHandler();
      handshakeHandler.getLoginRequest = () => {
        let conn = models.connection;
        return [ZONE_NAME, conn.username, conn.password, []];
      };
      let loginSuccessHandler = new Ezy.LoginSuccessHandler();
      loginSuccessHandler.handleLoginSuccess = data => {
        client.send(Ezy.Command.APP_ACCESS, [APP_NAME, []]);
      };
      let accessAppHandler = new Ezy.AppAccessHandler();
      accessAppHandler.postHandle = (app, data) => {
        this.setState({currentView : "message"});
      };
      setup.addEventHandler(Ezy.EventType.DISCONNECTION, disconnectionHandler);
      setup.addDataHandler(Ezy.Command.HANDSHAKE, handshakeHandler);
      setup.addDataHandler(Ezy.Command.LOGIN, loginSuccessHandler);
      setup.addDataHandler(Ezy.Command.APP_ACCESS, accessAppHandler);
  }
  
  render() {
    let {currentView} = this.state;
    var displayView = <LoginView />;
    if(currentView == 'message')
      displayView = <MessageView />
    return (
      <View style={styles.container}>
        {displayView}
      </View>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});