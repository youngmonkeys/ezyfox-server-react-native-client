# ezyfox-server-react-native-client <img src="https://github.com/youngmonkeys/ezyfox-server/blob/master/logo.png" width="48" height="48" />
react-native client for ezyfox server

# Synopsis

react-native client for ezyfox server

# Code Example

**1. Prepare to listen socket event**

```javascript
class App extends React.Component {
  constructor(args) {
    super(args);
    this.host = "192.168.51.103";
    this.clients = Ezy.Clients.getInstance();
    this.clients.processEvents();
  }
```

**2. Setup socket client**

```javascript
setupClient(client) {
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
}
```

**2. Connect to server**

```javascript
componentDidMount() {
    this.clients.newDefaultClient({zoneName: "freechat"}, client => {
      this.setupClient(client);
      client.connect(this.host, 3005);
    });
  }
```
