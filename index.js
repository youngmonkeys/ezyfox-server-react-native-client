import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import EzyClient from './ezy-client';

class App extends React.Component {
  componentDidMount() {
    setTimeout( () => {
      var client = EzyClient.newInstance();
      client.init({});
      client.connect('192.168.1.9', 3005);
    }, 3000);
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