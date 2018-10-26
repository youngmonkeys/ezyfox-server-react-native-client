//
//  EzyMethodProxy.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/26/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#include <map>
#include <string>
#include "EzyHeaders.h"
#import "EzyMethodProxy.h"
#import "../EzyMethodNames.h"
#import "../util/EzyNativeStrings.h"
#import "../serializer/EzyNativeSerializers.h"

EZY_USING_NAMESPACE;
EZY_USING_NAMESPACE::config;
EZY_USING_NAMESPACE::command;
EZY_USING_NAMESPACE::constant;
EZY_USING_NAMESPACE::event;
EZY_USING_NAMESPACE::handler;

static std::map<EzyEventType, std::string> sNativeEventTypeNames = {
    {ConnectionSuccess, "CONNECTION_SUCCESS"},
    {ConnectionFailure, "CONNECTION_FAILURE"},
    {Disconnection, "DISCONNECTION"},
    {LostPing, "LOST_PING"},
    {TryConnect, "TRY_CONNECT"}
};

static std::map<EzyCommand, std::string> sNativeCommandNames = {
    {Error, "ERROR"},
    {Handshake, "HANDSHAKE"},
    {Ping, "PING"},
    {Pong, "PONG"},
    {Disconnect, "DISCONNECT"},
    {Login, "LOGIN"},
    {LoginError, "LOGIN_ERROR"},
    {AppAccess, "APP_ACCESS"},
    {AppRequest, "APP_REQUEST"},
    {AppExit, "APP_EXIT"},
    {AppAccessError, "APP_ACCESS_ERROR"},
    {PluginInfo, "PLUGIN_INFO"},
    {PluginRequestByName, "PLUGIN_REQUEST_BY_NAME"},
    {PluginRequestById, "PLUGIN_REQUEST_BY_ID"}
};

EzyClients* clients = EzyClients::getInstance();

EzyClient* getClient(std::string name) {
    EzyClient* client = clients->getClient(name);
    return client;
}

EzyClient* getClient(NSString* name) {
    EzyClient* client = getClient([name UTF8String]);
    return client;
}

EzyClient* getClient(NSDictionary* params) {
    NSString* clientName = [params valueForKey:@"clientName"];
    if(!clientName)
        [NSException raise:NSInvalidArgumentException format:@"must specific client name"];
    EzyClient* client = getClient(clientName);
    return client;
}

EzyClientConfig* newConfig(NSDictionary* params) {
    EzyClientConfig* config = new EzyClientConfig();
    NSString* clientName = [params valueForKey:@"clientName"];
    NSString* zoneName = [params valueForKey:@"zoneName"];
    NSDictionary* reconnect = [params valueForKey:@"reconnect"];
    if(clientName)
        config->setClientName([clientName UTF8String]);
    if(zoneName)
        config->setZoneName([zoneName UTF8String]);
    if(reconnect) {
        NSNumber* enable = [reconnect objectForKey:@"enable"];
        NSNumber* reconnectPeriod = [reconnect objectForKey:@"reconnectPeriod"];
        NSNumber* maxReconnectCount = [reconnect objectForKey:@"maxReconnectCount"];
        EzyReconnectConfig* reconnectConfig = config->getReconnect();
        if(enable)
            reconnectConfig->setEnable([enable boolValue]);
        if(reconnectConfig)
            reconnectConfig->setReconnectPeriod((int)[reconnectPeriod integerValue]);
        if(maxReconnectCount)
            reconnectConfig->setMaxReconnectCount((int)[maxReconnectCount integerValue]);
    }
    return config;
}

class EzyNativeEventHandler :  public EzyEventHandler {
private:
    EzyClient* mClient;
    NSNotification* mNotification;
public:
    EzyNativeEventHandler(EzyClient* client, NSNotification* notification) {
        this->mClient = client;
        this->mNotification = notification;
    }
    ~EzyNativeEventHandler() {
        this->mClient = 0;
        this->mNotification = 0;
    }
public:
    void handle(EzyEvent* event) {
        std::string eventTypeName = sNativeEventTypeNames[event->getType()];
        NSDictionary* params = [NSDictionary init];
        NSDictionary* eventData = [EzyNativeSerializers serializeEvent:event];
        [params setValue:[EzyNativeStrings newNSString:mClient->getName().c_str()] forKey:@"clientName"];
        [params setValue:[EzyNativeStrings newNSString:eventTypeName.c_str()] forKey:@"eventType"];
        [params setValue:eventData forKey:@"data"];
        reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("ezy.event", params);
    }
};

class EzyNativeDataHandler : public EzyDataHandler {
public:
    void handle(entity::EzyArray* data) {
        String commandName = command.getName();
        WritableMap params = Arguments.createMap();
        WritableArray commandData = EzyNativeSerializers.toWritableArray(data);
        params.putString("clientName", client.getName());
        params.putString("command", commandName);
        params.putArray("data", commandData);
        reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("ezy.data", params);
    }
};

void setupClient(EzyClient* client) {
    EzySetup* setup = client->setup();
    for(int = 1 ; i <= NUMBER_OF_EVENTS ; i++) {
        EzyEventType eventType = (EzyEventType)i;
        setup->addEventHandler(eventType, new EzyNativeEventHandler());
    }
    for(int i = 0 ; i < NUMBER_OF_COMMANDS ; i++) {
        EzyCommand command = sCommands[i];
        setup->addDataHandler(command, new EzyNativeDataHandler());
    }
}

@implementation EzyMethodProxy
-(void)validate:(NSDictionary *)params {}
-(NSObject*)invoke: (NSDictionary*) params {return NULL;}
-(NSString*)getName {return NULL;}
@end

@implementation EzyCreateClientMethod
- (instancetype)initWithComponents:(NSNotification *)notification {
    self = [super init];
    if(self) {
        mNotification = notification;
    }
    return self;
}

-(void)validate:(NSDictionary *)params {
    if(!params)
        [NSException raise:NSInvalidArgumentException format:@"the config is null, can't create an client"];
    if(![params objectForKey: @"zoneName"])
        [NSException raise:NSInvalidArgumentException format:@"must specific zone name"];
}

-(NSObject*)invoke:(NSDictionary *)params {
    EzyClientConfig* config = newConfig(params);
    EzyClient* client = getClient(config->getClientName());
    if(client)
        client = clients->newClient(config);
    clients.addClient(client);
    setupClient(client);
    ReadableMap configMap = EzyNativeSerializers.serialize(config);
    return configMap;
}

- (NSString *)getName {
    return METHOD_INIT;
}
@end

