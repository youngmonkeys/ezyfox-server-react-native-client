//
//  EzyClientProxy.h
//  ezyfox-server-react-native-client
//
//  Created by Dung Ta Van on 10/26/18.
//  Copyright © 2018 Young Monkeys. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class EzyMethodProxy;

NS_ASSUME_NONNULL_BEGIN

@interface EzyClientProxy : RCTEventEmitter <RCTBridgeModule>
@end

NS_ASSUME_NONNULL_END
