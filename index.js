import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import Ezy from './ezy-client';

class App extends React.Component {
  constructor(args) {
    super(args);
    this.host = "192.168.51.103";
    // this.host = "192.168.1.9";
    this.clients = Ezy.Clients.getInstance();
  }

  componentWillMount() {
    this.clients.processEvents();
  }

  componentDidMount() {
    this.clients.newDefaultClient({zoneName: "freechat"}, client => {
      console.log("new client config: " + JSON.stringify(client.config));
      var setup = client.setup;
      var handshakeHandler = new Ezy.HandshakeHandler();
      handshakeHandler.getLoginRequest = () => {
        return ["freechat", "dungtv", "123456", []];
      };
      var loginSuccessHandler = new Ezy.LoginSuccessHandler();
      loginSuccessHandler.handleLoginSuccess = data => {
        client.sendRequest(Ezy.Command.APP_ACCESS, ["freechat", []]);
      };
      var accessAppHandler = new Ezy.AppAccessHandler();
      accessAppHandler.postHandle = (app, data) => {
        app.sendRequest("5", {skip: 0, limit: 50});
      };
      setup.addDataHandler(Ezy.Command.HANDSHAKE, handshakeHandler);
      setup.addDataHandler(Ezy.Command.LOGIN, loginSuccessHandler);
      setup.addDataHandler(Ezy.Command.APP_ACCESS, accessAppHandler);
      client.connect(this.host, 3005);
    });
  }
render() {
  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Hello, World</Text>
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