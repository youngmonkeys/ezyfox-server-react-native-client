import Util from './ezy-util'
import Entity from './ezy-entities'
import Const from './ezy-constants'
import Handler from './ezy-handlers'
import EzyClient from './ezy-client'
import EzyClients from './ezy-clients'
import Config from './ezy-config'

const Ezy = {
    Guid                        : Util.EzyGuid,
    Logger                      : Util.EzyLogger,
    App                         : Entity.EzyApp,
    User                        : Entity.EzyUser,
    Zone                        : Entity.EzyZone,
    Command                     : Const.EzyCommand,
    Commands                    : Const.EzyCommands,
    DisconnectReason            : Const.EzyDisconnectReason,
    DisconnectReasonNames       : Const.EzyDisconnectReasonNames,
    ConnectionFailedReason      : Const.EzyConnectionFailedReason,
    ConnectionStatus            : Const.EzyConnectionStatus,
    EventType                   : Const.EzyEventType,
    ConnectionSuccessHandler    : Handler.EzyConnectionSuccessHandler,
    ConnectionFailureHandler    : Handler.EzyConnectionFailureHandler,
    DisconnectionHandler        : Handler.EzyDisconnectionHandler,
    HandshakeHandler            : Handler.EzyHandshakeHandler,
    LoginSuccessHandler         : Handler.EzyLoginSuccessHandler,
    LoginErrorHandler           : Handler.EzyLoginErrorHandler,
    AppAccessHandler            : Handler.EzyAppAccessHandler,
    AppExitHandler              : Handler.EzyAppExitHandler,
    AppResponseHandler          : Handler.EzyAppResponseHandler,
    PluginInfoHandler           : Handler.EzyPluginInfoHandler,
    PluginResponseHandler       : Handler.EzyPluginResponseHandler,
    PongHandler                 : Handler.EzyPongHandler,
    Config                      : Config.EzyConfig,
    ReconnectConfig             : Config.EzyReconnectConfig,
    Client                      : EzyClient,
    Clients                     : EzyClients
};

export default Ezy