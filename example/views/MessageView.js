import React, {Component} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import Mvc from 'mvc-es6';
import {SocketRequests, Command} from './../socket';

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'socket has not connected yet',
      sslMessage: '',
    };
    this.mvc = Mvc.getInstance();
    this.messageController = this.mvc.getController('message');
  }

  componentDidMount() {
    this.messageController.addDefaultView(Command.GREET, message => {
      this.setState({message: message});
    });
    this.messageController.addDefaultView(Command.SECURE_CHAT, message => {
      this.setState({sslMessage: message});
    });
    SocketRequests.sendGreet();
  }

  onLogout() {
    SocketRequests.exitApp();
  }

  render() {
    const {message, sslMessage} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>message</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.title}>SSL message</Text>
        <Text style={styles.message}>{sslMessage}</Text>
        <View style={styles.emptyLine} />
        <Button title="Logout" onPress={this.onLogout.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 27,
  },
  message: {
    fontSize: 15,
  },
  emptyLine: {
    margin: 20,
  },
});

export default MessageView;
