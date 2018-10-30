//
//  EzyClientProxy.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/26/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import "EzyClientProxy.h"
#import <React/RCTLog.h>
#import "proxy/EzyMethodProxy.h"
#import "exception/EzyMethodCallException.h"

@implementation EzyClientProxy {
    NSDictionary<NSString*, EzyMethodProxy*>* _methods;
}

-(instancetype)init {
    self = [super init];
    if(self) {
        _methods = [NSMutableDictionary dictionary];
        [self initMethods];
    }
    return self;
}

-(void)initMethods {
    [self addMethod:[[EzyCreateClientMethod alloc]initWithComponents:self]];
    [self addMethod:[[EzyConnectMethod alloc]init]];
    [self addMethod:[[EzySendMethod alloc]init]];
    [self addMethod:[[EzyReconnectMethod alloc]init]];
    [self addMethod:[[EzySetStatusMethod alloc]init]];
    [self addMethod:[[EzyStartPingScheduleMethod alloc]init]];
}

-(void)addMethod:(EzyMethodProxy*)method {
    [_methods setValue:method forKey:[method getName]];
}

-(NSArray<NSString *> *)supportedEvents {
    return @[@"ezy.event", @"ezy.data"];
}

+ (BOOL)requiresMainQueueSetup {
    return TRUE;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
    RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_METHOD(run:(NSString*)method
                  params:(NSDictionary*)params) {
    [self run2:method params:params success:^(NSArray *response) {}];
}

RCT_EXPORT_METHOD(run2:(NSString*)method
                  params:(NSDictionary*)params
                  success:(RCTResponseSenderBlock)success) {
    [self run3:method params:params success:success failure:^(NSArray *response) {}];
}

RCT_EXPORT_METHOD(run3:(NSString*)method
                  params:(NSDictionary*)params
                  success:(RCTResponseSenderBlock) success
                  failure:(RCTResponseSenderBlock)failure) {
    EzyMethodProxy* func = [_methods valueForKey:method];
    if(!func) {
        NSString* exceptionReason = [NSString stringWithFormat:@"has no method: %@", method];
        @throw [NSException exceptionWithName:@"NSInvalidArgumentException" reason:exceptionReason userInfo:nil];
    }
    @try {
        [func validate:params];
        NSObject* result = [func invoke:params];
        NSMutableArray* array = [[NSMutableArray alloc]init];
        [array addObject:result];
        success(array);
    }
    @catch (EzyMethodCallException* e) {
        RCTLogInfo(@"call method: %@ with params %@ error: %@", method, params, [e reason]);
        NSMutableArray* array = [[NSMutableArray alloc]init];
        [array addObject:[e code]];
        [array addObject:[e reason]];
        failure(array);
    }
    @catch (NSException* e) {
        RCTLogInfo(@"call method: %@ with params %@ fatal error: %@", method, params, [e reason]);
    }
}

RCT_EXPORT_MODULE();

@end
