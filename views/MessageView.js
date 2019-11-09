import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Ezy from './../ezy-client';

class MessageView extends Component {

    onLogout() {
        let clients = Ezy.Clients.getInstance();
        let client = clients.getDefaultClient();
        let appManager = client.getAppManager();
        let app = appManager.getApp();
        client.sendRequest(Ezy.Command.APP_EXIT, [app.id]);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome
                </Text>
                <View style={styles.emptyLine} />
                <Button title="Logout" onPress={this.onLogout.bind(this)} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    welcome: {
        fontSize: 27
    },
    emptyLine: {
        margin:20
    }
  });

export default MessageView;