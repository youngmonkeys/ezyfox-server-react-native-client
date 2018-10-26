//
//  EzyEventSerializer.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/26/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import "EzyEventSerializer.h"
#include "EzyHeaders.h"

EZY_USING_NAMESPACE::event;
EZY_USING_NAMESPACE::constant;

static std::map<int, std::string> sNativeConnectionFailedReasonNames = {
    {NetworkUnreachable, "NETWORK_UNREACHABLE"},
    {UnknownHost, "UNKNOWN_HOST"},
    {ConnectionRefused, "CONNECTION_REFUSED"},
    {UnknownFailure, "UNKNOWN"}
};

static std::map<int, std::string> sNativeDisconnectReasonNames = {
    {UnknownDisconnection, "UNKNOWN"},
    {Idle, "IDLE"},
    {NotLoggedIn, "NOT_LOGGED_IN"},
    {AnotherSessionLogin, "ANOTHER_SESSION_LOGIN"},
    {AdminBan, "ADMIN_BAN"},
    {AdminKick, "ADMIN_KICK"},
    {MaxRequestPerSecond, "MAX_REQUEST_PER_SECOND"},
    {MaxRequestSize, "MAX_REQUEST_SIZE"},
    {ServerError, "SERVER_ERROR"},
    {ServerNotResponding, "SERVER_NOT_RESPONDING"}
};

@implementation EzyEventSerializer

-(NSDictionary *)serialize:(void *)event {
    EzyEvent* evt = (EzyEvent*)event;
    switch (evt->getType()) {
        case ConnectionSuccess:
            return [NSDictionary init];
        case ConnectionFailure:
            return [self serializeConnectionFailureEvent:evt];
        case Disconnection:
            return [self serializeConnectionFailureEvent:evt];
        case LostPing:
            return [self serializeLostPingEvent:evt];
        case TryConnect:
            return [self serializeTryConnectEvent:evt];
        default:
            break;
    }
    [NSException raise:NSInvalidArgumentException format:@"has no serializer with event"];
    return NULL;
}

-(NSDictionary*)serializeConnectionFailureEvent: (EzyEvent*)event {
    EzyConnectionFailureEvent* mevent = (EzyConnectionFailureEvent*)event;
    NSDictionary* dict = [NSDictionary init];
    std::string reasonName = sNativeConnectionFailedReasonNames[mevent->getReason()];
    NSString* tmp = [NSString stringWithCString:reasonName.c_str() encoding:[NSString defaultCStringEncoding]];
    [dict setValue:tmp forKey:@"reason"];
    return dict;
}

-(NSDictionary*)serializeDisconnectionEvent: (EzyEvent*)event {
    EzyDisconnectionEvent* mevent = (EzyDisconnectionEvent*)event;
    NSDictionary* dict = [NSDictionary init];
    std::string reasonName = sNativeDisconnectReasonNames[mevent->getReason()];
    NSString* tmp = [NSString stringWithCString:reasonName.c_str() encoding:[NSString defaultCStringEncoding]];
    [dict setValue:tmp forKey:@"reason"];
    return dict;
}

-(NSDictionary*)serializeLostPingEvent: (EzyEvent*)event {
    EzyLostPingEvent* mevent = (EzyLostPingEvent*)event;
    NSDictionary* dict = [NSDictionary init];
    int count = mevent->getCount();
    [dict setValue:[NSNumber numberWithInt:count] forKey:@"reason"];
    return dict;
}

-(NSDictionary*)serializeTryConnectEvent: (EzyEvent*)event {
    EzyTryConnectEvent* mevent = (EzyTryConnectEvent*)event;
    NSDictionary* dict = [NSDictionary init];
    int count = mevent->getCount();
    [dict setValue:[NSNumber numberWithInt:count] forKey:@"reason"];
    return dict;
}

@end
