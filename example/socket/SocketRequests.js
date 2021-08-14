import Ezy from 'ezyfox-server-react-native-client'
import { Command } from './SocketConstants'

export default class SocketRequests {

    static sendGreet() {
        let app = this.getApp();
        if(app) {
            app.send(Command.GREET, {who: 'React Developer'});
        }
    }

    static exitApp() {
        let app = this.getApp();
        if(app) {
            let client = Ezy.Clients.getInstance().getDefaultClient();
            client.send(Ezy.Command.APP_EXIT, [app.id]);
        }
    }

    static getApp() {
        let client = Ezy.Clients.getInstance().getDefaultClient();
        return client ? client.getApp() : null
    }
}