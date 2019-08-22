import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import Mvc from 'mvc-es6'
import Ezy from './ezy-client';
import LoginView from './views/LoginView'
import MessageView from './views/MessageView'

class App extends React.Component {
  constructor(args) {
    super(args);
    this.clients = Ezy.Clients.getInstance();
    this.clients.processEvents();
    this.state = {currentView : "login"}
  }

  componentDidMount() {
    this.clients.newDefaultClient({zoneName: "freechat"}, client => {
      this.setupClient(client);
    });
  }

  setupClient(client) {
      let mvc = Mvc.getInstance();
      let models = mvc.models;
      let setup = client.setup;
      let handshakeHandler = new Ezy.HandshakeHandler();
      handshakeHandler.getLoginRequest = () => {
        let conn = models.connection;
        return ["freechat", conn.username, conn.password, []];
      };
      let loginSuccessHandler = new Ezy.LoginSuccessHandler();
      loginSuccessHandler.handleLoginSuccess = data => {
        client.sendRequest(Ezy.Command.APP_ACCESS, ["freechat", []]);
      };
      let accessAppHandler = new Ezy.AppAccessHandler();
      accessAppHandler.postHandle = (app, data) => {
        this.setState({currentView : "message"});
        app.sendRequest("5", {skip: 0, limit: 50});
      };
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

AppRegistry.registerComponent('freechat-react-native', () => App);