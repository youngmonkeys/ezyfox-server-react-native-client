import Const from './ezy-constants'
import Handler from './ezy-handlers'
import EzyClient from './ezy-client'
import EzyClients from './ezy-clients'

const Ezy =  {
    Command : Const.EzyCommand,
    EventType : Const.EzyEventType,
    Client : EzyClient,
    Clients : EzyClients,
    ConnectionSuccessHandler : Handler.EzyConnectionSuccessHandler,
    ConnectionFailureHandler : Handler.EzyConnectionFailureHandler,
    DisconnectionHandler : Handler.EzyDisconnectionHandler,
    HandshakeHandler : Handler.EzyHandshakeHandler,
    LoginSuccessHandler : Handler.EzyLoginSuccessHandler,
    LoginErrorHandler : Handler.EzyLoginErrorHandler,
    AppAccessHandler : Handler.EzyAppAccessHandler,
    AppResponseHandler : Handler.EzyAppResponseHandler
};

export default Ezy