//
//  EzyClientProxy.m
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/26/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import "EzyClientProxy.h"
#import <React/RCTLog.h>

NSDictionary<NSString*, EzyMethodProxy*>* methods;

@implementation EzyClientProxy

-(instancetype)init {
    return [super init];
}

-(NSArray<NSString *> *)supportedEvents {
    return @[@"ezy.event", @"ezy.data"];
}

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
    RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_MODULE();

@end
